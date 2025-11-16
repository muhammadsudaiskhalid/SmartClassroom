import React from 'react';
import { GraduationCap, Users, AlertCircle, Building2, Mail } from 'lucide-react';
import Button from '../shared/Button';

const SignUp = ({ onSwitchToSignIn }) => {
  // Self-registration is disabled - users must be created by admins

  // Self-registration is disabled - users must be created by admins
  
  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Account Registration</h2>
      <p className="text-neutral-600 mb-6">User accounts are managed by your university administrator</p>
      
      {/* Information Alert */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How to Get Access</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Contact your university's Smart Classroom administrator</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Provide your official registration number or employee ID</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Your account will be created and credentials will be provided</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Use the provided credentials to sign in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-500 rounded-lg p-2">
              <GraduationCap size={20} className="text-white" />
            </div>
            <h4 className="font-semibold text-orange-900">For Teachers</h4>
          </div>
          <p className="text-sm text-orange-800">
            Create classes, track attendance, and manage student participation across all semesters
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 rounded-lg p-2">
              <Users size={20} className="text-white" />
            </div>
            <h4 className="font-semibold text-blue-900">For Students</h4>
          </div>
          <p className="text-sm text-blue-800">
            Join classes, view your participation minutes, and track your academic progress
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
          <Building2 size={18} />
          Need Help?
        </h4>
        <div className="space-y-2 text-sm text-neutral-700">
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-neutral-500" />
            Contact your university's IT department or registrar office
          </p>
          <p className="text-neutral-600">
            They will create your account and provide you with login credentials
          </p>
        </div>
      </div>

      {/* Sign In Button */}
      <Button
        type="button"
        variant="primary"
        fullWidth
        onClick={onSwitchToSignIn}
      >
        Go to Sign In
      </Button>

      {/* Admin Contact */}
      <div className="mt-6 text-center">
        <p className="text-neutral-600 text-sm">
          Are you a university administrator?{' '}
          <a
            href="#admin"
            className="text-accent-600 hover:text-accent-700 font-medium transition-colors"
          >
            Admin Portal
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;