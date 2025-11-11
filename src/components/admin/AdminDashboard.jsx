import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Plus, TrendingUp, Users, Building2, BookOpen, Activity } from 'lucide-react';
import Button from '../shared/Button';
import UniversityList from './UniversityList';
import AddUniversityModal from './AddUniversityModal';
import SystemStats from './SystemStats';
import adminService from '../../services/admin.service';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('universities');
  const [universities, setUniversities] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [unis, stats] = await Promise.all([
        adminService.getAllUniversities(),
        adminService.getSystemStats()
      ]);
      setUniversities(unis);
      setSystemStats(stats);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUniversity = async (data) => {
    try {
      await adminService.addUniversity(data);
      await loadData();
      setShowAddModal(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateUniversity = async (id, updates) => {
    try {
      await adminService.updateUniversity(id, updates);
      await loadData();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDeleteUniversity = async (id) => {
    if (window.confirm('Are you sure? This will prevent all users from this university from accessing the system.')) {
      try {
        await adminService.deleteUniversity(id);
        await loadData();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleUniversityStatus(id);
      await loadData();
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'universities', label: 'Universities', icon: Building2 },
    { id: 'activity', label: 'Activity Log', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Admin Navbar */}
      <nav className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-neutral-400">Super Administrator</p>
              </div>
            </div>

            <Button
              variant="ghost"
              icon={LogOut}
              onClick={onLogout}
              className="text-red-400 hover:bg-red-500/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {systemStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Building2 size={24} className="text-blue-400" />
                <span className="text-xs text-neutral-500">Total</span>
              </div>
              <p className="text-3xl font-bold text-white">{systemStats.totalUniversities}</p>
              <p className="text-sm text-neutral-400">Universities</p>
              <p className="text-xs text-green-400 mt-2">
                {systemStats.activeUniversities} active
              </p>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Users size={24} className="text-purple-400" />
                <span className="text-xs text-neutral-500">Total</span>
              </div>
              <p className="text-3xl font-bold text-white">{systemStats.totalUsers}</p>
              <p className="text-sm text-neutral-400">Users</p>
              <p className="text-xs text-neutral-400 mt-2">
                {systemStats.totalTeachers}T / {systemStats.totalStudents}S
              </p>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen size={24} className="text-green-400" />
                <span className="text-xs text-neutral-500">Active</span>
              </div>
              <p className="text-3xl font-bold text-white">{systemStats.totalClasses}</p>
              <p className="text-sm text-neutral-400">Classes</p>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity size={24} className="text-yellow-400" />
                <span className="text-xs text-neutral-500">Pending</span>
              </div>
              <p className="text-3xl font-bold text-white">{systemStats.pendingRequests}</p>
              <p className="text-sm text-neutral-400">Requests</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'universities' && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              Add University
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
          {activeTab === 'overview' && systemStats && (
            <SystemStats stats={systemStats} universities={universities} />
          )}

          {activeTab === 'universities' && (
            <UniversityList
              universities={universities}
              onUpdate={handleUpdateUniversity}
              onDelete={handleDeleteUniversity}
              onToggleStatus={handleToggleStatus}
              loading={loading}
            />
          )}

          {activeTab === 'activity' && (
            <div className="text-center text-neutral-400 py-12">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>Activity logging coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Add University Modal */}
      <AddUniversityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddUniversity}
      />
    </div>
  );
};

export default AdminDashboard;