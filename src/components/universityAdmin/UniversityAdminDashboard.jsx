import React, { useEffect, useState, useCallback, useMemo } from 'react';
import adminService from '../../services/admin.service';
import LoadingSpinner from '../shared/LoadingSpinner';
import Toast from '../shared/Toast';
import EditUserModal from '../admin/EditUserModal';
import AddUserModal from '../admin/AddUserModal';
import ResetPasswordModal from '../admin/ResetPasswordModal';

const UniversityAdminDashboard = ({ adminSession, onLogout }) => {
  const university = adminSession?.university;
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editType, setEditType] = useState('teacher');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState('teacher');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetTarget, setResetTarget] = useState({ id: null, type: null, name: '' });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [university]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [t, s, r] = await Promise.all([
        adminService.getTeachers(university),
        adminService.getStudents(university),
        adminService.getPendingRequests(university)
      ]);
      setTeachers(t || []);
      setStudents(s || []);
      setRequests(r || []);
    } catch (err) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }, []);

  const handleApprove = useCallback(async (requestId, type) => {
    try {
      await adminService.approveRequest(requestId, type, university);
      showToast(`${type} approved`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to approve', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [university]);

  const handleReject = useCallback(async (requestId) => {
    try {
      await adminService.rejectRequest(requestId, null, university);
      showToast('Request rejected', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to reject', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [university]);

  const handleDeleteUser = useCallback(async (userId, type) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminService.deleteUser(userId, type, university);
      showToast('User deleted', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [university]);

  const handleOpenEdit = useCallback((user, type) => {
    setEditUser(user);
    setEditType(type);
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = useCallback(async (userId, updates) => {
    try {
      if (editType === 'teacher') {
        await adminService.updateTeacher(userId, updates, university);
      } else {
        await adminService.updateStudent(userId, updates, university);
      }
      showToast('User updated', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to update user', 'error');
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editType, university]);

  const handleToggleStatus = useCallback(async (userId, type, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId, type, !currentStatus, university);
      showToast(currentStatus ? 'User deactivated' : 'User activated', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [university]);

  const handleCreateUser = useCallback(async (data) => {
    try {
      if (data.type === 'teacher') {
        await adminService.addTeacher({ ...data, university });
      } else {
        await adminService.addStudent({ ...data, university });
      }
      showToast('User created', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to create user', 'error');
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [university]);

  const handleResetPassword = useCallback(async (userId, type, newPassword) => {
    try {
      await adminService.resetPassword(userId, type, newPassword, university);
      showToast('Password reset', 'success');
    } catch (err) {
      showToast('Failed to reset password', 'error');
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [university]);

  // derived memoized values
  const stats = useMemo(() => ({
    totalTeachers: teachers.length,
    totalStudents: students.length,
    pendingRequests: requests.length
  }), [teachers.length, students.length, requests.length]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-orange-500">{university}</h1>
          <p className="text-sm text-orange-400">Admin Portal — Manage teachers, students and requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-neutral-500">
            <div>Teachers: <span className="font-semibold text-neutral-900">{stats.totalTeachers}</span></div>
            <div>Students: <span className="font-semibold text-neutral-900">{stats.totalStudents}</span></div>
          </div>
          <button onClick={onLogout} className="px-3 py-2 border rounded text-sm">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teachers card */}
          <section className="bg-white p-4 rounded shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-orange-500">Teachers <span className="text-sm text-neutral-500">({stats.totalTeachers})</span></h2>
              <div className="flex gap-2">
                <button onClick={() => { setAddType('teacher'); setShowAddModal(true); }} className="px-3 py-1 bg-orange-500 text-white rounded shadow-sm hover:bg-orange-600">Add Teacher</button>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {teachers.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-md hover:bg-neutral-50 transition-colors">
                  <div className="min-w-0">
                    <div className="font-medium text-neutral-900 truncate">{t.name}</div>
                    <div className="text-xs text-neutral-500 truncate">{t.registrationNumber} — {t.department}</div>
                  </div>
                  <div className="flex gap-2 items-center ml-4">
                    <button onClick={() => handleOpenEdit(t, 'teacher')} className="px-2 py-1 border rounded text-sm">Edit</button>
                    <button onClick={() => handleToggleStatus(t.id, 'teacher', t.isActive)} className="px-2 py-1 border rounded text-sm">{t.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => { setResetTarget({ id: t.id, type: 'teacher', name: t.name }); setShowResetModal(true); }} className="px-2 py-1 border rounded text-sm">Reset</button>
                    <button onClick={() => handleDeleteUser(t.id, 'teacher')} className="px-2 py-1 text-red-600 text-sm">Delete</button>
                  </div>
                </div>
              ))}
              {teachers.length === 0 && <div className="text-sm text-neutral-500">No teachers</div>}
            </div>
          </section>

          {/* Students card */}
          <section className="bg-white p-4 rounded shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-orange-500">Students <span className="text-sm text-neutral-500">({stats.totalStudents})</span></h2>
              <div className="flex gap-2">
                <button onClick={() => { setAddType('student'); setShowAddModal(true); }} className="px-3 py-1 bg-orange-500 text-white rounded shadow-sm hover:bg-orange-600">Add Student</button>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {students.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-md hover:bg-neutral-50 transition-colors">
                  <div className="min-w-0">
                    <div className="font-medium text-neutral-900 truncate">{s.name}</div>
                    <div className="text-xs text-neutral-500 truncate">{s.registrationNumber} — {s.department} — {s.semester}</div>
                  </div>
                  <div className="flex gap-2 items-center ml-4">
                    <button onClick={() => handleOpenEdit(s, 'student')} className="px-2 py-1 border rounded text-sm">Edit</button>
                    <button onClick={() => handleToggleStatus(s.id, 'student', s.isActive)} className="px-2 py-1 border rounded text-sm">{s.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => { setResetTarget({ id: s.id, type: 'student', name: s.name }); setShowResetModal(true); }} className="px-2 py-1 border rounded text-sm">Reset</button>
                    <button onClick={() => handleDeleteUser(s.id, 'student')} className="px-2 py-1 text-red-600 text-sm">Delete</button>
                  </div>
                </div>
              ))}
              {students.length === 0 && <div className="text-sm text-neutral-500">No students</div>}
            </div>
          </section>
        </div>

        {/* Pending requests full width */}
        <section className="bg-white p-4 rounded shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-orange-500">Pending Requests <span className="text-sm text-neutral-500">({stats.pendingRequests})</span></h2>
          </div>
          <div className="mt-3 space-y-3">
            {requests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-md hover:bg-neutral-50 transition-colors">
                <div className="min-w-0">
                  <div className="font-medium text-neutral-900">{req.name}</div>
                  <div className="text-xs text-neutral-500">{req.registrationNumber} — {req.department} — {req.type}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(req.id, req.type)} className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">Approve</button>
                  <button onClick={() => handleReject(req.id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                </div>
              </div>
            ))}
            {requests.length === 0 && <div className="text-sm text-neutral-500">No pending requests</div>}
          </div>
        </section>
      </div>

      {showEditModal && (
        <EditUserModal
          user={editUser}
          type={editType}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          onResetPassword={handleResetPassword}
        />
      )}

      {showAddModal && (
        <AddUserModal
          type={addType}
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateUser}
        />
      )}

      {showResetModal && (
        <ResetPasswordModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          userName={resetTarget.name}
          onConfirm={async (newPass) => {
            await handleResetPassword(resetTarget.id, resetTarget.type, newPass);
          }}
        />
      )}

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({show:false, message:'', type:''})} />}
    </div>
  );
};

export default UniversityAdminDashboard;
