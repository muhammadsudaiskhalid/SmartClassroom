import { API_ENDPOINTS, apiRequest } from '../config/api';

class AuthService {
  /**
   * Sign in a user (Student/Teacher)
   */
  async signIn(registrationNumber, password) {
    try {
      const data = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ registrationNumber, password })
      });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign in an admin
   */
  async adminSignIn(username, password) {
    try {
      const data = await apiRequest(API_ENDPOINTS.AUTH.ADMIN_LOGIN, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data.user;
    } catch (error) {
      console.error('Admin sign in error:', error);
      throw error;
    }
  }

  /**
   * Get current session from backend
   */
  async getCurrentSession() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      
      const data = await apiRequest(API_ENDPOINTS.AUTH.ME);
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Get session error:', error);
      // Clear invalid session
      this.signOut();
      return null;
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  /**
   * Sign out
   */
  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  }

  /**
   * Get auth token
   */
  getToken() {
    return localStorage.getItem('token');
  }
}

const authService = new AuthService();

export default authService;
