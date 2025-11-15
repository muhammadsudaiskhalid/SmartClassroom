import storageService from './storage.service';
import { STORAGE_KEYS } from '../utils/constants';

class ClassService {
  /**
   * Create a new class
   */
  async createClass(classData) {
    try {
      const { name, subject, semester, university, departments, teacherId, teacherName } = classData;

      const newClass = {
        id: `${STORAGE_KEYS.CLASS_PREFIX}${teacherId}:${Date.now()}`,
        name,
        subject,
        semester,
        university,
        departments: Array.isArray(departments) ? departments : [departments], // Ensure it's an array
        teacherId,
        teacherName,
        students: [],
        createdAt: new Date().toISOString()
      };

      const result = await storageService.set(
        newClass.id,
        JSON.stringify(newClass),
        true
      );

      if (!result) {
        throw new Error('Failed to create class');
      }

      return newClass;
    } catch (error) {
      console.error('Create class error:', error);
      throw error;
    }
  }

  /**
   * Get all classes for a teacher
   */
  async getTeacherClasses(teacherId) {
    try {
      return await storageService.getAllWithPrefix(
        `${STORAGE_KEYS.CLASS_PREFIX}${teacherId}:`,
        true
      );
    } catch (error) {
      console.error('Get teacher classes error:', error);
      return [];
    }
  }

  /**
   * Get all classes (for students to browse)
   */
  async getAllClasses() {
    try {
      return await storageService.getAllWithPrefix(
        STORAGE_KEYS.CLASS_PREFIX,
        true
      );
    } catch (error) {
      console.error('Get all classes error:', error);
      return [];
    }
  }

  /**
   * Get classes filtered by university, department, and semester
   */
  async getFilteredClasses(university, department, semester = null) {
    try {
      const allClasses = await this.getAllClasses();
      
      return allClasses.filter(c => {
        const matchUniversity = c.university === university;
        
        // Check if class departments include the student's department
        const matchDepartment = Array.isArray(c.departments) 
          ? c.departments.includes(department)
          : c.departments === department; // Backward compatibility
        
        const matchSemester = semester ? c.semester === semester : true;
        
        return matchUniversity && matchDepartment && matchSemester;
      });
    } catch (error) {
      console.error('Get filtered classes error:', error);
      return [];
    }
  }

  /**
   * Get a single class by ID
   */
  async getClassById(classId) {
    try {
      const result = await storageService.get(classId, true);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error('Get class error:', error);
      return null;
    }
  }

  /**
   * Update class
   */
  async updateClass(classId, updates) {
    try {
      const classData = await this.getClassById(classId);
      if (!classData) {
        throw new Error('Class not found');
      }

      const updatedClass = {
        ...classData,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const result = await storageService.set(
        classId,
        JSON.stringify(updatedClass),
        true
      );

      if (!result) {
        throw new Error('Failed to update class');
      }

      return updatedClass;
    } catch (error) {
      console.error('Update class error:', error);
      throw error;
    }
  }

  /**
   * Add student to class
   */
  async addStudentToClass(classId, student) {
    try {
      const classData = await this.getClassById(classId);
      if (!classData) {
        throw new Error('Class not found');
      }

      if (classData.students.some(s => s.id === student.id)) {
        throw new Error('Student already enrolled');
      }

      const updatedStudents = [...classData.students, student];
      return await this.updateClass(classId, { students: updatedStudents });
    } catch (error) {
      console.error('Add student error:', error);
      throw error;
    }
  }

  /**
   * Remove student from class (by teacher)
   */
  async removeStudentFromClass(classId, studentId) {
    try {
      const classData = await this.getClassById(classId);
      if (!classData) {
        throw new Error('Class not found');
      }

      const updatedStudents = classData.students.filter(s => s.id !== studentId);
      return await this.updateClass(classId, { students: updatedStudents });
    } catch (error) {
      console.error('Remove student error:', error);
      throw error;
    }
  }

  /**
   * Leave class (by student)
   */
  async leaveClass(classId, studentId) {
    try {
      const classData = await this.getClassById(classId);
      if (!classData) {
        throw new Error('Class not found');
      }

      if (!classData.students.some(s => s.id === studentId)) {
        throw new Error('You are not enrolled in this class');
      }

      const updatedStudents = classData.students.filter(s => s.id !== studentId);
      return await this.updateClass(classId, { students: updatedStudents });
    } catch (error) {
      console.error('Leave class error:', error);
      throw error;
    }
  }

  /**
   * Delete class
   */
  async deleteClass(classId) {
    try {
      const result = await storageService.delete(classId, true);
      return result !== null;
    } catch (error) {
      console.error('Delete class error:', error);
      throw error;
    }
  }

  /**
   * Get student's enrolled classes
   */
  async getStudentClasses(studentId) {
    try {
      const allClasses = await this.getAllClasses();
      return allClasses.filter(c => 
        c.students.some(s => s.id === studentId)
      );
    } catch (error) {
      console.error('Get student classes error:', error);
      return [];
    }
  }
}

const classService = new ClassService();

export default classService;