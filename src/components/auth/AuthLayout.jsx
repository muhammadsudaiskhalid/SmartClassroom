import React from 'react';
import { BookOpen } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl shadow-lg mb-4">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Smart Classroom</h1>
          <p className="text-neutral-600">Connect, Learn, and Grow Together</p>
        </div>

        {/* Auth Card */}
        <div className="card shadow-xl">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-600 mt-6">
          © 2024 Smart Classroom. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;