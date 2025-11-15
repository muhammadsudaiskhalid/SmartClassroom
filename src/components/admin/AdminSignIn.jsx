import React, { useState } from 'react';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { useNavigate } from 'react-router-dom';
// ADMIN_CREDENTIALS not used here; credentials checked via adminService.adminLogin

const AdminSignIn = ({ onSignIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    registrationNumber: '',
    password: ''
  });
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try adminLogin which supports super-admin and stored admins
      let session = null;
      try {
        session = await adminService.adminLogin(
          formData.registrationNumber,
          formData.password,
          secretKey
        );
      } catch (err) {
        // adminLogin may throw if not found, we'll attempt verifyAdmin fallback
        session = null;
      }

      // If adminLogin returned a session, persist it and create adminUser record for downstream code
      if (session) {
        localStorage.setItem('admin_session', JSON.stringify(session));

        // For university admins, try to fetch their record
        let adminRecord = null;
        if (session.type === 'university_admin') {
          try {
            adminRecord = await adminService.getAdminByRegNumber(session.username);
          } catch (e) {
            adminRecord = null;
          }
        } else if (session.type === 'super_admin') {
          adminRecord = { id: session.id, registrationNumber: session.username, name: 'Super Admin', university: null, type: 'super_admin' };
        }

        if (adminRecord) {
          localStorage.setItem('adminUser', JSON.stringify(adminRecord));
        }

        if (onSignIn) onSignIn(session);
        navigate('/admin/dashboard');
        return;
      }

      // fallback: try verifyAdmin directly (older stored-admin flow)
      const admin = await adminService.verifyAdmin(formData.registrationNumber, formData.password);
      if (admin) {
        localStorage.setItem('adminUser', JSON.stringify(admin));
        // also create a session entry for consistency
        const sessionObj = { id: admin.id, username: admin.registrationNumber, type: 'university_admin', university: admin.university };
        localStorage.setItem('admin_session', JSON.stringify(sessionObj));
        if (onSignIn) onSignIn(admin);
        navigate('/admin/dashboard');
        return;
      }

      setError('Invalid credentials. Please check your registration number and password.');
    } catch (err) {
      setError('An error occurred during sign in. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Sign in to manage your university</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Registration Number */}
            <div>
              <label 
                htmlFor="registrationNumber" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Registration Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g., ADMIN-001"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Secret Key (optional - for Super Admin) */}
            <div>
              <label 
                htmlFor="secretKey" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Secret Key (optional for Super Admin)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="secretKey"
                  name="secretKey"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Optional secret key"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Back to Main Login */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/signin')}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to main login
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 This is a secure admin portal. All activities are logged and monitored.
          </p>
        </div>

        {/* Demo Credentials (Remove in production) */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-yellow-800 mb-2">Demo Credentials:</p>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>Registration: <code className="bg-yellow-100 px-2 py-0.5 rounded">ADMIN-STU-001</code></p>
            <p>Password: <code className="bg-yellow-100 px-2 py-0.5 rounded">admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;