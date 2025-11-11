import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import Button from '../shared/Button';
import { isValidRegistrationNumber, isEmpty } from '../../utils/validators';

const SignIn = ({ onSignIn, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (isEmpty(formData.registrationNumber)) {
      newErrors.registrationNumber = 'Registration number is required';
    } else if (!isValidRegistrationNumber(formData.registrationNumber)) {
      newErrors.registrationNumber = 'Please enter a valid registration number (5-20 alphanumeric characters)';
    }

    if (isEmpty(formData.password)) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSignIn(formData.registrationNumber, formData.password);
    } catch (error) {
      setErrors({ submit: error.message || 'Sign in failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-8">
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Welcome Back</h2>
      <p className="text-neutral-600 mb-6">Sign in with your university credentials</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Registration Number */}
        <div>
          <label className="label">University Registration Number</label>
          <div className="relative">
            <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g., FA21-BSE-001"
              className={`input pl-10 ${errors.registrationNumber ? 'input-error' : ''}`}
            />
          </div>
          {errors.registrationNumber && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.registrationNumber}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`input pl-10 ${errors.password ? 'input-error' : ''}`}
            />
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-800">
            <AlertCircle size={18} />
            <p className="text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Switch to Sign Up */}
      <div className="mt-6 text-center">
        <p className="text-neutral-600 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-accent-600 hover:text-accent-700 font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
      </div>

      {/* Admin Access Link */}
      <div className="mt-4 text-center">
        <a
          href="#admin"
          className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          Admin Access
        </a>
      </div>
    </>
  );
};

export default SignIn;