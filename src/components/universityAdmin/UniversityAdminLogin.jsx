import React, { useState } from 'react';
import { Building2, Lock, User, AlertCircle, GraduationCap } from 'lucide-react';
import Button from '../shared/Button';
import { UNIVERSITIES } from '../../utils/constants';

const UniversityAdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    university: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.university) newErrors.university = 'Please select university';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onLogin(formData.username, formData.password, formData.university);
    } catch (error) {
      setErrors({ submit: error.message || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl mb-4">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">University Admin</h1>
          <p className="text-blue-200">Manage Your Institution</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8">
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-100 flex items-center gap-2">
              <AlertCircle size={16} />
              For university administrators only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* University Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                University
              </label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none"
                >
                  <option value="" className="bg-blue-900">Select University</option>
                  {UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni} className="bg-blue-900">{uni}</option>
                  ))}
                </select>
              </div>
              {errors.university && (
                <p className="text-red-300 text-sm mt-1">{errors.university}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Admin Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              {errors.username && (
                <p className="text-red-300 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                <p className="text-sm text-red-100 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Logging in...' : 'Access Admin Panel'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              Back to Main Login
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-blue-300">
          © 2024 Smart Classroom. University Administration Portal
        </div>
      </div>
    </div>
  );
};

export default UniversityAdminLogin;