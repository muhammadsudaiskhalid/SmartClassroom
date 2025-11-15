import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [statistics, setStatistics] = useState({
    totalTeachers: 0,
    activeTeachers: 0,
    totalStudents: 0,
    activeStudents: 0,
    pendingRequests: 0,
    totalClasses: 0,
    activeClasses: 0
  });
  const [loading, setLoading] = useState(true);

  // Load admin user from localStorage on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        const admin = JSON.parse(storedAdmin);
        setAdminUser(admin);
        loadAdminData(admin.university);
      } catch (error) {
        console.error('Error parsing stored admin:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  // Load all admin data
  const loadAdminData = async (university) => {
    try {
      setLoading(true);
      const [teachersData, studentsData, requestsData, stats] = await Promise.all([
        adminService.getTeachers(university),
        adminService.getStudents(university),
        adminService.getPendingRequests(university),
        adminService.getStatistics(university)
      ]);

      setTeachers(teachersData);
      setStudents(studentsData);
      setPendingRequests(requestsData);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in admin
  const signIn = async (registrationNumber, password) => {
    try {
      const admin = await adminService.verifyAdmin(registrationNumber, password);
      if (admin) {
        setAdminUser(admin);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        await loadAdminData(admin.university);
        return { success: true, admin };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  // Sign out admin
  const signOut = () => {
    setAdminUser(null);
    setTeachers([]);
    setStudents([]);
    setPendingRequests([]);
    setStatistics({
      totalTeachers: 0,
      activeTeachers: 0,
      totalStudents: 0,
      activeStudents: 0,
      pendingRequests: 0,
      totalClasses: 0,
      activeClasses: 0
    });
    localStorage.removeItem('adminUser');
  };

  // Add teacher
  const addTeacher = async (teacherData) => {
    try {
      const newTeacher = await adminService.addTeacher({
        ...teacherData,
        university: adminUser.university
      });
      setTeachers(prev => [...prev, newTeacher]);
      await refreshStatistics();
      return { success: true, teacher: newTeacher };
    } catch (error) {
      console.error('Error adding teacher:', error);
      return { success: false, error: 'Failed to add teacher' };
    }
  };

  // Add student
  const addStudent = async (studentData) => {
    try {
      const newStudent = await adminService.addStudent({
        ...studentData,
        university: adminUser.university
      });
      setStudents(prev => [...prev, newStudent]);
      await refreshStatistics();
      return { success: true, student: newStudent };
    } catch (error) {
      console.error('Error adding student:', error);
      return { success: false, error: 'Failed to add student' };
    }
  };

  // Delete teacher
  const deleteTeacher = async (teacherId) => {
    try {
      await adminService.deleteTeacher(teacherId, adminUser.university);
      setTeachers(prev => prev.filter(t => t.id !== teacherId));
      await refreshStatistics();
      return { success: true };
    } catch (error) {
      console.error('Error deleting teacher:', error);
      return { success: false, error: 'Failed to delete teacher' };
    }
  };

  // Delete student
  const deleteStudent = async (studentId) => {
    try {
      await adminService.deleteStudent(studentId, adminUser.university);
      setStudents(prev => prev.filter(s => s.id !== studentId));
      await refreshStatistics();
      return { success: true };
    } catch (error) {
      console.error('Error deleting student:', error);
      return { success: false, error: 'Failed to delete student' };
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId, type, isActive) => {
    try {
      await adminService.toggleUserStatus(userId, type, isActive, adminUser.university);
      
      if (type === 'teacher') {
        setTeachers(prev => 
          prev.map(t => t.id === userId ? { ...t, isActive } : t)
        );
      } else {
        setStudents(prev => 
          prev.map(s => s.id === userId ? { ...s, isActive } : s)
        );
      }
      
      await refreshStatistics();
      return { success: true };
    } catch (error) {
      console.error('Error toggling user status:', error);
      return { success: false, error: 'Failed to update user status' };
    }
  };

  // Update teacher
  const updateTeacher = async (teacherId, updates) => {
    try {
      const updatedTeacher = await adminService.updateTeacher(
        teacherId,
        updates,
        adminUser.university
      );
      setTeachers(prev => 
        prev.map(t => t.id === teacherId ? updatedTeacher : t)
      );
      return { success: true, teacher: updatedTeacher };
    } catch (error) {
      console.error('Error updating teacher:', error);
      return { success: false, error: 'Failed to update teacher' };
    }
  };

  // Update student
  const updateStudent = async (studentId, updates) => {
    try {
      const updatedStudent = await adminService.updateStudent(
        studentId,
        updates,
        adminUser.university
      );
      setStudents(prev => 
        prev.map(s => s.id === studentId ? updatedStudent : s)
      );
      return { success: true, student: updatedStudent };
    } catch (error) {
      console.error('Error updating student:', error);
      return { success: false, error: 'Failed to update student' };
    }
  };

  // Approve request
  const approveRequest = async (requestId, type) => {
    try {
      await adminService.approveRequest(requestId, type, adminUser.university);
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      await loadAdminData(adminUser.university);
      return { success: true };
    } catch (error) {
      console.error('Error approving request:', error);
      return { success: false, error: 'Failed to approve request' };
    }
  };

  // Reject request
  const rejectRequest = async (requestId, type) => {
    try {
      await adminService.rejectRequest(requestId, type, adminUser.university);
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      await refreshStatistics();
      return { success: true };
    } catch (error) {
      console.error('Error rejecting request:', error);
      return { success: false, error: 'Failed to reject request' };
    }
  };

  // Reset password
  const resetPassword = async (userId, type, newPassword) => {
    try {
      await adminService.resetPassword(userId, type, newPassword, adminUser.university);
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  };

  // Refresh statistics
  const refreshStatistics = async () => {
    if (adminUser) {
      try {
        const stats = await adminService.getStatistics(adminUser.university);
        setStatistics(stats);
      } catch (error) {
        console.error('Error refreshing statistics:', error);
      }
    }
  };

  // Get department statistics
  const getDepartmentStats = async () => {
    if (adminUser) {
      try {
        return await adminService.getDepartmentStats(adminUser.university);
      } catch (error) {
        console.error('Error fetching department stats:', error);
        return {};
      }
    }
    return {};
  };

  // Refresh all data
  const refreshData = async () => {
    if (adminUser) {
      await loadAdminData(adminUser.university);
    }
  };

  const value = {
    adminUser,
    teachers,
    students,
    pendingRequests,
    statistics,
    loading,
    signIn,
    signOut,
    addTeacher,
    addStudent,
    deleteTeacher,
    deleteStudent,
    toggleUserStatus,
    updateTeacher,
    updateStudent,
    approveRequest,
    rejectRequest,
    resetPassword,
    refreshStatistics,
    getDepartmentStats,
    refreshData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;