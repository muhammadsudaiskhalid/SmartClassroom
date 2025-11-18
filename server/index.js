// Backend API Server for Smart Classroom
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Import Models
const { University, Admin, Teacher, Student, Class, Enrollment, JoinRequest, Minute } = require('./models');

// CORS Configuration for Production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow vercel domains
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow specific frontend URL if set
    const allowedOrigin = process.env.FRONTEND_URL;
    if (allowedOrigin && (origin === allowedOrigin || allowedOrigin === '*')) {
      return callback(null, true);
    }
    
    // For development, allow any origin
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware to log requests in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
    next();
  });
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Rate limiting storage (in-memory, will move to Redis for production)
const loginAttempts = new Map();

const checkRateLimit = (identifier) => {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);
  const WINDOW = 5 * 60 * 1000; // 5 minutes
  const MAX_ATTEMPTS = 5;
  const LOCKOUT = 15 * 60 * 1000; // 15 minutes

  if (!attempt) {
    loginAttempts.set(identifier, { count: 1, firstAttempt: now, lastAttempt: now });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    const retryAfter = Math.ceil((attempt.lockedUntil - now) / 1000);
    return { allowed: false, retryAfter, locked: true };
  }

  if (now - attempt.firstAttempt > WINDOW) {
    loginAttempts.set(identifier, { count: 1, firstAttempt: now, lastAttempt: now });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  attempt.count++;
  attempt.lastAttempt = now;

  if (attempt.count > MAX_ATTEMPTS) {
    attempt.lockedUntil = now + LOCKOUT;
    loginAttempts.set(identifier, attempt);
    return { allowed: false, retryAfter: Math.ceil(LOCKOUT / 1000), locked: true };
  }

  loginAttempts.set(identifier, attempt);
  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - attempt.count };
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Student/Teacher Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { registrationNumber, password } = req.body;

    // Rate limiting
    const rateLimit = checkRateLimit(registrationNumber);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: `Too many failed attempts. Please try again in ${Math.ceil(rateLimit.retryAfter / 60)} minutes.`
      });
    }

    // Find user (teacher or student)
    const [teacher, student] = await Promise.all([
      Teacher.findOne({
        $or: [
          { employeeId: registrationNumber },
          { registrationNumber: registrationNumber }
        ]
      }).populate('universityId'),
      Student.findOne({ registrationNumber }).populate('universityId')
    ]);

    const user = teacher || student;
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated. Contact administrator.' });
    }

    // Check if university is active
    if (!user.universityId.isActive) {
      return res.status(403).json({ error: 'University access has been suspended.' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset rate limit on successful login
    loginAttempts.delete(registrationNumber);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        type: teacher ? 'teacher' : 'student',
        universityId: user.universityId._id.toString(),
        registrationNumber: user.registrationNumber || user.employeeId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    res.json({
      token,
      user: {
        ...userObject,
        university: user.universityId,
        type: teacher ? 'teacher' : 'student',
        userType: teacher ? 'teacher' : 'student'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Login
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Rate limiting
    const rateLimit = checkRateLimit(`admin_${username}`);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: `Too many failed attempts. Please try again in ${Math.ceil(rateLimit.retryAfter / 60)} minutes.`
      });
    }

    // Check super admin (from env)
    if (username === process.env.SUPER_ADMIN_USERNAME && password === process.env.SUPER_ADMIN_PASSWORD) {
      loginAttempts.delete(`admin_${username}`);
      const token = jwt.sign(
        { id: 'super_admin', type: 'super_admin', username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return res.json({ token, type: 'super_admin', username });
    }

    // Check university admin
    const admin = await Admin.findOne({ registrationNumber: username }).populate('universityId');

    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    loginAttempts.delete(`admin_${username}`);

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        type: 'university_admin',
        universityId: admin.universityId._id.toString(),
        username: admin.registrationNumber
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      type: 'university_admin',
      university: admin.universityId.name,
      universityId: admin.universityId._id.toString()
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user from token
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    if (req.user.type === 'super_admin') {
      return res.json({ type: 'super_admin', username: req.user.username });
    }

    if (req.user.type === 'university_admin') {
      const admin = await Admin.findById(req.user.id).populate('universityId');
      const adminObj = admin.toObject();
      delete adminObj.password;
      return res.json({ ...adminObj, type: 'university_admin' });
    }

    if (req.user.type === 'teacher') {
      const teacher = await Teacher.findById(req.user.id).populate('universityId');
      const teacherObj = teacher.toObject();
      delete teacherObj.password;
      return res.json({ ...teacherObj, type: 'teacher', userType: 'teacher' });
    }

    if (req.user.type === 'student') {
      const student = await Student.findById(req.user.id).populate('universityId');
      const studentObj = student.toObject();
      delete studentObj.password;
      return res.json({ ...studentObj, type: 'student', userType: 'student' });
    }

    res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// UNIVERSITY ROUTES (Super Admin Only)
// ============================================

app.get('/api/universities', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const universities = await University.find().sort({ createdAt: -1 });
    
    // Get counts for each university
    const universitiesWithCounts = await Promise.all(
      universities.map(async (uni) => {
        const [teacherCount, studentCount, classCount] = await Promise.all([
          Teacher.countDocuments({ universityId: uni._id }),
          Student.countDocuments({ universityId: uni._id }),
          Class.countDocuments({ universityId: uni._id })
        ]);
        
        return {
          ...uni.toObject(),
          _count: {
            teachers: teacherCount,
            students: studentCount,
            classes: classCount
          }
        };
      })
    );

    res.json(universitiesWithCounts);
  } catch (error) {
    console.error('Get universities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/universities', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, contactEmail, contactPhone, subscriptionType, maxUsers, admin } = req.body;

    // Create university
    const university = await University.create({
      name,
      contactEmail,
      contactPhone,
      subscriptionType: subscriptionType || 'trial',
      maxUsers: maxUsers || 1000,
      isActive: true
    });

    // Create admin for university if provided
    if (admin && admin.registrationNumber && admin.password) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await Admin.create({
        name: admin.name || `${name} Admin`,
        registrationNumber: admin.registrationNumber,
        email: admin.email || contactEmail,
        password: hashedPassword,
        universityId: university._id
      });
    }

    res.status(201).json(university);
  } catch (error) {
    console.error('Create university error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ROUTES
// ============================================

// Health check (must be before other routes)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Smart Classroom API is running',
    timestamp: new Date().toISOString() 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart Classroom API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/login',
      adminAuth: '/api/auth/admin/login',
      classes: '/api/classes',
      universities: '/api/universities'
    }
  });
});

const classRoutes = require('./routes/classes');
const userRoutes = require('./routes/users');

app.use('/api/classes', authenticateToken, classRoutes);
app.use('/api/users', authenticateToken, userRoutes);

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
