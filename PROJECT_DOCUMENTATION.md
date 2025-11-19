# Smart Classroom - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features & Functionality](#features--functionality)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Installation & Setup](#installation--setup)
6. [User Guide](#user-guide)
7. [Developer Guide](#developer-guide)
8. [API Documentation](#api-documentation)
9. [Security Features](#security-features)
10. [Deployment Guide](#deployment-guide)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Smart Classroom** is a modern, full-stack classroom management platform designed to streamline communication and organization between teachers and students across multiple universities in Pakistan.

### Key Highlights
- **Multi-tenant Architecture**: Support for unlimited universities
- **Real-time Communication**: WebSocket-based group chat in each class
- **Role-based Access Control**: Separate dashboards for Teachers, Students, and Administrators
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Production-Ready**: Fully tested, optimized build with error handling

### Problem It Solves
- Eliminates paper-based classroom management
- Centralizes class materials and announcements
- Provides real-time communication channels
- Maintains comprehensive attendance and activity records
- Enables easy class discovery and enrollment

---

## 🌟 Features & Functionality

### 🎓 For Teachers

#### Class Management
- **Create Classes**: Set up classes for single or multiple departments
- **Manage Enrollment**: Approve or reject student join requests
- **Student Management**: View enrolled students, remove if needed
- **Class Deletion**: Delete classes with all associated data

#### Class Minutes & Activities
- **Daily Minutes**: Add detailed class minutes with date
- **Content Organization**: Include lecture content, announcements, and tasks
- **Edit & Delete**: Modify or remove minutes as needed
- **Historical View**: Access all past class activities

#### Real-time Chat
- **Group Messaging**: Chat with all enrolled students
- **Message Management**: Edit or delete your messages
- **Connection Status**: See real-time connection indicators
- **Message History**: View all previous conversations

### 👨‍🎓 For Students

#### Class Discovery & Enrollment
- **Browse Classes**: Find classes by university, department, and semester
- **Join Requests**: Send requests to join classes
- **Request Status**: Track pending, approved, or rejected requests
- **Class Preview**: View class details before joining

#### Class Access
- **My Classes**: View all enrolled classes
- **Class Minutes**: Access daily minutes and materials
- **Date-based History**: Browse minutes by specific dates
- **Leave Classes**: Unenroll when needed

#### Real-time Chat
- **Participate in Discussions**: Message teachers and classmates
- **View History**: Access complete chat history
- **Edit Messages**: Modify your sent messages
- **Connection Status**: Real-time connectivity indicators

### 🔐 For Administrators

#### Super Admin
- **University Management**: Add, edit, or remove universities
- **User Oversight**: Manage all teachers and students
- **System Statistics**: View usage analytics
- **Access Control**: Manage admin permissions

#### University Admin
- **Teacher Management**: Add, update, or remove teachers
- **Student Management**: Manage student accounts
- **Join Request Approval**: Approve/reject enrollment requests
- **Department Statistics**: View university-specific analytics

---

## 💻 Technology Stack

### Frontend Stack
```javascript
{
  "core": {
    "React": "18.2.0",
    "React DOM": "18.2.0",
    "React Scripts": "5.0.1"
  },
  "styling": {
    "Tailwind CSS": "3.3.0",
    "PostCSS": "8.4.31",
    "Autoprefixer": "10.4.16"
  },
  "icons": {
    "Lucide React": "0.292.0"
  },
  "realtime": {
    "Socket.IO Client": "4.5.4"
  }
}
```

### Backend Stack
```javascript
{
  "runtime": "Node.js 16+",
  "framework": "Express.js 4.18.2",
  "database": {
    "MongoDB": "Atlas Cloud",
    "ODM": "Mongoose 8.0.0"
  },
  "authentication": {
    "JWT": "jsonwebtoken 9.0.2",
    "Password": "bcryptjs 2.4.3"
  },
  "realtime": {
    "Socket.IO": "4.5.4"
  },
  "middleware": {
    "CORS": "2.8.5",
    "Body Parser": "1.20.2",
    "Dotenv": "16.3.1"
  }
}
```

### Database Schema
```javascript
// MongoDB Collections
{
  universities: { name, contactEmail, subscriptionType, maxUsers, isActive },
  teachers: { name, employeeId, email, password, universityId, department, isActive },
  students: { name, registrationNumber, email, password, universityId, department, semester, isActive },
  admins: { username, password, type, universityId },
  classes: { name, subject, semester, departments, teacherId, universityId, isActive },
  enrollments: { studentId, classId, status, enrolledAt },
  joinRequests: { studentId, classId, status, requestedAt },
  minutes: { classId, date, content, announcements, tasks, createdBy },
  chatMessages: { classId, sender, message, createdAt, editedAt, readBy }
}
```

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Browser    │  │    Mobile    │  │    Tablet    │     │
│  │  (React App) │  │ (Responsive) │  │ (Responsive) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTPS/WSS
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Express.js REST API Server              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │   │
│  │  │  Routes  │  │Middleware│  │  Socket.IO WS   │  │   │
│  │  │  /api/*  │  │Auth/CORS │  │  Real-time Chat │  │   │
│  │  └──────────┘  └──────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓ MongoDB Driver
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │             MongoDB Atlas (Cloud Database)           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │  Users   │  │ Classes  │  │  Chat Messages   │  │   │
│  │  │Collection│  │Collection│  │    Collection    │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
App (Root)
├── AuthProvider (Context)
│   ├── SignIn Component
│   └── SignUp Component
├── SocketProvider (Context)
│   └── Real-time Connection Management
├── ClassProvider (Context)
│   └── Class Data Management
├── MainLayout
│   ├── Navbar
│   │   ├── Profile Dropdown
│   │   └── Notifications
│   ├── Teacher Dashboard
│   │   ├── CreateClass Modal
│   │   ├── ClassCard List
│   │   └── ClassDetail View
│   │       ├── Students List
│   │       ├── Join Requests
│   │       ├── Minutes Management
│   │       └── ClassChat Component
│   ├── Student Dashboard
│   │   ├── MyClasses Tab
│   │   │   ├── ClassView
│   │   │   └── ClassChat Component
│   │   └── AvailableClasses Tab
│   └── Admin Dashboard
│       ├── User Management
│       ├── University Management
│       └── System Statistics
└── ErrorBoundary (Error Handling)
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier works)
- Git
- Modern web browser

### Step 1: Clone Repository
```bash
git clone https://github.com/muhammadsudaiskhalid/SmartClassroom.git
cd SmartClassroom
```

### Step 2: Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
MONGODB_URI=your_mongodb_connection_string
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=your-secure-password
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW=300000
RATE_LIMIT_MAX_ATTEMPTS=5
RATE_LIMIT_LOCKOUT=900000
EOL

# Seed database (optional)
npm run seed

# Start server
npm start
```

### Step 3: Frontend Setup
```bash
# Navigate back to root
cd ..

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start development server
npm start
```

### Step 4: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## 📖 User Guide

### Getting Started

#### For Teachers
1. **Sign In**: Use your employee ID and password
2. **Create Class**: Click "Create Class" → Fill details → Select departments
3. **Manage Requests**: View pending join requests → Approve/Reject
4. **Add Minutes**: Open class → "Add Minutes" → Fill content
5. **Chat**: Open class → Click chat icon → Start messaging

#### For Students
1. **Sign In**: Use your registration number and password
2. **Browse Classes**: Go to "Available Classes" tab
3. **Join Class**: Find class → Click "Request to Join"
4. **Access Materials**: After approval → View class minutes
5. **Chat**: Open enrolled class → Join group chat

#### For Administrators
1. **Access Admin Portal**: Navigate to `/#admin`
2. **Sign In**: Use admin credentials
3. **Manage Users**: Add/edit teachers and students
4. **Approve Requests**: Review pending join requests
5. **Monitor System**: View statistics and analytics

### Common Tasks

#### Creating a Class (Teacher)
```
Dashboard → Create Class Button
  ↓
Fill Form:
  - Class Name (e.g., "Data Structures")
  - Subject (e.g., "Computer Science")
  - Semester (e.g., "3rd Semester")
  - Departments (select one or more)
  ↓
Submit → Class Created
```

#### Joining a Class (Student)
```
Dashboard → Available Classes Tab
  ↓
Find Class → Click "Request to Join"
  ↓
Wait for Approval → Receive Notification
  ↓
Access from "My Classes" Tab
```

#### Adding Class Minutes (Teacher)
```
Open Class → Add Minutes Button
  ↓
Select Date → Fill Content:
  - Lecture Content
  - Announcements
  - Tasks/Homework
  ↓
Save → Minutes Posted
```

---

## 👨‍💻 Developer Guide

### Project Structure
```
SmartClassroom/
├── public/                 # Static files
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── teacher/       # Teacher-specific components
│   │   ├── student/       # Student-specific components
│   │   ├── admin/         # Admin components
│   │   ├── universityAdmin/
│   │   ├── shared/        # Reusable components
│   │   └── layout/        # Layout components
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ClassContext.jsx
│   │   └── SocketContext.jsx
│   ├── services/          # API service layer
│   │   ├── api-auth.service.js
│   │   ├── class.service.js
│   │   ├── chat.service.js
│   │   ├── minutes.service.js
│   │   └── admin.service.js
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── styles/            # CSS files
│   ├── config/            # Configuration files
│   ├── App.jsx            # Root component
│   └── index.js           # Entry point
├── server/                # Backend application
│   ├── models/            # MongoDB models
│   ├── routes/            # Express routes
│   ├── index.js           # Server entry point
│   └── seed.js            # Database seeder
├── build/                 # Production build
└── package.json           # Dependencies
```

### Adding a New Feature

#### 1. Create Component
```javascript
// src/components/shared/NewFeature.jsx
import React, { useState } from 'react';

const NewFeature = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  
  return (
    <div className="new-feature">
      {/* Your JSX */}
    </div>
  );
};

export default NewFeature;
```

#### 2. Create Service
```javascript
// src/services/newFeature.service.js
import { apiRequest, API_ENDPOINTS } from '../config/api';

class NewFeatureService {
  async getData() {
    return await apiRequest(API_ENDPOINTS.NEW_FEATURE.GET);
  }
}

export default new NewFeatureService();
```

#### 3. Add API Endpoint
```javascript
// server/routes/newFeature.js
const express = require('express');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  // Implementation
});

