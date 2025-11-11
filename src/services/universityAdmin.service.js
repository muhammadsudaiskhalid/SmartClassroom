import storageService from './storage.service';

const UNI_ADMIN_PREFIX = 'uni_admin:';
const UNI_ADMIN_SESSION = 'uni_admin_session';
const MANAGED_USERS_PREFIX = 'managed_users:';

class UniversityAdminService {
  /**
   * University Admin Login
   */
  async universityAdminLogin(username, password, universityName) {
    try {
      const adminKey = `${UNI_ADMIN_PREFIX}${universityName}:${username}`;
      const result = await storageService.get(adminKey, true);

      if (!result || !result.value) {
        throw new Error('Invalid credentials');
      }

      const admin = JSON.parse(result.value);

      if (admin.password !== password) {
        throw new Error('Invalid credentials');
      }

      if (admin.status !== 'active') {
        throw new Error('Your account has been deactivated');
      }

      const session = {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        university: admin.university,
        role: 'university_admin',
        loginTime: new Date().toISOString()
      };

      await storageService.set(UNI_ADMIN_SESSION, JSON.stringify(session));
      return session;
    } catch (error) {
      console.error('University admin login error:', error);
      throw error;
    }
  }

  /**
   * Create University Admin (by Super Admin)
   */
  async createUniversityAdmin(adminData) {
    try {
      const { username, password, name, email, university, phone } = adminData;

      const adminKey = `${UNI_ADMIN_PREFIX}${university}:${username}`;
      
      // Check if already exists
      try {
        const existing = await storageService.get(adminKey, true);
        if (existing) {
          throw new Error('Admin username already exists for this university');
        }
      } catch (error) {
        if (error.message.includes('already exists')) {
          throw error;
        }
      }

      const newAdmin = {
        id: `uni_admin_${Date.now()}`,
        username,
        password,
        name,
        email,
        university,
        phone: phone || '',
        role: 'university_admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      await storageService.set(adminKey, JSON.stringify(newAdmin), true);
      return newAdmin;
    } catch (error) {
      console.error('Create university admin error:', error);
      throw error;
    }
  }

  /**
   * Get University Admin Session
   */
  async getSession() {
    try {
      const result = await storageService.get(UNI_ADMIN_SESSION);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * University Admin Logout
   */
  async logout() {
    try {
      await storageService.delete(UNI_ADMIN_SESSION);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Add Pre-registered User (Teacher/Student)
   */
  async addPreRegisteredUser(userData) {
    try {
      const { 
        name, 
        registrationNumber, 
        employeeId,
        email,
        department, 
        semester, 
        userType, 
        university 
      } = userData;

      const userKey = `${MANAGED_USERS_PREFIX}${university}:${registrationNumber}`;

      // Check if already exists
      try {
        const existing = await storageService.get(userKey, true);
        if (existing) {
          throw new Error('Registration number already exists');
        }
      } catch (error) {
        if (error.message.includes('already exists')) {
          throw error;
        }
      }

      const newUser = {
        id: `pre_reg_${Date.now()}`,
        name,
        registrationNumber,
        employeeId: employeeId || '',
        email: email || '',
        department,
        semester: semester || null,
        userType,
        university,
        status: 'pending', // pending until they create account
        hasAccount: false,
        accountCreatedAt: null,
        addedBy: userData.addedBy || 'university_admin',
        createdAt: new Date().toISOString()
      };

      await storageService.set(userKey, JSON.stringify(newUser), true);
      return newUser;
    } catch (error) {
      console.error('Add pre-registered user error:', error);
      throw error;
    }
  }

  /**
   * Get all pre-registered users for a university
   */
  async getUniversityUsers(university) {
    try {
      const users = await storageService.getAllWithPrefix(
        `${MANAGED_USERS_PREFIX}${university}:`,
        true
      );
      return users;
    } catch (error) {
      console.error('Get university users error:', error);
      return [];
    }
  }

  /**
   * Update pre-registered user
   */
  async updatePreRegisteredUser(university, registrationNumber, updates) {
    try {
      const userKey = `${MANAGED_USERS_PREFIX}${university}:${registrationNumber}`;
      const result = await storageService.get(userKey, true);

      if (!result || !result.value) {
        throw new Error('User not found');
      }

      const user = JSON.parse(result.value);
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await storageService.set(userKey, JSON.stringify(updatedUser), true);
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Delete pre-registered user
   */
  async deletePreRegisteredUser(university, registrationNumber) {
    try {
      const userKey = `${MANAGED_USERS_PREFIX}${university}:${registrationNumber}`;
      await storageService.delete(userKey, true);
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  /**
   * Toggle user status
   */
  async toggleUserStatus(university, registrationNumber) {
    try {
      const userKey = `${MANAGED_USERS_PREFIX}${university}:${registrationNumber}`;
      const result = await storageService.get(userKey, true);

      if (!result || !result.value) {
        throw new Error('User not found');
      }

      const user = JSON.parse(result.value);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';

      return await this.updatePreRegisteredUser(university, registrationNumber, { status: newStatus });
    } catch (error) {
      console.error('Toggle status error:', error);
      throw error;
    }
  }

  /**
   * Check if registration number is pre-registered
   */
  async isPreRegistered(registrationNumber, university) {
    try {
      const userKey = `${MANAGED_USERS_PREFIX}${university}:${registrationNumber}`;
      const result = await storageService.get(userKey, true);
      
      if (result && result.value) {
        const user = JSON.parse(result.value);
        return user.status === 'active' || user.status === 'pending';
      }
      return false;
    } catch (error) {
      console.error('Check pre-registration error:', error);
      return false;
    }
  }

  /**
   * Mark user as having created account
   */
  async markAccountCreated(registrationNumber, university, userId) {
    try {
      return await this.updatePreRegisteredUser(university, registrationNumber, {
        hasAccount: true,
        accountCreatedAt: new Date().toISOString(),
        userId,
        status: 'active'
      });
    } catch (error) {
      console.error('Mark account created error:', error);
      throw error;
    }
  }

  /**
   * Get university statistics
   */
  async getUniversityStatistics(university) {
    try {
      const allUsers = await this.getUniversityUsers(university);
      
      const stats = {
        totalUsers: allUsers.length,
        teachers: allUsers.filter(u => u.userType === 'teacher').length,
        students: allUsers.filter(u => u.userType === 'student').length,
        activeUsers: allUsers.filter(u => u.status === 'active').length,
        pendingUsers: allUsers.filter(u => u.status === 'pending').length,
        withAccounts: allUsers.filter(u => u.hasAccount).length,
        withoutAccounts: allUsers.filter(u => !u.hasAccount).length,
        lastUpdated: new Date().toISOString()
      };

      return stats;
    } catch (error) {
      console.error('Get statistics error:', error);
      return {
        totalUsers: 0,
        teachers: 0,
        students: 0,
        activeUsers: 0,
        pendingUsers: 0,
        withAccounts: 0,
        withoutAccounts: 0
      };
    }
  }

  /**
   * Bulk import users
   */
  async bulkImportUsers(university, users, addedBy) {
    try {
      const results = {
        success: [],
        failed: []
      };

      for (const userData of users) {
        try {
          const user = await this.addPreRegisteredUser({
            ...userData,
            university,
            addedBy
          });
          results.success.push(user);
        } catch (error) {
          results.failed.push({
            data: userData,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Bulk import error:', error);
      throw error;
    }
  }

  /**
   * Get all university admins (for super admin)
   */
  async getAllUniversityAdmins() {
    try {
      const admins = await storageService.getAllWithPrefix(UNI_ADMIN_PREFIX, true);
      return admins;
    } catch (error) {
      console.error('Get all admins error:', error);
      return [];
    }
  }

  /**
   * Delete university admin (by super admin)
   */
  async deleteUniversityAdmin(university, username) {
    try {
      const adminKey = `${UNI_ADMIN_PREFIX}${university}:${username}`;
      await storageService.delete(adminKey, true);
      return true;
    } catch (error) {
      console.error('Delete admin error:', error);
      throw error;
    }
  }
}

export default new UniversityAdminService();