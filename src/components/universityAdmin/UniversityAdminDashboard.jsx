import React, { useEffect, useState } from 'react';
import adminService from '../../services/admin.service';
import LoadingSpinner from '../shared/LoadingSpinner';
import Toast from '../shared/Toast';
import EditUserModal from '../admin/EditUserModal';
import AddUserModal from '../admin/AddUserModal';

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

  useEffect(() => {
    loadData();
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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleApprove = async (requestId, type) => {
    try {
      await adminService.approveRequest(requestId, type, university);
      showToast(`${type} approved`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to approve', 'error');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await adminService.rejectRequest(requestId, null, university);
      showToast('Request rejected', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to reject', 'error');
    }
  };

  const handleDeleteUser = async (userId, type) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminService.deleteUser(userId, type, university);
      showToast('User deleted', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
  };

  const handleOpenEdit = (user, type) => {
    setEditUser(user);
    setEditType(type);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (userId, updates) => {
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
  };

  const handleToggleStatus = async (userId, type, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId, type, !currentStatus, university);
      showToast(currentStatus ? 'User deactivated' : 'User activated', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleCreateUser = async (data) => {
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
  };

  const handleResetPassword = async (userId, type, newPassword) => {
    try {
      await adminService.resetPassword(userId, type, newPassword, university);
      showToast('Password reset', 'success');
    } catch (err) {
      showToast('Failed to reset password', 'error');
      throw err;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{university} — Admin</h1>
          <p className="text-sm text-gray-500">Manage teachers, students and pending requests</p>
        </div>
        <div>
          <button onClick={onLogout} className="px-3 py-2 border rounded">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <section className="bg-white p-4 rounded">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Teachers ({teachers.length})</h2>
            <div className="flex gap-2">
              <button onClick={() => { setAddType('teacher'); setShowAddModal(true); }} className="px-3 py-1 bg-green-600 text-white rounded">Add Teacher</button>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {teachers.map(t => (
              <div key={t.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.registrationNumber} — {t.department}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(t, 'teacher')} className="px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => handleToggleStatus(t.id, 'teacher', t.isActive)} className="px-2 py-1 border rounded">{t.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => { const newPass = prompt('Enter new password (min 6 chars):'); if (newPass) handleResetPassword(t.id, 'teacher', newPass); }} className="px-2 py-1 border rounded">Reset Password</button>
                  <button onClick={() => handleDeleteUser(t.id, 'teacher')} className="px-2 py-1 text-red-600">Delete</button>
                </div>
              </div>
            ))}
            {teachers.length === 0 && <div className="text-sm text-gray-500">No teachers</div>}
          </div>
        </section>

        <section className="bg-white p-4 rounded">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Students ({students.length})</h2>
            <div className="flex gap-2">
              <button onClick={() => { setAddType('student'); setShowAddModal(true); }} className="px-3 py-1 bg-green-600 text-white rounded">Add Student</button>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {students.map(s => (
              <div key={s.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.registrationNumber} — {s.department} — {s.semester}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(s, 'student')} className="px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => handleToggleStatus(s.id, 'student', s.isActive)} className="px-2 py-1 border rounded">{s.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => { const newPass = prompt('Enter new password (min 6 chars):'); if (newPass) handleResetPassword(s.id, 'student', newPass); }} className="px-2 py-1 border rounded">Reset Password</button>
                  <button onClick={() => handleDeleteUser(s.id, 'student')} className="px-2 py-1 text-red-600">Delete</button>
                </div>
              </div>
            ))}
            {students.length === 0 && <div className="text-sm text-gray-500">No students</div>}
          </div>
        </section>

        <section className="bg-white p-4 rounded">
          <h2 className="font-semibold mb-2">Pending Requests ({requests.length})</h2>
          <div className="space-y-2">
            {requests.map(req => (
              <div key={req.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{req.name}</div>
                  <div className="text-xs text-gray-500">{req.registrationNumber} — {req.department} — {req.type}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(req.id, req.type)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                  <button onClick={() => handleReject(req.id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                </div>
              </div>
            ))}
            {requests.length === 0 && <div className="text-sm text-gray-500">No pending requests</div>}
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

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({show:false, message:'', type:''})} />}
    </div>
  );
};

export default UniversityAdminDashboard;