module.exports = router;
```

#### 4. Register Route
```javascript
// server/index.js
const newFeatureRoutes = require('./routes/newFeature');
app.use('/api/new-feature', newFeatureRoutes);
```

### Coding Standards

#### React Components
```javascript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

const MyComponent = ({ propName }) => {
  // Hooks at the top
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Side effects
  }, [dependency]);
  
  // Event handlers
  const handleClick = () => {
    // Logic
  };
  
  // Render
  return (
    <div className="component-class">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

#### API Calls
```javascript
// Always use try-catch
try {
  const data = await apiService.fetchData();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Handle error
}
```

### Testing

#### Run Production Build
```bash
npm run build
```

#### Test Backend
```bash
cd server
npm test
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login for teachers and students
```javascript
Request:
{
  "registrationNumber": "FA21-BSE-001",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "type": "student",
    "university": { "name": "STMU" },
    "department": "Computer Science",
    "semester": "3rd Semester"
  }
}
```

#### POST /api/auth/admin/login
Admin login
```javascript
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "admin_id",
    "username": "admin",
    "type": "super_admin"
  }
}
```

### Class Endpoints

#### GET /api/classes
Get classes (filtered by user role)
```javascript
Headers: { "Authorization": "Bearer jwt_token" }

Response:
{
  "enrolledClasses": [...],
  "availableClasses": [...]
}
```

#### POST /api/classes
Create new class (Teacher only)
```javascript
Headers: { "Authorization": "Bearer jwt_token" }

