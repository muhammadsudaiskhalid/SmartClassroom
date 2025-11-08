import { useState, useEffect } from 'react';
import classService from '../services/class.service';

export const useClasses = (user) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadClasses();
    }
  }, [user]);

  const loadClasses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let loadedClasses = [];

      if (user.type === 'teacher') {
        // Load teacher's classes
        loadedClasses = await classService.getTeacherClasses(user.id);
      } else {
        // Load filtered classes for student
        loadedClasses = await classService.getFilteredClasses(
          user.university,
          user.department,
          user.semester
        );
      }

      setClasses(loadedClasses);
    } catch (err) {
      console.error('Load classes error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (classData) => {
    try {
      setLoading(true);
      setError(null);

      const newClass = await classService.createClass({
        ...classData,
        teacherId: user.id,
        teacherName: user.name,
        university: user.university,
        department: user.department
      });

      setClasses(prev => [...prev, newClass]);
      return newClass;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (classId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const updatedClass = await classService.updateClass(classId, updates);
      setClasses(prev =>
        prev.map(c => (c.id === classId ? updatedClass : c))
      );

      return updatedClass;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (classId) => {
    try {
      setLoading(true);
      setError(null);

      await classService.deleteClass(classId);
      setClasses(prev => prev.filter(c => c.id !== classId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (classId, student) => {
    try {
      setLoading(true);
      setError(null);

      const updatedClass = await classService.addStudentToClass(classId, student);
      setClasses(prev =>
        prev.map(c => (c.id === classId ? updatedClass : c))
      );

      return updatedClass;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeStudent = async (classId, studentId) => {
    try {
      setLoading(true);
      setError(null);

      const updatedClass = await classService.removeStudentFromClass(classId, studentId);
      setClasses(prev =>
        prev.map(c => (c.id === classId ? updatedClass : c))
      );

      return updatedClass;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEnrolledClasses = () => {
    if (!user || user.type !== 'student') return [];
    return classes.filter(c => c.students.some(s => s.id === user.id));
  };

  const refreshClasses = () => {
    loadClasses();
  };

  return {
    classes,
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
    addStudent,
    removeStudent,
    getEnrolledClasses,
    refreshClasses
  };
};