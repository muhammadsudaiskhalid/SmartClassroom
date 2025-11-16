import storageService from './storage.service';

class AdminService {
  // Get all teachers for a university
  async getTeachers(university) {
    try {
      const result = await storageService.get(`teachers:${university}`, true);
      return result ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return [];
    }
  }

  // Get all students for a university
  async getStudents(university) {
    try {
      const result = await storageService.get(`students:${university}`, true);
      return result ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  // Get pending registration requests
  async getPendingRequests(university) {
    try {
      const result = await storageService.get(`pending_requests:${university}`, true);
      return result ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  }

  // Add a new teacher
  async addTeacher(teacherData) {
    try {
      const { university } = teacherData;
      const teachers = await this.getTeachers(university);
      
      const newTeacher = {
        id: `T-${Date.now()}`,
        name: teacherData.name,
        registrationNumber: teacherData.registrationNumber,
        employeeId: teacherData.employeeId,
        department: teacherData.department,
        email: teacherData.email,
        password: teacherData.password,
        university: university,
        isActive: true,
        createdAt: new Date().toISOString(),
        userType: 'teacher'
      };

      teachers.push(newTeacher);
      await storageService.set(`teachers:${university}`, JSON.stringify(teachers), true);

      // Also add to users collection for authentication
      const users = await this.getAllUsers();
      users.push({
        registrationNumber: newTeacher.registrationNumber,
        password: newTeacher.password,
        userType: 'teacher',
        university: university,
        userId: newTeacher.id
      });
      await storageService.set('all_users', JSON.stringify(users), true);

      return newTeacher;
    } catch (error) {
      console.error('Error adding teacher:', error);
      throw error;
    }
  }

  // Add a new student
  async addStudent(studentData) {
    try {
      const { university } = studentData;
      const students = await this.getStudents(university);
      
      const newStudent = {
        id: `S-${Date.now()}`,
        name: studentData.name,
        registrationNumber: studentData.registrationNumber,
        studentId: studentData.studentId,
        department: studentData.department,
        semester: studentData.semester,
        email: studentData.email,
        password: studentData.password,
        university: university,
        isActive: true,
        createdAt: new Date().toISOString(),
        userType: 'student'
      };

      students.push(newStudent);
      await storageService.set(`students:${university}`, JSON.stringify(students), true);

      // Also add to users collection for authentication
      const users = await this.getAllUsers();
      users.push({
        registrationNumber: newStudent.registrationNumber,
        password: newStudent.password,
        userType: 'student',
        university: university,
        userId: newStudent.id
      });
      await storageService.set('all_users', JSON.stringify(users), true);

      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  }

  // Add user (generic method)
  async addUser(userData) {
    if (userData.type === 'teacher') {
      return await this.addTeacher(userData);
    } else if (userData.type === 'student') {
      return await this.addStudent(userData);
    }
    throw new Error('Invalid user type');
  }

  // Delete a teacher
  async deleteTeacher(teacherId, university) {
    try {
      const teachers = await this.getTeachers(university);
      const filteredTeachers = teachers.filter(t => t.id !== teacherId);
      await storageService.set(`teachers:${university}`, JSON.stringify(filteredTeachers), true);

      // Remove from users collection
      const teacher = teachers.find(t => t.id === teacherId);
      if (teacher) {
        await this.removeFromUsers(teacher.registrationNumber);
      }

      return true;
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  }

  // Delete a student
  async deleteStudent(studentId, university) {
    try {
      const students = await this.getStudents(university);
      const filteredStudents = students.filter(s => s.id !== studentId);
      await storageService.set(`students:${university}`, JSON.stringify(filteredStudents), true);

      // Remove from users collection
      const student = students.find(s => s.id === studentId);
      if (student) {
        await this.removeFromUsers(student.registrationNumber);
      }

      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  // Delete user (generic method)
  async deleteUser(userId, type, university) {
    if (type === 'teacher') {
      return await this.deleteTeacher(userId, university);
    } else if (type === 'student') {
      return await this.deleteStudent(userId, university);
    }
    throw new Error('Invalid user type');
  }

  // Toggle user status (activate/deactivate)
  async toggleUserStatus(userId, type, isActive, university) {
    try {
      if (type === 'teacher') {
        const teachers = await this.getTeachers(university);
        const updatedTeachers = teachers.map(t => 
          t.id === userId ? { ...t, isActive } : t
        );
        await storageService.set(`teachers:${university}`, JSON.stringify(updatedTeachers), true);
      } else if (type === 'student') {
        const students = await this.getStudents(university);
        const updatedStudents = students.map(s => 
          s.id === userId ? { ...s, isActive } : s
        );
        await storageService.set(`students:${university}`, JSON.stringify(updatedStudents), true);
      }
      return true;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  // Update teacher details
  async updateTeacher(teacherId, updates, university) {
    try {
      const teachers = await this.getTeachers(university);
      const updatedTeachers = teachers.map(t => 
        t.id === teacherId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      );
      await storageService.set(`teachers:${university}`, JSON.stringify(updatedTeachers), true);
      return updatedTeachers.find(t => t.id === teacherId);
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  }

  // Update student details
  async updateStudent(studentId, updates, university) {
    try {
      const students = await this.getStudents(university);
      const updatedStudents = students.map(s => 
        s.id === studentId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      );
      await storageService.set(`students:${university}`, JSON.stringify(updatedStudents), true);
      return updatedStudents.find(s => s.id === studentId);
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  // Approve a registration request
  async approveRequest(requestId, type, university) {
    try {
      const requests = await this.getPendingRequests(university);
      const request = requests.find(r => r.id === requestId);
      
      if (!request) {
        throw new Error('Request not found');
      }

      // Add to appropriate collection
      if (type === 'teacher') {
        await this.addTeacher({
          ...request,
          university
        });
      } else if (type === 'student') {
        await this.addStudent({
          ...request,
          university
        });
      }

      // Remove from pending requests
      const updatedRequests = requests.filter(r => r.id !== requestId);
      await storageService.set(`pending_requests:${university}`, JSON.stringify(updatedRequests), true);

      return true;
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  }

  // Reject a registration request
  async rejectRequest(requestId, type, university) {
    try {
      const requests = await this.getPendingRequests(university);
      const updatedRequests = requests.filter(r => r.id !== requestId);
      await storageService.set(`pending_requests:${university}`, JSON.stringify(updatedRequests), true);
      return true;
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  }

  // Add a pending registration request
  async addPendingRequest(requestData) {
    try {
      const { university } = requestData;
      const requests = await this.getPendingRequests(university);
      
      const newRequest = {
        id: `REQ-${Date.now()}`,
        ...requestData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      requests.push(newRequest);
      await storageService.set(`pending_requests:${university}`, JSON.stringify(requests), true);

      return newRequest;
    } catch (error) {
      console.error('Error adding pending request:', error);
      throw error;
    }
  }

  // Get all users (for authentication)
  async getAllUsers() {
    try {
      const result = await storageService.get('all_users', true);
      return result ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }

  // Remove user from users collection
  async removeFromUsers(registrationNumber) {
    try {
      const users = await this.getAllUsers();
      const filteredUsers = users.filter(u => u.registrationNumber !== registrationNumber);
      await storageService.set('all_users', JSON.stringify(filteredUsers), true);
      return true;
    } catch (error) {
      console.error('Error removing from users:', error);
      throw error;
    }
  }

  // Get statistics for dashboard
  async getStatistics(university) {
    try {
      const [teachers, students, requests, classes] = await Promise.all([
        this.getTeachers(university),
        this.getStudents(university),
        this.getPendingRequests(university),
        this.getClasses(university)
      ]);

      return {
        totalTeachers: teachers.length,
        activeTeachers: teachers.filter(t => t.isActive).length,
        totalStudents: students.length,
        activeStudents: students.filter(s => s.isActive).length,
        pendingRequests: requests.length,
        totalClasses: classes.length,
        activeClasses: classes.filter(c => c.isActive).length
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        totalTeachers: 0,
        activeTeachers: 0,
        totalStudents: 0,
        activeStudents: 0,
        pendingRequests: 0,
        totalClasses: 0,
        activeClasses: 0
      };
    }
  }

  // Get all classes for a university
  async getClasses(university) {
    try {
      const result = await storageService.get(`classes:${university}`, true);
      return result ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  }

  // Reset user password
  async resetPassword(userId, type, newPassword, university) {
    try {
      if (type === 'teacher') {
        const teachers = await this.getTeachers(university);
        const teacher = teachers.find(t => t.id === userId);
        if (teacher) {
          await this.updateTeacher(userId, { password: newPassword }, university);
          // Update in users collection
          const users = await this.getAllUsers();
          const updatedUsers = users.map(u => 
            u.registrationNumber === teacher.registrationNumber 
              ? { ...u, password: newPassword } 
              : u
          );
          await storageService.set('all_users', JSON.stringify(updatedUsers), true);
        }
      } else if (type === 'student') {
        const students = await this.getStudents(university);
        const student = students.find(s => s.id === userId);
        if (student) {
          await this.updateStudent(userId, { password: newPassword }, university);
          // Update in users collection
          const users = await this.getAllUsers();
          const updatedUsers = users.map(u => 
            u.registrationNumber === student.registrationNumber 
              ? { ...u, password: newPassword } 
              : u
          );
          await storageService.set('all_users', JSON.stringify(updatedUsers), true);
        }
      }
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Get department-wise statistics
  async getDepartmentStats(university) {
    try {
      const [teachers, students] = await Promise.all([
        this.getTeachers(university),
        this.getStudents(university)
      ]);

      const departments = {};
      
      [...teachers, ...students].forEach(user => {
        if (!departments[user.department]) {
          departments[user.department] = {
            teachers: 0,
            students: 0
          };
        }
        if (user.userType === 'teacher') {
          departments[user.department].teachers++;
        } else {
          departments[user.department].students++;
        }
      });

      return departments;
    } catch (error) {
      console.error('Error fetching department stats:', error);
      return {};
    }
  }

  // Verify admin credentials
  async verifyAdmin(registrationNumber, password) {
    try {
      const result = await storageService.get('admins', true);
      const admins = result ? JSON.parse(result.value) : [];
      
      const admin = admins.find(
        a => a.registrationNumber === registrationNumber && a.password === password
      );

      return admin || null;
    } catch (error) {
      console.error('Error verifying admin:', error);
      return null;
    }
  }

  // Add a new admin
  async addAdmin(adminData) {
    try {
      const result = await storageService.get('admins', true);
      const admins = result ? JSON.parse(result.value) : [];
      
      const newAdmin = {
        id: `ADMIN-${Date.now()}`,
        name: adminData.name,
        registrationNumber: adminData.registrationNumber,
        password: adminData.password,
        university: adminData.university,
        email: adminData.email,
        createdAt: new Date().toISOString(),
        userType: 'admin'
      };

      admins.push(newAdmin);
      await storageService.set('admins', JSON.stringify(admins), true);

      return newAdmin;
    } catch (error) {
      console.error('Error adding admin:', error);
      throw error;
    }
  }

  // Get admin by registration number
  async getAdminByRegNumber(registrationNumber) {
    try {
      const result = await storageService.get('admins', true);
      const admins = result ? JSON.parse(result.value) : [];
      return admins.find(a => a.registrationNumber === registrationNumber);
    } catch (error) {
      console.error('Error fetching admin:', error);
      return null;
    }
  }

  // Check for an existing admin session (stored locally)
  async checkAdminSession() {
    try {
      // Try localStorage first (faster and more reliable in production)
      if (typeof window !== 'undefined' && window.localStorage) {
        const sessionStr = localStorage.getItem('admin_session');
        if (sessionStr) {
          try {
            return JSON.parse(sessionStr);
          } catch (e) {
            // Invalid JSON, clear it
            localStorage.removeItem('admin_session');
            return null;
          }
        }
      }
      
      // Fallback to storage service
      const result = await storageService.get('admin_session');
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error('Error checking admin session:', error);
      return null;
    }
  }

  // Admin login (supports super-admin via constants or stored admins)
  async adminLogin(username, password, secretKey) {
    try {
      // Allow super-admin via constants
      try {
        const { ADMIN_CREDENTIALS } = await import('../utils/constants');
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          const session = { id: `super_${Date.now()}`, username, type: 'super_admin' };
          
          // Save to localStorage first (more reliable)
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('admin_session', JSON.stringify(session));
          }
          await storageService.set('admin_session', JSON.stringify(session));
          return session;
        }
      } catch (e) {
        // ignore import errors
      }

      // Fallback: try stored admins
      const admin = await this.verifyAdmin(username, password);
      if (admin) {
        const session = { id: admin.id, username: admin.registrationNumber, type: 'university_admin', university: admin.university };
        
        // Save to localStorage first (more reliable)
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('admin_session', JSON.stringify(session));
        }
        await storageService.set('admin_session', JSON.stringify(session));
        return session;
      }

      throw new Error('Invalid admin credentials');
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  // Admin logout
  async adminLogout() {
    try {
      // Clear from localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('admin_session');
        localStorage.removeItem('adminUser');
      }
      await storageService.delete('admin_session');
      return true;
    } catch (error) {
      console.error('Admin logout error:', error);
      return false;
    }
  }

  // Check whether a university is accessible (active) - default true
  async isUniversityAccessible(university) {
    try {
      if (!university) return true;
      const result = await storageService.get(`university_status:${university}`);
      if (result && result.value) {
        const status = result.value;
        // treat any non-active status as inaccessible
        return status === 'active' || status === undefined || status === null;
      }
      // default allow
      return true;
    } catch (error) {
      console.error('Error checking university accessibility:', error);
      return true;
    }
  }

  // --- Universities persistence (for super-admin management)
  async getUniversities() {
    try {
      const result = await storageService.get('universities', true);
      return result ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error('Error fetching universities:', error);
      return [];
    }
  }

  async addUniversity(universityData) {
    try {
      const list = await this.getUniversities();
      const newUniv = {
        id: `UNI-${Date.now()}`,
        name: universityData.name,
        status: universityData.status || 'active',
        subscriptionType: universityData.subscriptionType || 'trial',
        startDate: universityData.startDate || new Date().toISOString(),
        expiryDate: universityData.expiryDate || null,
        maxUsers: universityData.maxUsers || 1000,
        contactEmail: universityData.contactEmail || '',
        contactPhone: universityData.contactPhone || '',
        notes: universityData.notes || '',
        currentUsers: 0
      };
      list.push(newUniv);
      await storageService.set('universities', JSON.stringify(list), true);
      // set the accessibility key too
      await storageService.set(`university_status:${newUniv.name}`, newUniv.status, true);
      // If admin credentials provided, provision a university admin account
      try {
        if (universityData.admin && universityData.admin.registrationNumber) {
          const adminPayload = {
            name: universityData.admin.name || `${newUniv.name} Admin`,
            registrationNumber: universityData.admin.registrationNumber,
            password: universityData.admin.password,
            email: universityData.admin.email || universityData.contactEmail || '',
            university: newUniv.name
          };
          const createdAdmin = await this.addAdmin(adminPayload);
          // attach admin id to university record for reference
          newUniv.adminId = createdAdmin.id;
          // persist the updated universities list with adminId
          const replaced = list.map(u => u.id === newUniv.id ? newUniv : u);
          await storageService.set('universities', JSON.stringify(replaced), true);
        }
      } catch (err) {
        // if admin creation fails, log but do not prevent university creation
        console.error('Failed to provision university admin:', err);
      }
      return newUniv;
    } catch (error) {
      console.error('Error adding university:', error);
      throw error;
    }
  }

  async updateUniversity(universityId, updates) {
    try {
      const list = await this.getUniversities();
      const updated = list.map(u => u.id === universityId ? { ...u, ...updates } : u);
      await storageService.set('universities', JSON.stringify(updated), true);
      const changed = updated.find(u => u.id === universityId);
      if (changed) {
        await storageService.set(`university_status:${changed.name}`, changed.status, true);
      }
      return changed;
    } catch (error) {
      console.error('Error updating university:', error);
      throw error;
    }
  }

  async deleteUniversity(universityId) {
    try {
      const list = await this.getUniversities();
      const toDelete = list.find(u => u.id === universityId);
      const filtered = list.filter(u => u.id !== universityId);
      await storageService.set('universities', JSON.stringify(filtered), true);
      if (toDelete) {
        await storageService.delete(`university_status:${toDelete.name}`);
      }
      return true;
    } catch (error) {
      console.error('Error deleting university:', error);
      throw error;
    }
  }

  async toggleUniversityStatus(universityId) {
    try {
      const list = await this.getUniversities();
      const updated = list.map(u => u.id === universityId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u);
      await storageService.set('universities', JSON.stringify(updated), true);
      const changed = updated.find(u => u.id === universityId);
      if (changed) await storageService.set(`university_status:${changed.name}`, changed.status, true);
      return changed;
    } catch (error) {
      console.error('Error toggling university status:', error);
      throw error;
    }
  }
}

const adminService = new AdminService();

export default adminService;
export { adminService };