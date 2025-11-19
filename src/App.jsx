import React, { useState, useEffect } from 'react';
import AuthLayout from './components/auth/AuthLayout';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import MainLayout from './components/layout/MainLayout';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import ClassDetail from './components/teacher/ClassDetail';
import ClassView from './components/student/ClassView';
import ProfileModal from './components/shared/ProfileModal';
import AdminSignIn from './components/admin/AdminSignIn';
import SuperAdminDashboard from './components/admin/SuperAdminDashboard';
import UniversityAdminDashboard from './components/universityAdmin/UniversityAdminDashboard';
import { LoadingPage } from './components/shared/LoadingSpinner';
import ToastContainer, { showToast } from './components/shared/ToastContainer';
import { useAuthContext } from './context/AuthContext';
import { useClassContext } from './context/ClassContext';
import { SocketProvider } from './context/SocketContext';
import adminService from './services/admin.service';
import minutesService from './services/minutes.service';
import { USER_TYPES } from './utils/constants';
import './styles/globals.css';

function App() {
  const { currentUser, loading: authLoading, signIn, signOut, updateProfile } = useAuthContext();
  const { 
    classes, 
    requests,
    loading: classLoading,
    createClass,
    deleteClass,
    removeStudent,
    leaveClass,
    createJoinRequest, 
    approveRequest, 
    rejectRequest,
    getClassRequests,
    getEnrolledClasses,
    refreshData
  } = useClassContext();

  const [view, setView] = useState('signin');
  const [selectedClass, setSelectedClass] = useState(null);
  const [classMinutes, setClassMinutes] = useState([]);
  const [classRequests, setClassRequests] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Admin state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminSession, setAdminSession] = useState(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Check URL hash for admin access
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { hash } = window.location;
        
        if (hash === '#admin' || hash === '#/admin') {
          // Check for existing admin session with timeout
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session check timeout')), 3000)
          );
          
          const session = await Promise.race([
            adminService.checkAdminSession(),
            timeoutPromise
          ]).catch(() => null);
          
          if (session) {
            setAdminSession(session);
            setIsAdminMode(true);
            setView('admin-dashboard');
          } else {
            setIsAdminMode(false);
            setView('admin-login');
          }
        } else {
          // Regular user flow - quick check only
          const session = await Promise.race([
            adminService.checkAdminSession(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000))
          ]).catch(() => null);
          
          if (session) {
            setAdminSession(session);
          }
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminAccess();

    // Listen for hash changes
    const handleHashChange = () => {
      const { hash } = window.location;
      if (hash === '#admin' || hash === '#/admin') {
        if (adminSession) {
          setIsAdminMode(true);
          setView('admin-dashboard');
        } else {
          setIsAdminMode(false);
          setView('admin-login');
        }
      } else if (isAdminMode) {
        setIsAdminMode(false);
        if (currentUser) {
          setView('dashboard');
        } else {
          setView('signin');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [adminSession, isAdminMode, currentUser]);

  // Admin handlers

  const handleAdminLogout = async () => {
    try {
      await adminService.adminLogout();
      setAdminSession(null);
      setIsAdminMode(false);
      window.location.hash = '';
      setView('signin');
      showToast('Admin logged out', 'info');
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  useEffect(() => {
    if (currentUser && !isAdminMode) {
      setView('dashboard');
    } else if (!currentUser && !isAdminMode && view !== 'admin-login') {
      setView('signin');
    }
    // This effect intentionally omits `view` from its dependency list because
    // we only want to react to changes in currentUser / isAdminMode here.
    // Adding `view` causes unnecessary re-runs. Disable the ESLint rule with
    // a clear justification.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isAdminMode]);

  useEffect(() => {
    if (selectedClass) {
      loadClassData();
    }
    // loadClassData is declared inline and calling it from this effect is
    // intentional. Wrapping loadClassData with useCallback adds noise; disable
    // the exhaustive-deps check with justification.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass]);

  const loadClassData = async () => {
    if (!selectedClass) return;

    try {
      const minutes = await minutesService.getClassMinutes(selectedClass.id);
      setClassMinutes(minutes);

      if (currentUser?.type === USER_TYPES.TEACHER) {
        const requests = await getClassRequests(selectedClass.id);
        setClassRequests(requests);
      }
    } catch (error) {
      console.error('Error loading class data:', error);
      showToast('Failed to load class data', 'error');
    }
  };

  const handleSignIn = async (registrationNumber, password) => {
    try {
      await signIn(registrationNumber, password);
      showToast('Welcome back!', 'success');
    } catch (error) {
      showToast(error.message || 'Sign in failed', 'error');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setView('signin');
      setSelectedClass(null);
      setClassMinutes([]);
      setClassRequests([]);
      showToast('Signed out successfully', 'info');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Failed to sign out', 'error');
    }
  };

  const handleUpdateProfile = async (updates) => {
    try {
      setActionLoading(true);
      await updateProfile(updates);
      
      if (currentUser?.type === USER_TYPES.STUDENT && updates.semester !== currentUser.semester) {
        await refreshData();
        showToast('Profile updated! Available classes have been refreshed.', 'success');
      } else {
        showToast('Profile updated successfully!', 'success');
      }
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateClass = async (name, subject, semester, departments) => {
    try {
      setActionLoading(true);
      await createClass({ name, subject, semester, departments });
      showToast('Class created successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to create class', 'error');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      setActionLoading(true);
      await deleteClass(classId);
      setView('dashboard');
      setSelectedClass(null);
      setClassMinutes([]);
      setClassRequests([]);
      showToast('Class deleted successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to delete class', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectClass = async (classData) => {
    setSelectedClass(classData);
    setView('class-detail');
  };

  const handleAddMinutes = async (minuteData) => {
    try {
      setActionLoading(true);
      const savedMinutes = await minutesService.saveMinutes({
        ...minuteData,
        classId: selectedClass.id
      });
      setClassMinutes(prev => {
        const existing = prev.find(m => m.id === savedMinutes.id);
        if (existing) {
          return prev.map(m => (m.id === savedMinutes.id ? savedMinutes : m));
        }
        return [savedMinutes, ...prev];
      });
      showToast('Class minutes saved successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to save class minutes', 'error');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditMinutes = async (minuteData) => {
    try {
      setActionLoading(true);
      const updatedMinutes = await minutesService.saveMinutes({
        ...minuteData,
        classId: selectedClass.id
      });
      setClassMinutes(prev => 
        prev.map(m => (m.id === updatedMinutes.id ? updatedMinutes : m))
      );
      showToast('Class minutes updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update class minutes', 'error');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMinutes = async (minuteId) => {
    try {
      setActionLoading(true);
      await minutesService.deleteMinutes(minuteId);
      setClassMinutes(prev => prev.filter(m => m.id !== minuteId));
      showToast('Class minutes deleted successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to delete class minutes', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveRequest = async (request) => {
    try {
      setActionLoading(true);
      await approveRequest(request);
      setClassRequests(prev => prev.filter(r => r.id !== request.id));
      const updatedClass = classes.find(c => c.id === selectedClass.id);
      if (updatedClass) {
        setSelectedClass(updatedClass);
      }
      showToast('Student approved successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to approve request', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      setActionLoading(true);
      await rejectRequest(request);
      setClassRequests(prev => prev.filter(r => r.id !== request.id));
      showToast('Request rejected', 'info');
    } catch (error) {
      showToast(error.message || 'Failed to reject request', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this student from the class?')) {
      return;
    }

    try {
      setActionLoading(true);
      await removeStudent(selectedClass.id, studentId);
      setSelectedClass(prev => ({
        ...prev,
        students: prev.students.filter(s => s.id !== studentId)
      }));
      showToast('Student removed successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to remove student', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestJoin = async (classData) => {
    try {
      setActionLoading(true);
      await createJoinRequest(classData);
      showToast('Join request sent! Wait for teacher approval.', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to send join request', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveClass = async (classId) => {
    try {
      setActionLoading(true);
      await leaveClass(classId);
      showToast('You have left the class successfully', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to leave class', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStudentAvailableClasses = () => {
    if (!currentUser || (currentUser.type !== USER_TYPES.STUDENT && currentUser.userType !== 'student')) {
      return [];
    }
    return classes;
  };

  const getStudentEnrolledClasses = () => {
    if (!currentUser || (currentUser.type !== USER_TYPES.STUDENT && currentUser.userType !== 'student')) {
      return [];
    }
    return getEnrolledClasses();
  };

  const getEnrolledClassIds = () => {
    return getStudentEnrolledClasses().map(c => c.id);
  };

  const getPendingRequestIds = () => {
    return requests.map(r => r.classId);
  };

  if (checkingAdmin) {
    return <LoadingPage message="Loading..." />;
  }

  // Admin Login (legacy admin and university admin flows)
  if (view === 'admin-login' && !adminSession) {
    return (
      <>
        <ToastContainer />
        <AdminSignIn onSignIn={(admin) => {
          // AdminSignIn provides the verified admin object
          setAdminSession(admin);
          setIsAdminMode(true);
          setView('admin-dashboard');
          showToast('Admin access granted', 'success');
        }} />
      </>
    );
  }

  // Admin Dashboard
  if (isAdminMode && view === 'admin-dashboard' && adminSession) {
    return (
      <>
        <ToastContainer />
        {adminSession.type === 'super_admin' ? (
          <SuperAdminDashboard onLogout={handleAdminLogout} />
        ) : (
          <UniversityAdminDashboard adminSession={adminSession} onLogout={handleAdminLogout} />
        )}
      </>
    );
  }

  // Loading state for auth
  if (authLoading) {
    return <LoadingPage message="Loading your session..." />;
  }

  // Regular User Flow
  if (!currentUser) {
    return (
      <>
        <ToastContainer />
        <AuthLayout>
          {view === 'signin' ? (
            <SignIn
              onSignIn={handleSignIn}
              onSwitchToSignUp={() => setView('signup')}
            />
          ) : (
            <SignUp
              onSwitchToSignIn={() => setView('signin')}
            />
          )}
        </AuthLayout>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <SocketProvider>
        <MainLayout 
          user={currentUser} 
          onLogout={handleLogout}
          onEditProfile={() => setShowProfileModal(true)}
        >
          {view === 'dashboard' && currentUser.type === USER_TYPES.TEACHER && (
            <TeacherDashboard
              user={currentUser}
              classes={classes}
              onCreateClass={handleCreateClass}
              onSelectClass={handleSelectClass}
              loading={classLoading || actionLoading}
            />
          )}

          {view === 'dashboard' && (currentUser.type === USER_TYPES.STUDENT || currentUser.userType === 'student') && (
            <StudentDashboard
              user={currentUser}
              myClasses={getStudentEnrolledClasses()}
              availableClasses={getStudentAvailableClasses()}
              enrolledClassIds={getEnrolledClassIds()}
              pendingRequestIds={getPendingRequestIds()}
              onRequestJoin={handleRequestJoin}
              onSelectClass={handleSelectClass}
              onLeaveClass={handleLeaveClass}
              loading={classLoading || actionLoading}
            />
          )}

          {view === 'class-detail' && currentUser.type === USER_TYPES.TEACHER && (
            <ClassDetail
              classData={selectedClass}
              minutes={classMinutes}
              requests={classRequests}
              onBack={() => {
                setView('dashboard');
                setSelectedClass(null);
                setClassMinutes([]);
                setClassRequests([]);
              }}
              onAddMinutes={handleAddMinutes}
              onEditMinutes={handleEditMinutes}
              onDeleteMinutes={handleDeleteMinutes}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onRemoveStudent={handleRemoveStudent}
              onDeleteClass={handleDeleteClass}
              loading={actionLoading}
            />
          )}

          {view === 'class-detail' && (currentUser.type === USER_TYPES.STUDENT || currentUser.userType === 'student') && (
            <ClassView
              classData={selectedClass}
              minutes={classMinutes}
              onBack={() => {
                setView('dashboard');
                setSelectedClass(null);
                setClassMinutes([]);
              }}
            />
          )}
        </MainLayout>

        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={currentUser}
          onUpdate={handleUpdateProfile}
        />
      </SocketProvider>
    </>
  );
}

export default App;