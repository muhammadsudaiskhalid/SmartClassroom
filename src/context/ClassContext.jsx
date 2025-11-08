import React, { createContext, useContext, useState, useEffect } from 'react';
import classService from '../services/class.service';
import studentService from '../services/student.service';
import { useAuthContext } from './AuthContext';

const ClassContext = createContext(null);

export const ClassProvider = ({ children }) => {
  const { currentUser } = useAuthContext();
  const [classes, setClasses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadData();
    } else {
      setClasses([]);
      setRequests([]);
    }
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      let loadedClasses = [];
      if (currentUser.type === 'teacher') {
        loadedClasses = await classService.getTeacherClasses(currentUser.id);
      } else {
        loadedClasses = await classService.getFilteredClasses(
          currentUser.university,
          currentUser.department,
          currentUser.semester
        );
      }
      setClasses(loadedClasses);

      if (currentUser.type === 'student') {
        const studentRequests = await studentService.getStudentRequests(currentUser.id);
        setRequests(studentRequests);
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (classData) => {
  try {
    const newClass = await classService.createClass({
      ...classData,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      university: currentUser.university
    });
    setClasses(prev => [...prev, newClass]);
    return newClass;
  } catch (error) {
    console.error('Create class error:', error);
    throw error;
  }
};

  const updateClass = async (classId, updates) => {
    try {
      const updatedClass = await classService.updateClass(classId, updates);
      setClasses(prev => prev.map(c => (c.id === classId ? updatedClass : c)));
      return updatedClass;
    } catch (error) {
      console.error('Update class error:', error);
      throw error;
    }
  };

  const deleteClass = async (classId) => {
    try {
      await classService.deleteClass(classId);
      setClasses(prev => prev.filter(c => c.id !== classId));
    } catch (error) {
      console.error('Delete class error:', error);
      throw error;
    }
  };

  const addStudent = async (classId, student) => {
    try {
      const updatedClass = await classService.addStudentToClass(classId, student);
      setClasses(prev => prev.map(c => (c.id === classId ? updatedClass : c)));
      return updatedClass;
    } catch (error) {
      console.error('Add student error:', error);
      throw error;
    }
  };

  const removeStudent = async (classId, studentId) => {
    try {
      const updatedClass = await classService.removeStudentFromClass(classId, studentId);
      setClasses(prev => prev.map(c => (c.id === classId ? updatedClass : c)));
      return updatedClass;
    } catch (error) {
      console.error('Remove student error:', error);
      throw error;
    }
  };

  const leaveClass = async (classId) => {
    try {
      if (!currentUser || currentUser.type !== 'student') {
        throw new Error('Only students can leave classes');
      }

      await classService.leaveClass(classId, currentUser.id);
      await loadData();
    } catch (error) {
      console.error('Leave class error:', error);
      throw error;
    }
  };

  const createJoinRequest = async (classData) => {
    try {
      if (!currentUser) {
        throw new Error('User not logged in');
      }

      const requestData = {
        classId: classData.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: `${currentUser.registrationNumber}@university.edu.pk`,
        registrationNumber: currentUser.registrationNumber
      };

      const request = await studentService.createJoinRequest(requestData);
      setRequests(prev => [...prev, request]);
      return request;
    } catch (error) {
      console.error('Create join request error:', error);
      throw error;
    }
  };

  const approveRequest = async (request) => {
    try {
      await addStudent(request.classId, {
        id: request.studentId,
        name: request.studentName,
        email: request.studentEmail,
        registrationNumber: request.registrationNumber
      });

      await studentService.approveRequest(request.id);
      await studentService.deleteRequest(request.id);
      await loadData();
    } catch (error) {
      console.error('Approve request error:', error);
      throw error;
    }
  };

  const rejectRequest = async (request) => {
    try {
      await studentService.rejectRequest(request.id);
      await loadData();
    } catch (error) {
      console.error('Reject request error:', error);
      throw error;
    }
  };

  const getClassRequests = async (classId) => {
    try {
      return await studentService.getClassRequests(classId);
    } catch (error) {
      console.error('Get class requests error:', error);
      return [];
    }
  };

  const getEnrolledClasses = () => {
    if (!currentUser || currentUser.type !== 'student') return [];
    return classes.filter(c => c.students && c.students.some(s => s.id === currentUser.id));
  };

  const value = {
    classes,
    requests,
    loading,
    createClass,
    updateClass,
    deleteClass,
    addStudent,
    removeStudent,
    leaveClass,
    createJoinRequest,
    approveRequest,
    rejectRequest,
    getClassRequests,
    getEnrolledClasses,
    refreshData: loadData
  };

  return <ClassContext.Provider value={value}>{children}</ClassContext.Provider>;
};

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClassContext must be used within ClassProvider');
  }
  return context;
};