import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import adminService from '../../services/admin.service';
import LoadingSpinner from '../shared/LoadingSpinner';
import AddUniversityModal from './AddUniversityModal';
import UniversityList from './UniversityList';
import Toast from '../shared/Toast';

const SuperAdminDashboard = ({ onLogout }) => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadUniversities();
    // loadUniversities is stable for this component; disable exhaustive-deps warning
    // to avoid suggesting it as a dependency which would require useCallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUniversities = async () => {
    setLoading(true);
    try {
      const list = await adminService.getUniversities();
      setUniversities(list || []);
    } catch (err) {
      showToast('Failed to load universities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data) => {
    try {
      const u = await adminService.addUniversity(data);
      setUniversities(prev => [u, ...prev]);
      showToast('University added', 'success');
    } catch (err) {
      showToast('Failed to add university', 'error');
      throw err;
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await adminService.updateUniversity(id, updates);
      setUniversities(prev => prev.map(u => u.id === id ? updated : u));
      showToast('University updated', 'success');
    } catch (err) {
      showToast('Failed to update university', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this university?')) return;
    try {
      await adminService.deleteUniversity(id);
      setUniversities(prev => prev.filter(u => u.id !== id));
      showToast('University deleted', 'success');
    } catch (err) {
      showToast('Failed to delete university', 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      const changed = await adminService.toggleUniversityStatus(id);
      setUniversities(prev => prev.map(u => u.id === id ? changed : u));
      showToast('University status updated', 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><LoadingSpinner/></div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Super Admin — Universities</h1>
          <p className="text-sm text-gray-500">Manage universities and subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-indigo-600 text-white rounded"> 
            <Plus className="w-4 h-4 inline-block mr-2"/> Add University
          </button>
          <button onClick={onLogout} className="px-3 py-2 border rounded">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <UniversityList
          universities={universities}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onToggleStatus={handleToggle}
        />
      </div>

      {showAdd && (
        <AddUniversityModal
          isOpen={showAdd}
          onClose={() => setShowAdd(false)}
          onAdd={async (data) => { await handleAdd(data); setShowAdd(false); }}
        />
      )}

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({show:false, message:'', type:''})} />}
    </div>
  );
};

export default SuperAdminDashboard;
