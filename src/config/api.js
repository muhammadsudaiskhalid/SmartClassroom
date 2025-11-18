// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin/login`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`
  },
  
  // University endpoints
  UNIVERSITIES: {
    LIST: `${API_BASE_URL}/api/universities`,
    CREATE: `${API_BASE_URL}/api/universities`,
    GET: (id) => `${API_BASE_URL}/api/universities/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/universities/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/universities/${id}`
  },
  
  // Class endpoints
  CLASSES: {
    LIST: `${API_BASE_URL}/api/classes`,
    CREATE: `${API_BASE_URL}/api/classes`,
    GET: (id) => `${API_BASE_URL}/api/classes/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/classes/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/classes/${id}`,
    JOIN: (id) => `${API_BASE_URL}/api/classes/${id}/join`,
    APPROVE_REQUEST: (classId, requestId) => `${API_BASE_URL}/api/classes/${classId}/requests/${requestId}`,
    STUDENTS: (id) => `${API_BASE_URL}/api/classes/${id}/students`,
    MINUTES: (id) => `${API_BASE_URL}/api/classes/${id}/minutes`,
    ADD_MINUTE: (id) => `${API_BASE_URL}/api/classes/${id}/minutes`
  },
  
  // User endpoints
  USERS: {
    LIST: `${API_BASE_URL}/api/users`,
    CREATE: `${API_BASE_URL}/api/users`,
    GET: (id) => `${API_BASE_URL}/api/users/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/users/${id}`
  },
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`
};

// API request helper with authentication
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
      throw new Error('Session expired. Please login again.');
    }
    
    // Parse response
    const data = await response.json().catch(() => null);
    
    if (!response.ok) {
      throw new Error(data?.error || data?.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default API_BASE_URL;
