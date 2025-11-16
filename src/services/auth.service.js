import storageService from './storage.service';
import adminService from './admin.service';
import { STORAGE_KEYS } from '../utils/constants';

class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(userData) {
    try {
      const { registrationNumber, password, name, university, department, semester, userType } = userData;

      // Check university access
      const isAccessible = await adminService.isUniversityAccessible(university);
      if (!isAccessible) {
        throw new Error('This university is currently inactive or has expired. Please contact your institution administrator.');
      }

      // Validate required fields
      if (!registrationNumber || !password || !name || !university || !department || !userType) {
        throw new Error('All fields are required');
      }

      // Check if user already exists
      try {
        const existingUser = await storageService.get(
          `${STORAGE_KEYS.USER_PREFIX}${registrationNumber}`
        );

        if (existingUser && existingUser.value) {
          throw new Error('This registration number is already registered');
        }
      } catch (error) {
        if (error.message.includes('already registered')) {
          throw error;
        }
      }

      // Create user object
      const user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        registrationNumber,
        password,
        name,
        university,
        department,
        semester: semester || null,
        type: userType,
        createdAt: new Date().toISOString()
      };

      console.log('Creating user:', { ...user, password: '***' });

      // Save user
      const result = await storageService.set(
        `${STORAGE_KEYS.USER_PREFIX}${registrationNumber}`,
        JSON.stringify(user)
      );

      if (!result) {
        throw new Error('Failed to save user data. Please try again.');
      }

      console.log('User created successfully');

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in a user
   */
  async signIn(registrationNumber, password) {
    try {
      if (!registrationNumber || !password) {
        throw new Error('Registration number and password are required');
      }

      // Get all users from admin service (centralized authentication)
      const allUsers = await adminService.getAllUsers();
      const userAuth = allUsers.find(u => u.registrationNumber === registrationNumber && u.password === password);

      if (!userAuth) {
        throw new Error('Invalid registration number or password');
      }

      // Get full user details based on type
      let user = null;
      if (userAuth.userType === 'teacher') {
        const teachers = await adminService.getTeachers(userAuth.university);
        const teacher = teachers.find(t => t.employeeId === registrationNumber || t.registrationNumber === registrationNumber);
        if (teacher && teacher.isActive) {
          user = teacher;
        } else if (teacher && !teacher.isActive) {
          throw new Error('Your account has been deactivated. Please contact your administrator.');
        }
      } else if (userAuth.userType === 'student') {
        const students = await adminService.getStudents(userAuth.university);
        const student = students.find(s => s.registrationNumber === registrationNumber);
        if (student && student.isActive) {
          user = student;
        } else if (student && !student.isActive) {
          throw new Error('Your account has been deactivated. Please contact your administrator.');
        }
      }

      if (!user) {
        throw new Error('User account not found or has been removed');
      }

      // Check university access
      const isAccessible = await adminService.isUniversityAccessible(user.university);
      if (!isAccessible) {
        throw new Error('Your university access has been suspended or expired. Please contact your institution administrator.');
      }

      // Save current session
      await this.saveSession(user);

      console.log('User signed in successfully');

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Save user session
   */
  async saveSession(user) {
    try {
      const { password, ...userWithoutPassword } = user;
      return await storageService.set(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(userWithoutPassword)
      );
    } catch (error) {
      console.error('Save session error:', error);
      throw new Error('Failed to save session');
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession() {
    try {
      const result = await storageService.get(STORAGE_KEYS.CURRENT_USER);
      if (result && result.value) {
        const user = JSON.parse(result.value);
        
        // Check university access for existing session
        const isAccessible = await adminService.isUniversityAccessible(user.university);
        if (!isAccessible) {
          // Auto-logout if university is no longer accessible
          await this.signOut();
          return null;
        }
        
        return user;
      }
      return null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      await storageService.delete(STORAGE_KEYS.CURRENT_USER);
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Get user by registration number
   */
  async getUserByRegistrationNumber(registrationNumber) {
    try {
      const result = await storageService.get(
        `${STORAGE_KEYS.USER_PREFIX}${registrationNumber}`
      );
      
      if (result && result.value) {
        const user = JSON.parse(result.value);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(registrationNumber, updates) {
    try {
      const result = await storageService.get(
        `${STORAGE_KEYS.USER_PREFIX}${registrationNumber}`
      );

      if (!result || !result.value) {
        throw new Error('User not found');
      }

      const user = JSON.parse(result.value);
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await storageService.set(
        `${STORAGE_KEYS.USER_PREFIX}${registrationNumber}`,
        JSON.stringify(updatedUser)
      );

      // Update session if it's the current user
      const session = await this.getCurrentSession();
      if (session && session.registrationNumber === registrationNumber) {
        await this.saveSession(updatedUser);
      }

      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;