import React, { useState } from 'react';
import { Shield, LogOut, Bell, Settings, User, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { adminUser, signOut, pendingRequests } = useAdmin();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      signOut();
      navigate('/admin/signin');
    }
  };

  const pendingCount = pendingRequests?.length || 0;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">Admin Portal</h1>
                <p className="text-xs text-gray-500">{adminUser?.university}</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {pendingCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {pendingCount > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          You have {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {pendingRequests && pendingRequests.length > 0 ? (
                        pendingRequests.slice(0, 5).map((request, index) => (
                          <div
                            key={index}
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setShowNotifications(false);
                              // Navigate to pending tab - you can customize this
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                request.type === 'teacher' 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'bg-green-100 text-green-600'
                              }`}>
                                <User className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {request.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  New {request.type} registration request
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {request.department}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">No new notifications</p>
                        </div>
                      )}
                    </div>
                    {pendingRequests && pendingRequests.length > 5 && (
                      <div className="p-3 border-t border-gray-200">
                        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{adminUser?.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{adminUser?.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{adminUser?.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{adminUser?.registrationNumber}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          // Navigate to profile settings
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          // Navigate to admin settings
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Admin Settings
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-200">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">University</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {adminUser?.university}
              </p>
            </div>
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {adminUser?.email}
              </p>
            </div>
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Registration Number</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {adminUser?.registrationNumber}
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;