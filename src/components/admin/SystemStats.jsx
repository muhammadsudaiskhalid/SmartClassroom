import React from 'react';
import { TrendingUp, Users, Building2, BookOpen, Activity, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const SystemStats = ({ stats, universities }) => {
  const activeUniversities = universities.filter(u => u.status === 'active');
  const expiringUniversities = universities.filter(u => {
    if (!u.expiryDate) return false;
    const now = new Date();
    const expiry = new Date(u.expiryDate);
    const diff = expiry - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 30 && days > 0;
  });
  const expiredUniversities = universities.filter(u => {
    if (!u.expiryDate) return false;
    return new Date(u.expiryDate) < new Date();
  });

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Users size={20} className="text-purple-400" />
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            <p className="text-sm text-neutral-400">Total Users</p>
            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="text-blue-400">{stats.totalTeachers} Teachers</span>
              <span className="text-purple-400">{stats.totalStudents} Students</span>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <BookOpen size={20} className="text-green-400" />
              <Activity size={16} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalClasses}</p>
            <p className="text-sm text-neutral-400">Active Classes</p>
            <p className="text-xs text-green-400 mt-2">Across all universities</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity size={20} className="text-yellow-400" />
              <Calendar size={16} className="text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.pendingRequests}</p>
            <p className="text-sm text-neutral-400">Pending Requests</p>
            <p className="text-xs text-neutral-500 mt-2">Join requests</p>
          </div>
        </div>
      </div>

      {/* University Health */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">University Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} className="text-green-400" />
              <p className="font-semibold text-green-400">Active</p>
            </div>
            <p className="text-3xl font-bold text-white">{activeUniversities.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Universities running smoothly</p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} className="text-yellow-400" />
              <p className="font-semibold text-yellow-400">Expiring Soon</p>
            </div>
            <p className="text-3xl font-bold text-white">{expiringUniversities.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Expiring within 30 days</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} className="text-red-400" />
              <p className="font-semibold text-red-400">Expired</p>
            </div>
            <p className="text-3xl font-bold text-white">{expiredUniversities.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Needs renewal</p>
          </div>
        </div>
      </div>

      {/* Expiring Universities Alert */}
      {expiringUniversities.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={20} className="text-yellow-400" />
            <h4 className="font-semibold text-yellow-400">Attention Required</h4>
          </div>
          <p className="text-sm text-neutral-300 mb-3">
            The following universities are expiring soon and may need renewal:
          </p>
          <div className="space-y-2">
            {expiringUniversities.map(uni => {
              const daysLeft = Math.ceil((new Date(uni.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={uni.id} className="flex items-center justify-between bg-neutral-900 rounded p-3">
                  <span className="text-sm text-white">{uni.name}</span>
                  <span className="text-xs text-yellow-400">{daysLeft} days remaining</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expired Universities Alert */}
      {expiredUniversities.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={20} className="text-red-400" />
            <h4 className="font-semibold text-red-400">Expired Universities</h4>
          </div>
          <p className="text-sm text-neutral-300 mb-3">
            These universities have expired and users cannot access their accounts:
          </p>
          <div className="space-y-2">
            {expiredUniversities.map(uni => (
              <div key={uni.id} className="flex items-center justify-between bg-neutral-900 rounded p-3">
                <span className="text-sm text-white">{uni.name}</span>
                <span className="text-xs text-red-400">Expired</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-neutral-500">
        Last updated: {new Date(stats.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default SystemStats;