# Backend Integration Guide

## Overview

This guide explains how to connect your React frontend to the new PostgreSQL backend with multi-tenant architecture.

## What Changed?

### Before (localStorage)
- All data stored in browser
- No real database
- Data not shared between devices
- Limited security
- No university isolation

### After (PostgreSQL + API)
- Centralized database
- Real-time data sync
- Access from any device
- Enterprise-level security
- **Complete university data isolation**

## Integration Steps

### 1. Install Axios (API Client)

```bash
cd d:/SmartClassroom
npm install axios
```

### 2. Create API Service

Create `src/services/api.service.js`:

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Update Auth Service

Replace `src/services/auth.service.js`:

```javascript
import api from './api.service';

class AuthService {
  async signIn(registrationNumber, password) {
    try {
      const response = await api.post('/auth/login', {
        registrationNumber,
        password
      });

      const { token, user } = response.data;

      // Store token and user
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      return { success: false, error: message };
    }
  }

  async adminSignIn(username, password) {
    try {
      const response = await api.post('/auth/admin/login', {
        username,
        password
      });

      const { token, type, university, universityId } = response.data;

      const adminUser = {
        type,
        username,
        university,
        universityId
      };

      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(adminUser));

      return { success: true, user: adminUser };
    } catch (error) {
      const message = error.response?.data?.error || 'Admin login failed';
      return { success: false, error: message };
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      const user = response.data;

      // Update stored user
      localStorage.setItem('current_user', JSON.stringify(user));

      return user;
    } catch (error) {
      return null;
    }
  }

  signOut() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
}

export default new AuthService();
```

### 4. Update Admin Service

Replace `src/services/admin.service.js`:

```javascript
import api from './api.service';

class AdminService {
  // Get all universities (Super Admin only)
  async getAllUniversities() {
    try {
      const response = await api.get('/universities');
      return response.data;
    } catch (error) {
      console.error('Get universities error:', error);
      return [];
    }
  }

  // Create university (Super Admin only)
  async createUniversity(universityData) {
    try {
      const response = await api.post('/universities', universityData);
      return { success: true, university: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create university';
      return { success: false, error: message };
    }
  }

  // Get all users in university
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      return { teachers: [], students: [], admins: [] };
    }
  }

  // Add teacher
  async addTeacher(teacherData) {
    try {
      const response = await api.post('/users/teachers', teacherData);
      return { success: true, teacher: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add teacher';
      return { success: false, error: message };
    }
  }

  // Add student
  async addStudent(studentData) {
    try {
      const response = await api.post('/users/students', studentData);
      return { success: true, student: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add student';
      return { success: false, error: message };
    }
  }

  // Update user
  async updateUser(userType, userId, updates) {
    try {
      const response = await api.put(`/users/${userType}/${userId}`, updates);
      return { success: true, user: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update user';
      return { success: false, error: message };
    }
  }

  // Reset password
  async resetPassword(userType, userId, newPassword) {
    try {
      await api.post(`/users/${userType}/${userId}/reset-password`, {
        newPassword
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to reset password';
      return { success: false, error: message };
    }
  }

  // Delete user
  async deleteUser(userType, userId) {
    try {
      await api.delete(`/users/${userType}/${userId}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete user';
      return { success: false, error: message };
    }
  }
}

export default new AdminService();
```

### 5. Update Class Service

Replace `src/services/class.service.js`:

```javascript
import api from './api.service';

class ClassService {
  // Get all classes (auto-filtered by university)
  async getAllClasses() {
    try {
      const response = await api.get('/classes');
      return response.data;
    } catch (error) {
      console.error('Get classes error:', error);
      return [];
    }
  }

  // Get class by ID
  async getClassById(classId) {
    try {
      const response = await api.get(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Get class error:', error);
      return null;
    }
  }

  // Create class (Teacher only)
  async createClass(classData) {
    try {
      const response = await api.post('/classes', classData);
      return { success: true, class: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create class';
      return { success: false, error: message };
    }
  }

  // Update class
  async updateClass(classId, updates) {
    try {
      const response = await api.put(`/classes/${classId}`, updates);
      return { success: true, class: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update class';
      return { success: false, error: message };
    }
  }

  // Delete class
  async deleteClass(classId) {
    try {
      await api.delete(`/classes/${classId}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete class';
      return { success: false, error: message };
    }
  }

  // Request to join class (Student)
  async requestJoinClass(classId) {
    try {
      const response = await api.post(`/classes/${classId}/join`);
      return { success: true, request: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to send join request';
      return { success: false, error: message };
    }
  }

  // Approve/Reject join request (Teacher)
  async handleJoinRequest(classId, requestId, status) {
    try {
      const response = await api.put(
        `/classes/${classId}/join-requests/${requestId}`,
        { status }
      );
      return { success: true, request: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to process request';
      return { success: false, error: message };
    }
  }
}

export default new ClassService();
```

### 6. Update Environment Variables

Add to `.env` in React app root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### 7. Update Components

The components remain mostly the same! Just update the data fetching:

**Example: StudentDashboard.jsx**

```javascript
// Before
const classes = classService.getAllClasses();

// After
const [classes, setClasses] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchClasses = async () => {
    setLoading(true);
    const data = await classService.getAllClasses();
    setClasses(data.enrolledClasses || []);
    setLoading(false);
  };
  fetchClasses();
}, []);
```

### 8. Test University Isolation

1. **Start backend**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start frontend**:
   ```bash
   cd d:/SmartClassroom
   npm start
   ```

3. **Test isolation**:
   - Login as Demo University admin (`ADMIN001`)
   - Create a class
   - Login as Test Institute admin (`ADMIN002`)
   - **Verify**: Cannot see Demo University's class!

## Migration Checklist

- [ ] Backend server running
- [ ] Database seeded with demo data
- [ ] Frontend has axios installed
- [ ] API service created
- [ ] Auth service updated
- [ ] Admin service updated
- [ ] Class service updated
- [ ] Student service updated
- [ ] Environment variables configured
- [ ] Components updated to use async/await
- [ ] Loading states added
- [ ] Error handling implemented
- [ ] Tested university isolation

## Common Issues

### CORS Errors

Update `server/index.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true
}));
```

### Token Not Sent

Check `api.service.js` interceptor is properly configured.

### Data Not Showing

1. Check browser console for errors
2. Check network tab for API calls
3. Verify token is stored in localStorage
4. Check backend logs

## Next Steps

1. **Remove old localStorage services** (storage.service.js)
2. **Update all components** to use async API calls
3. **Add loading indicators** during API calls
4. **Implement error boundaries** for better error handling
5. **Add data caching** (React Query or SWR)

## Benefits of Backend

✅ **Multi-tenant**: Complete university isolation  
✅ **Scalable**: Handle thousands of universities  
✅ **Secure**: JWT auth + password hashing  
✅ **Real-time**: Data syncs across devices  
✅ **Reliable**: Database backups & recovery  
✅ **Performance**: Optimized queries with indexes  

---

**Your app is now enterprise-ready! 🚀**
