import storageService from './storage.service';

const ADMIN_STORAGE_PREFIX = 'admin:';
const UNIVERSITIES_KEY = 'admin:universities';
const ADMIN_SESSION_KEY = 'admin:session';

class AdminService {
  /**
   * Admin login
   */
  async adminLogin(username, password, secretKey) {
    try {
      const { ADMIN_CREDENTIALS } = await import('../utils/constants');
      
      if (
        username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password &&
        secretKey === ADMIN_CREDENTIALS.secretKey
      ) {
        const adminSession = {
          username,
          loginTime: new Date().toISOString(),
          isAdmin: true
        };
        
        await storageService.set(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
        return adminSession;
      }
      
      throw new Error('Invalid admin credentials');
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  /**
   * Check admin session
   */
  async checkAdminSession() {
    try {
      const result = await storageService.get(ADMIN_SESSION_KEY);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error('Check admin session error:', error);
      return null;
    }
  }

  /**
   * Admin logout
   */
  async adminLogout() {
    try {
      await storageService.delete(ADMIN_SESSION_KEY);
      return true;
    } catch (error) {
      console.error('Admin logout error:', error);
      throw error;
    }
  }

  /**
   * Get all universities
   */
  async getAllUniversities() {
    try {
      const result = await storageService.get(UNIVERSITIES_KEY, true);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return [];
    } catch (error) {
      console.error('Get universities error:', error);
      return [];
    }
  }

  /**
   * Add university
   */
  async addUniversity(universityData) {
    try {
      const universities = await this.getAllUniversities();
      
      // Check if university already exists
      if (universities.some(u => u.name === universityData.name)) {
        throw new Error('University already exists');
      }

      const newUniversity = {
        id: `uni_${Date.now()}`,
        name: universityData.name,
        status: universityData.status || 'active',
        subscriptionType: universityData.subscriptionType,
        startDate: universityData.startDate || new Date().toISOString(),
        expiryDate: universityData.expiryDate,
        maxUsers: universityData.maxUsers || 1000,
        currentUsers: 0,
        contactEmail: universityData.contactEmail || '',
        contactPhone: universityData.contactPhone || '',
        notes: universityData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      universities.push(newUniversity);
      await storageService.set(UNIVERSITIES_KEY, JSON.stringify(universities), true);
      
      return newUniversity;
    } catch (error) {
      console.error('Add university error:', error);
      throw error;
    }
  }

  /**
   * Update university
   */
  async updateUniversity(universityId, updates) {
    try {
      const universities = await this.getAllUniversities();
      const index = universities.findIndex(u => u.id === universityId);
      
      if (index === -1) {
        throw new Error('University not found');
      }

      universities[index] = {
        ...universities[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await storageService.set(UNIVERSITIES_KEY, JSON.stringify(universities), true);
      return universities[index];
    } catch (error) {
      console.error('Update university error:', error);
      throw error;
    }
  }

  /**
   * Delete university
   */
  async deleteUniversity(universityId) {
    try {
      const universities = await this.getAllUniversities();
      const filtered = universities.filter(u => u.id !== universityId);
      
      await storageService.set(UNIVERSITIES_KEY, JSON.stringify(filtered), true);
      return true;
    } catch (error) {
      console.error('Delete university error:', error);
      throw error;
    }
  }

  /**
   * Toggle university status
   */
  async toggleUniversityStatus(universityId) {
    try {
      const universities = await this.getAllUniversities();
      const university = universities.find(u => u.id === universityId);
      
      if (!university) {
        throw new Error('University not found');
      }

      const newStatus = university.status === 'active' ? 'inactive' : 'active';
      return await this.updateUniversity(universityId, { status: newStatus });
    } catch (error) {
      console.error('Toggle status error:', error);
      throw error;
    }
  }

  /**
   * Check if university is accessible
   */
  async isUniversityAccessible(universityName) {
    try {
      const universities = await this.getAllUniversities();
      const university = universities.find(u => u.name === universityName);
      
      if (!university) {
        // If university not in admin list, allow access (backward compatibility)
        return true;
      }

      // Check status
      if (university.status !== 'active') {
        return false;
      }

      // Check expiry
      if (university.expiryDate) {
        const expiryDate = new Date(university.expiryDate);
        const now = new Date();
        if (now > expiryDate) {
          // Auto-update status to expired
          await this.updateUniversity(university.id, { status: 'expired' });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Check university access error:', error);
      return true; // Allow access on error
    }
  }

  /**
   * Get university statistics
   */
  async getUniversityStats(universityName) {
    try {
      const allUsers = await storageService.getAllWithPrefix('user:');
      const universityUsers = allUsers.filter(u => u.university === universityName);
      
      const teachers = universityUsers.filter(u => u.type === 'teacher');
      const students = universityUsers.filter(u => u.type === 'student');
      
      return {
        totalUsers: universityUsers.length,
        teachers: teachers.length,
        students: students.length,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get stats error:', error);
      return { totalUsers: 0, teachers: 0, students: 0 };
    }
  }

  /**
   * Get all system statistics
   */
  async getSystemStats() {
    try {
      const allUsers = await storageService.getAllWithPrefix('user:');
      const allClasses = await storageService.getAllWithPrefix('class:');
      const allRequests = await storageService.getAllWithPrefix('request:');
      const universities = await this.getAllUniversities();

      return {
        totalUniversities: universities.length,
        activeUniversities: universities.filter(u => u.status === 'active').length,
        totalUsers: allUsers.length,
        totalTeachers: allUsers.filter(u => u.type === 'teacher').length,
        totalStudents: allUsers.filter(u => u.type === 'student').length,
        totalClasses: allClasses.length,
        pendingRequests: allRequests.filter(r => r.status === 'pending').length,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get system stats error:', error);
      return {
        totalUniversities: 0,
        activeUniversities: 0,
        totalUsers: 0,
        totalTeachers: 0,
        totalStudents: 0,
        totalClasses: 0,
        pendingRequests: 0
      };
    }
  }
}

export default new AdminService();