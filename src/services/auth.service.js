import storageService from './storage.service';
import { STORAGE_KEYS } from '../utils/constants';

class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(userData) {
    try {
      const { registrationNumber, password, name, university, department, semester, userType } = userData;

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
        // If error is not about existing user, continue
        if (error.message.includes('already registered')) {
          throw error;
        }
      }

      // Create user object
      const user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        registrationNumber,
        password, // In production, hash this!
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

      // Return user without password
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

      // Get user by registration number
      const result = await storageService.get(
        `${STORAGE_KEYS.USER_PREFIX}${registrationNumber}`
      );

      if (!result || !result.value) {
        throw new Error('Invalid registration number or password');
      }

      const user = JSON.parse(result.value);

      // Verify password
      if (user.password !== password) {
        throw new Error('Invalid registration number or password');
      }

      // Save current session
      await this.saveSession(user);

      console.log('User signed in successfully');

      // Return user without password
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
      const result = await storageService.set(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(userWithoutPassword)
      );
      return result;
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
        return JSON.parse(result.value);
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

export default new AuthService();