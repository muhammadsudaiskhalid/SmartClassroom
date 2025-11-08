import React, { useState } from 'react';
import { LogOut, User, BookOpen, ChevronDown, Building2, GraduationCap, Edit } from 'lucide-react';
import Button from './Button';

const Navbar = ({ user, onLogout, onEditProfile }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-md">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Smart Classroom</h1>
              <p className="text-xs text-neutral-600">
                {user?.type === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
              </p>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="w-9 h-9 bg-accent-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-accent-600" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                <p className="text-xs text-neutral-600">{user?.registrationNumber}</p>
              </div>
              <ChevronDown size={16} className="text-neutral-400" />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-20 animate-slide-in">
                  <div className="px-4 py-3 border-b border-neutral-200">
                    <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                    <p className="text-xs text-neutral-600 mt-1">{user?.registrationNumber}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center badge badge-primary capitalize">
                        {user?.type === 'teacher' ? 'Teacher' : 'Student'}
                      </span>
                      {user?.semester && (
                        <span className="inline-flex items-center badge badge-neutral">
                          <GraduationCap size={12} className="mr-1" />
                          {user?.semester}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 border-b border-neutral-200 space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                      <Building2 size={14} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                      <p className="text-neutral-600">{user?.university}</p>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <BookOpen size={14} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                      <p className="text-neutral-600">{user?.department}</p>
                    </div>
                  </div>

                  {/* Edit Profile Button */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onEditProfile();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-neutral-200"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;