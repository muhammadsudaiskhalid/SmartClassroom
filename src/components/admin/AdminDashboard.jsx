import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, BarChart3, Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import LoadingSpinner from '../shared/LoadingSpinner';
import AddUniversityModal from './AddUniversityModal';
import UniversityList from './UniversityList';
import Toast from '../shared/Toast';

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'teacher' or 'student'
  const [showAddUniversityModal, setShowAddUniversityModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    activeClasses: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    // load admin user from storage/session
    const load = async () => {
      const stored = localStorage.getItem('adminUser');
      if (stored) {
        setAdminUser(JSON.parse(stored));
      } else {
        const session = await adminService.checkAdminSession();
        if (session) {
          if (session.type === 'university_admin') {
            const rec = await adminService.getAdminByRegNumber(session.username);
            setAdminUser(rec);
          } else {
            setAdminUser({ id: session.id, registrationNumber: session.username, type: session.type });
          }
        }
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (adminUser) {
      loadDashboardData();
      if (adminUser.type === 'super_admin') loadUniversities();
    }
  }, [adminUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // only load teachers/students for a university admin
      if (adminUser && adminUser.university) {
        const [teachersData, studentsData, requestsData] = await Promise.all([
          adminService.getTeachers(adminUser.university),
          adminService.getStudents(adminUser.university),
          adminService.getPendingRequests(adminUser.university)
        ]);

        setTeachers(teachersData || []);
        setStudents(studentsData || []);
        setPendingRequests(requestsData || []);

        setStats({
          totalTeachers: teachersData?.length || 0,
          totalStudents: studentsData?.length || 0,
          activeClasses: 0,
          pendingApprovals: requestsData?.length || 0
        });
      } else {
        // clear if not a university admin
        setTeachers([]);
        setStudents([]);
        setPendingRequests([]);
        setStats({ totalTeachers: 0, totalStudents: 0, activeClasses: 0, pendingApprovals: 0 });
      }
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Universities management for super-admin
  const loadUniversities = async () => {
    try {
      const list = await adminService.getUniversities();
      setUniversities(list || []);
    } catch (error) {
      showToast('Failed to load universities', 'error');
    }
  };

  const handleAddUniversity = async (data) => {
    try {
      const newU = await adminService.addUniversity(data);
      setUniversities(prev => [newU, ...prev]);
      showToast('University added', 'success');
    } catch (error) {
      showToast('Failed to add university', 'error');
      throw error;
    }
  };

  const handleUpdateUniversity = async (id, updates) => {
    try {
      const updated = await adminService.updateUniversity(id, updates);
      setUniversities(prev => prev.map(u => u.id === id ? updated : u));
      showToast('University updated', 'success');
    } catch (error) {
      showToast('Failed to update university', 'error');
    }
  };

  const handleDeleteUniversity = async (id) => {
    if (!window.confirm('Delete this university?')) return;
    try {
      await adminService.deleteUniversity(id);
      setUniversities(prev => prev.filter(u => u.id !== id));
      showToast('University deleted', 'success');
    } catch (error) {
      showToast('Failed to delete university', 'error');
    }
  };

  const handleToggleUniversityStatus = async (id) => {
    try {
      const changed = await adminService.toggleUniversityStatus(id);
      setUniversities(prev => prev.map(u => u.id === id ? changed : u));
      showToast('University status updated', 'success');
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleAddUser = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const handleApproveRequest = async (requestId, type) => {
    try {
      await adminService.approveRequest(requestId, type, adminUser?.university);
      showToast(`${type} approved successfully`, 'success');
      loadDashboardData();
    } catch (error) {
      showToast(`Failed to approve ${type}`, 'error');
    }
  };

  const handleRejectRequest = async (requestId, type) => {
    try {
      await adminService.rejectRequest(requestId, type, adminUser?.university);
      showToast(`${type} rejected`, 'success');
      loadDashboardData();
    } catch (error) {
      showToast(`Failed to reject ${type}`, 'error');
    }
  };

  const handleDeleteUser = async (userId, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await adminService.deleteUser(userId, type, adminUser?.university);
      showToast(`${type} deleted successfully`, 'success');
      loadDashboardData();
    } catch (error) {
      showToast(`Failed to delete ${type}`, 'error');
    }
  };

  const handleToggleStatus = async (userId, type, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId, type, !currentStatus, adminUser?.university);
      // show correct action performed: if currentStatus is true (was active) we deactivated it, otherwise activated
      showToast(`${type} ${currentStatus ? 'deactivated' : 'activated'}`, 'success');
      loadDashboardData();
    } catch (error) {
      showToast(`Failed to update ${type} status`, 'error');
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || teacher.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">{adminUser?.university}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleAddUser('teacher')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Teacher
              </button>
              <button
                onClick={() => handleAddUser('student')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<GraduationCap className="w-6 h-6" />}
            title="Total Teachers"
            value={stats.totalTeachers}
            color="blue"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Students"
            value={stats.totalStudents}
            color="green"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Active Classes"
            value={stats.activeClasses}
            color="purple"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Pending Approvals"
            value={stats.pendingApprovals}
            color="orange"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-6">
              {((adminUser && adminUser.type === 'super_admin') ? ['overview', 'teachers', 'students', 'pending', 'universities'] : ['overview', 'teachers', 'students', 'pending']).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Search and Filter */}
            {(activeTab === 'teachers' || activeTab === 'students') && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or registration number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <OverviewTab
                teachers={teachers}
                students={students}
                pendingRequests={pendingRequests}
              />
            )}

            {activeTab === 'teachers' && (
              <UserTable
                users={filteredTeachers}
                type="teacher"
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
              />
            )}

            {activeTab === 'students' && (
              <UserTable
                users={filteredStudents}
                type="student"
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
              />
            )}

            {activeTab === 'pending' && (
              <PendingRequestsTab
                requests={pendingRequests}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            )}

            {activeTab === 'universities' && adminUser?.type === 'super_admin' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Universities</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAddUniversityModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add University
                    </button>
                  </div>
                </div>

                <UniversityList
                  universities={universities}
                  onUpdate={handleUpdateUniversity}
                  onDelete={handleDeleteUniversity}
                  onToggleStatus={handleToggleUniversityStatus}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          type={modalType}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadDashboardData();
            showToast(`${modalType} added successfully`, 'success');
          }}
          university={adminUser?.university}
        />
      )}

      {/* Add University Modal (super-admin) */}
      {showAddUniversityModal && (
        <AddUniversityModal
          isOpen={showAddUniversityModal}
          onClose={() => setShowAddUniversityModal(false)}
          onAdd={async (data) => {
            await handleAddUniversity(data);
            setShowAddUniversityModal(false);
          }}
        />
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ teachers, students, pendingRequests }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {pendingRequests.slice(0, 5).map((request, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{request.name}</p>
                  <p className="text-sm text-gray-500">
                    New {request.type} registration request
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{request.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// User Table Component
const UserTable = ({ users, type, onDelete, onToggleStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Registration No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {type === 'teacher' ? 'Employee ID' : 'Student ID'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.registrationNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.employeeId || user.studentId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleStatus(user.id, type, user.isActive)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title={user.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id, type)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No {type}s found</p>
        </div>
      )}
    </div>
  );
};

// Pending Requests Tab Component
const PendingRequestsTab = ({ requests, onApprove, onReject }) => {
  return (
    <div className="space-y-4">
      {requests.map((request, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{request.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  request.type === 'teacher'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {request.type}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Registration No:</span>
                  <span className="ml-2 text-gray-900">{request.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500">Department:</span>
                  <span className="ml-2 text-gray-900">{request.department}</span>
                </div>
                <div>
                  <span className="text-gray-500">{request.type === 'teacher' ? 'Employee ID' : 'Student ID'}:</span>
                  <span className="ml-2 text-gray-900">{request.employeeId || request.studentId}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 text-gray-900">{request.email}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onApprove(request.id, request.type)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => onReject(request.id, request.type)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
      {requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No pending requests</p>
        </div>
      )}
    </div>
  );
};

// Add User Modal Component
const AddUserModal = ({ type, onClose, onSuccess, university }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    employeeId: '',
    studentId: '',
    department: '',
    email: '',
    password: '',
    semester: type === 'student' ? '1st Semester' : ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.addUser({
        ...formData,
        type,
        university,
        isActive: true
      });
      onSuccess();
    } catch (error) {
      alert(`Failed to add ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Add New {type === 'teacher' ? 'Teacher' : 'Student'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
            <input
              type="text"
              required
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'teacher' ? 'Employee ID' : 'Student ID'}
            </label>
            <input
              type="text"
              required
              value={type === 'teacher' ? formData.employeeId : formData.studentId}
              onChange={(e) => setFormData({
                ...formData,
                [type === 'teacher' ? 'employeeId' : 'studentId']: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>
          {type === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i} value={`${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Semester`}>
                    {i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Semester
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : `Add ${type === 'teacher' ? 'Teacher' : 'Student'}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;