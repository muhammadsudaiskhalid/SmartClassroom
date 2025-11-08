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
import { LoadingPage } from './components/shared/LoadingSpinner';
import ToastContainer, { showToast } from './components/shared/ToastContainer';
import { useAuthContext } from './context/AuthContext';
import { useClassContext } from './context/ClassContext';
import minutesService from './services/minutes.service';
import { USER_TYPES } from './utils/constants';
import './styles/globals.css';

function App() {
  const { currentUser, loading: authLoading, signIn, signUp, signOut, updateProfile } = useAuthContext();
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

  useEffect(() => {
    if (currentUser) {
      setView('dashboard');
    } else {
      setView('signin');
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedClass) {
      loadClassData();
    }
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

  const handleSignUp = async (formData) => {
    try {
      await signUp(formData);
      showToast('Account created successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Sign up failed', 'error');
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
    if (!currentUser || currentUser.type !== USER_TYPES.STUDENT) return [];
    return classes;
  };

  const getStudentEnrolledClasses = () => {
    if (!currentUser || currentUser.type !== USER_TYPES.STUDENT) return [];
    return getEnrolledClasses();
  };

  const getEnrolledClassIds = () => {
    return getStudentEnrolledClasses().map(c => c.id);
  };

  const getPendingRequestIds = () => {
    return requests.map(r => r.classId);
  };

  if (authLoading) {
    return <LoadingPage message="Loading your session..." />;
  }

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
              onSignUp={handleSignUp}
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

        {view === 'dashboard' && currentUser.type === USER_TYPES.STUDENT && (
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

        {view === 'class-detail' && currentUser.type === USER_TYPES.STUDENT && (
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

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onUpdate={handleUpdateProfile}
      />
    </>
  );
}

export default App;