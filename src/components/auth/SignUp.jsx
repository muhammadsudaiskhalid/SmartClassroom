import React, { useState } from 'react';
import { User, Lock, GraduationCap, Users, AlertCircle, Building2, CreditCard, BookOpen } from 'lucide-react';
import Button from '../shared/Button';
import { isValidPassword, isValidName, isValidRegistrationNumber } from '../../utils/validators';
import { USER_TYPES, UNIVERSITIES, DEPARTMENTS, SEMESTERS } from '../../utils/constants';

const SignUp = ({ onSignUp, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    university: '',
    department: '',
    semester: '',
    password: '',
    confirmPassword: '',
    userType: ''
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

  const validate = () => {
    const newErrors = {};

    if (!isValidName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!isValidRegistrationNumber(formData.registrationNumber)) {
      newErrors.registrationNumber = 'Registration number must be 5-20 alphanumeric characters';
    }

    if (!formData.university) {
      newErrors.university = 'Please select a university';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }

    // Only validate semester for students
    if (formData.userType === USER_TYPES.STUDENT && !formData.semester) {
      newErrors.semester = 'Please select a semester';
    }

    if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.userType) {
      newErrors.userType = 'Please select a user type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      // Don't send semester for teachers
      const dataToSubmit = {
        ...formData,
        semester: formData.userType === USER_TYPES.STUDENT ? formData.semester : null
      };
      await onSignUp(dataToSubmit);
    } catch (error) {
      setErrors({ submit: error.message || 'Sign up failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Create Account</h2>
      <p className="text-neutral-600 mb-6">Join Smart Classroom with your university details</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Type Selection - First */}
        <div>
          <label className="label">I am a...</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, userType: USER_TYPES.TEACHER, semester: '' }));
                setErrors(prev => ({ ...prev, userType: '', semester: '' }));
              }}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.userType === USER_TYPES.TEACHER
                  ? 'border-accent-500 bg-accent-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <GraduationCap size={32} className={`mx-auto mb-2 ${
                formData.userType === USER_TYPES.TEACHER ? 'text-accent-600' : 'text-neutral-400'
              }`} />
              <p className={`font-medium ${
                formData.userType === USER_TYPES.TEACHER ? 'text-accent-900' : 'text-neutral-700'
              }`}>
                Teacher
              </p>
              <p className="text-xs text-neutral-500 mt-1">All semesters</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, userType: USER_TYPES.STUDENT }));
                setErrors(prev => ({ ...prev, userType: '' }));
              }}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.userType === USER_TYPES.STUDENT
                  ? 'border-accent-500 bg-accent-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <Users size={32} className={`mx-auto mb-2 ${
                formData.userType === USER_TYPES.STUDENT ? 'text-accent-600' : 'text-neutral-400'
              }`} />
              <p className={`font-medium ${
                formData.userType === USER_TYPES.STUDENT ? 'text-accent-900' : 'text-neutral-700'
              }`}>
                Student
              </p>
              <p className="text-xs text-neutral-500 mt-1">Specific semester</p>
            </button>
          </div>
          {errors.userType && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.userType}
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="label">Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Muhammad Ali Khan"
              className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
            />
          </div>
          {errors.name && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>

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
              placeholder={formData.userType === USER_TYPES.TEACHER ? "e.g., T-2021-CS-123" : "e.g., FA21-BSE-001"}
              className={`input pl-10 ${errors.registrationNumber ? 'input-error' : ''}`}
            />
          </div>
          {errors.registrationNumber && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.registrationNumber}
            </p>
          )}
          <p className="text-xs text-neutral-500 mt-1">This will be your username for login</p>
        </div>

        {/* University */}
        <div>
          <label className="label">University</label>
          <div className="relative">
            <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none z-10" />
            <select
              name="university"
              value={formData.university}
              onChange={handleChange}
              className={`input pl-10 appearance-none ${errors.university ? 'input-error' : ''}`}
            >
              <option value="">Select University</option>
              {UNIVERSITIES.map((uni) => (
                <option key={uni} value={uni}>{uni}</option>
              ))}
            </select>
          </div>
          {errors.university && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.university}
            </p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="label">Department</label>
          <div className="relative">
            <BookOpen size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none z-10" />
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`input pl-10 appearance-none ${errors.department ? 'input-error' : ''}`}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          {errors.department && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.department}
            </p>
          )}
        </div>

        {/* Semester - Only for Students */}
        {formData.userType === USER_TYPES.STUDENT && (
          <div>
            <label className="label">Current Semester</label>
            <div className="relative">
              <GraduationCap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none z-10" />
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`input pl-10 appearance-none ${errors.semester ? 'input-error' : ''}`}
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            {errors.semester && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.semester}
              </p>
            )}
          </div>
        )}

        {/* Show info message for teachers */}
        {formData.userType === USER_TYPES.TEACHER && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>As a teacher, you can create and manage classes for all semesters in your department.</span>
            </p>
          </div>
        )}

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
              placeholder="Create a strong password"
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

        {/* Confirm Password */}
        <div>
          <label className="label">Confirm Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.confirmPassword}
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      {/* Switch to Sign In */}
      <div className="mt-6 text-center">
        <p className="text-neutral-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToSignIn}
            className="text-accent-600 hover:text-accent-700 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;