Request:
{
  "name": "Data Structures",
  "subject": "Computer Science",
  "semester": "3rd Semester",
  "departments": ["Computer Science", "Software Engineering"]
}

Response:
{
  "id": "class_id",
  "name": "Data Structures",
  ...
}
```

### Chat Endpoints

#### GET /api/chat/:classId/messages
Get chat messages for a class
```javascript
Headers: { "Authorization": "Bearer jwt_token" }
Query: { page: 1, limit: 50 }

Response:
{
  "messages": [
    {
      "_id": "message_id",
      "sender": { "id": "user_id", "name": "John", "type": "student" },
      "message": "Hello everyone!",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

### Socket.IO Events

#### Client → Server

```javascript
// Join class chat room
socket.emit('join-class-chat', classId);

// Send message
socket.emit('send-message', {
  classId: "class_id",
  message: "Hello!"
});

// Leave chat room
socket.emit('leave-class-chat', classId);
```

#### Server → Client

```javascript
// New message received
socket.on('new-message', (message) => {
  // Handle new message
});

// Connection status
socket.on('connect', () => {
  // Connected
});

socket.on('disconnect', () => {
  // Disconnected
});
```

---

## 🔒 Security Features

### Implemented Security Measures

1. **Authentication**
   - JWT-based token authentication
   - Token expiration (24 hours)
   - Secure token storage (localStorage with HttpOnly alternative)

2. **Password Security**
   - bcrypt hashing with 10 salt rounds
   - Never storing plain text passwords
   - Password validation on signup

3. **Authorization**
   - Role-based access control (RBAC)
   - Route-level authorization middleware
   - Resource ownership verification

4. **Rate Limiting**
   - Login attempt limiting (5 attempts per 5 minutes)
   - Account lockout after failed attempts
   - Automatic unlock after cooldown period

5. **Input Validation**
   - Server-side validation for all inputs
   - Client-side validation for UX
   - SQL injection prevention (via Mongoose ODM)
   - XSS protection (React auto-escaping)

6. **CORS Configuration**
   - Whitelist-based origin checking
   - Credentials support
   - Preflight handling

7. **WebSocket Security**
   - Token-based authentication for Socket.IO
   - Room-level access control
   - Message validation

### Security Best Practices

```javascript
// Always validate user input
const isValid = validator.isEmail(email);

// Never expose sensitive data
const { password, ...userWithoutPassword } = user;

// Use HTTPS in production
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.example.com' 
  : 'http://localhost:5000';

// Sanitize error messages
catch (error) {
  res.status(500).json({ error: 'Internal server error' });
}
```

---

## 🚢 Deployment Guide

### Production Build

```bash
# Build frontend
npm run build

# Build creates optimized static files in /build directory
# Output: build/static/js/main.*.js (125 KB gzipped)
```

### Deploy to Vercel (Frontend)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure Environment**
```bash
vercel env add REACT_APP_API_URL
# Enter your production API URL
```

### Deploy to Railway (Backend)

1. **Create Railway Project**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

2. **Configure Environment Variables**
```
MONGODB_URI=your_mongodb_atlas_connection
JWT_SECRET=your_production_secret
NODE_ENV=production
FRONTEND_URL=your_vercel_app_url
```

3. **Deploy**
```bash
railway up
```

### MongoDB Atlas Setup

1. **Create Cluster**
   - Go to mongodb.com/cloud/atlas
   - Create free tier cluster
   - Choose region closest to your users

2. **Configure Network Access**
   - Allow access from anywhere (0.0.0.0/0) for Railway
   - Or whitelist Railway IP addresses

3. **Create Database User**
   - Username and strong password
   - Read/Write permissions

4. **Get Connection String**
   - Connect → Drivers → Node.js
   - Copy connection string
   - Replace <password> with actual password

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: "Cannot connect to MongoDB"
```bash
Solution:
1. Check MongoDB connection string in .env
2. Verify network access in MongoDB Atlas
3. Ensure database user credentials are correct
4. Check if MongoDB Atlas cluster is running
```

#### Issue: "Socket.IO not connecting"
```bash
Solution:
1. Verify backend server is running
2. Check CORS configuration
3. Ensure correct API_URL in frontend .env
4. Check browser console for connection errors
```

#### Issue: "Build fails with memory error"
```bash
Solution:
1. Increase Node memory limit:
   NODE_OPTIONS=--max_old_space_size=4096 npm run build
2. Clear node_modules and reinstall:
   rm -rf node_modules package-lock.json
   npm install
```

#### Issue: "Authentication not working"
```bash
Solution:
1. Clear browser localStorage
2. Check JWT_SECRET matches between requests
3. Verify token expiration
4. Check Authorization header format
```

### Debugging Tips

```javascript
// Enable debug logs
// In .env
DEBUG=app:*

// Check API responses
console.log('API Response:', response);

// Verify token
const decoded = jwt.decode(token);
console.log('Decoded token:', decoded);

// Check MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
```

---

## 📊 Performance Optimization

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Memoization with React.memo()
- Virtual scrolling for long lists

### Backend Optimization
- Database indexing on frequently queried fields
- Connection pooling for MongoDB
- Caching with Redis (planned)
- Rate limiting to prevent abuse

### Bundle Size
- Production build: 125 KB (gzipped)
- Optimized with Webpack
- Tree shaking enabled
- Code minification

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Multi-tenant architecture
- ✅ Real-time group chat
- ✅ Teacher and student dashboards
- ✅ Admin management panels
- ✅ Class and enrollment management
- ✅ Minutes and content management
- ✅ Authentication and authorization
- ✅ Responsive design
- ✅ Error boundaries
- ✅ Production build optimization

### Planned Features (v2.0)
- [ ] File upload for assignments
- [ ] Video conferencing integration
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Quiz and assessment tools

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues, questions, or suggestions:
- 📧 Email: msudaiskhalid.ai@gmail.com
- 🐛 GitHub Issues: [Create an issue](https://github.com/muhammadsudaiskhalid/SmartClassroom/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/muhammadsudaiskhalid/SmartClassroom/discussions)

---

**Built with ❤️ by Sudais Khalid for modern education management**

*Last Updated: November 19, 2025*
