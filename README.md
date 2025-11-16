# Smart Classroom - University Management System

<div align="center">

![Smart Classroom](https://img.shields.io/badge/Smart-Classroom-orange)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

**A comprehensive classroom management platform connecting teachers and students across universities in Pakistan**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Technology Stack](#technology-stack) • [Screenshots](#screenshots) • [Contributing](#contributing)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

Smart Classroom is a modern, university-centric classroom management system designed specifically for Pakistani universities. It streamlines communication between teachers and students, manages class materials, and maintains comprehensive records of daily class activities.

### Why Smart Classroom?

- **University-Specific**: Tailored for Pakistani universities with multi-department support
- **Semester-Based**: Organized by academic semesters for better content management
- **Real-time Updates**: Instant notifications and updates for all participants
- **Comprehensive Records**: Complete history of class minutes, announcements, and tasks
- **Role-Based Access**: Separate interfaces and permissions for teachers and students

---

## Features

### For Teachers

- **Class Management**
  - Create classes for multiple departments
  - Manage student enrollments
  - Delete classes with all associated data
  
- **Daily Class Minutes**
  - Add, edit, and delete class minutes
  - Include content, announcements, and tasks
  - Date-specific organization
  - Rich text formatting support

- **Student Management**
  - Approve/reject student join requests
  - Remove students from classes
  - View complete student lists

- **Profile Management**
  - Update personal information
  - View teaching schedule
  - Manage department affiliations

### For Students

- **Class Discovery**
  - Browse available classes by university, department, and semester
  - Request to join classes
  - View class details before enrollment

- **Class Access**
  - View enrolled classes
  - Access daily class minutes
  - Review historical content by date
  - Leave classes when needed

- **Profile Management**
  - Update personal information
  - Change semester upon promotion
  - Manage department preferences

### Authentication & Security

- University registration number-based login
- Secure password authentication
- Session management
- Role-based access control

### User Interface

- Clean, modern design inspired by Claude AI
- Responsive layout for all devices
- Intuitive navigation
- Toast notifications for user feedback
- Loading states for better UX

---

## Technology Stack

### Frontend
- **React 18.2.0** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Context API** - State management
- **Axios** - HTTP client for API calls

### Backend
- **Node.js + Express** - REST API server
- **PostgreSQL** - Production database
- **Prisma ORM** - Type-safe database operations
- **bcryptjs** - Password hashing (10 salt rounds)
- **JWT** - Token-based authentication
- **Multi-Tenant Architecture** - University data isolation

### Security
- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Brute force protection (5 attempts/5min)
- **SQL Injection Protection** - Prisma ORM
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Request sanitization

### Development Tools
- **Create React App** - Frontend setup
- **Prisma Studio** - Database GUI
- **Nodemon** - Backend auto-reload
- **ES6+** - Modern JavaScript
- **React Hooks** - Functional components

---

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/muhammadsudaiskhalid/SmartClassroom.git
   cd SmartClassroom
   ```

2. **Backend Setup** (Required for database)

   See **[server/QUICKSTART.md](server/QUICKSTART.md)** for detailed instructions.

   ```bash
   # Quick start
   cd server
   setup.bat
   ```

   This will:
   - Install backend dependencies
   - Setup PostgreSQL database
   - Run migrations
   - Seed demo data
   - Start API server on port 5000

3. **Frontend Setup**

   ```bash
   # Install frontend dependencies
   cd ..
   npm install

   # Install API client
   npm install axios

   # Create environment file
   echo REACT_APP_API_URL=http://localhost:5000/api > .env
   ```

4. **Start Development**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Important Documentation

📚 **Before starting, read these guides:**

- **[server/QUICKSTART.md](server/QUICKSTART.md)** - Step-by-step backend setup
- **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** - Connect React to API
- **[DATABASE_SETUP_SUMMARY.md](DATABASE_SETUP_SUMMARY.md)** - Architecture overview
- **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** - Complete setup checklist

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

---

## Configuration

### University Configuration

Edit `src/utils/constants.js` to add/modify universities:

```javascript
export const UNIVERSITIES = [
  Shifa Tameer-e-Millat University Islamabad',
  'NUST',
  'PIEAS',
  // Add more universities
];
```

### Department Configuration

Customize departments in `src/utils/constants.js`:

```javascript
export const DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Artificial Intelligence',
  // Add more departments
];
```

### Semester Configuration

Modify available semesters:

```javascript
export const SEMESTERS = [
  '1st Semester',
  '2nd Semester',
  // Up to 8th Semester
];
```

---

## Usage

### Getting Started

1. **Create an Account**
   - Choose user type (Teacher/Student)
   - Enter personal details
   - Select university and department
   - Students select their current semester
   - Use registration number as username

2. **For Teachers**
   - Create classes for one or multiple departments
   - Wait for student join requests
   - Approve students to enroll
   - Add daily class minutes with content, announcements, and tasks
   - Manage enrolled students

3. **For Students**
   - Browse available classes in your department and semester
   - Request to join classes
   - View daily class minutes after teacher approval
   - Access historical content
   - Leave classes when needed

### Sample Credentials

**Teacher Account:**
- Registration Number: `T-2021-CS-001`
- Password: `teacher123`

**Student Account:**
- Registration Number: `FA21-BSE-001`
- Password: `student123`

---

## Project Structure

```
smart-classroom/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── AuthLayout.jsx
│   │   ├── teacher/
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── CreateClass.jsx
│   │   │   ├── ClassCard.jsx
│   │   │   ├── ClassDetail.jsx
│   │   │   ├── AddMinutes.jsx
│   │   │   ├── JoinRequestsList.jsx
│   │   │   └── StudentsList.jsx
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AvailableClasses.jsx
│   │   │   ├── MyClasses.jsx
│   │   │   ├── ClassView.jsx
│   │   │   └── MinutesHistory.jsx
│   │   ├── shared/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MinuteCard.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       └── MainLayout.jsx
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── class.service.js
│   │   ├── minutes.service.js
│   │   ├── student.service.js
│   │   └── storage.service.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ClassContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useClasses.js
│   │   ├── useMinutes.js
│   │   └── useStorage.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── dateFormatter.js
│   │   └── validators.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── index.js
├── package.json
├── tailwind.config.js
├── README.md
└── .gitignore
```

---

## API Documentation

### Storage Service

```javascript
// Get data
const result = await storageService.get(key, shared);

// Set data
await storageService.set(key, value, shared);

// Delete data
await storageService.delete(key, shared);

// List keys
const keys = await storageService.list(prefix, shared);
```

### Authentication Service

```javascript
// Sign up
await authService.signUp(userData);

// Sign in
await authService.signIn(registrationNumber, password);

// Sign out
await authService.signOut();

// Update profile
await authService.updateProfile(registrationNumber, updates);
```

### Class Service

```javascript
// Create class
await classService.createClass(classData);

// Get filtered classes
await classService.getFilteredClasses(university, department, semester);

// Add student
await classService.addStudentToClass(classId, student);

// Remove student
await classService.removeStudentFromClass(classId, studentId);
```

---

## Roadmap

### Version 2.0 (Planned)
- [ ] Real-time chat between teachers and students
- [ ] File upload for assignments and materials
- [ ] Attendance tracking system
- [ ] Grade management
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Mobile app (React Native)

### Version 2.5 (Future)
- [ ] Video conferencing integration
- [ ] Quiz and assessment tools
- [ ] Discussion forums
- [ ] Parent portal
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## Contributing

I welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Be respectful and constructive

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**Project Maintainer:** Sudais Khalid

- Email: msudaiskhalid.ai@gmail.com
- GitHub: [@muhammadsudaiskhalid](https://github.com/muhammadsudaiskhalid)
- LinkedIn: [Sudais Khalid](https://linkedin.com/in/sudais-khalid)

**Project Link:** [https://github.com/yourusername/smart-classroom](https://github.com/yourusername/smart-classroom)

---

## Acknowledgments

- [React](https://reactjs.org/) - The amazing UI library
- [Tailwind CSS](https://tailwindcss.com/) - For the beautiful styling
- [Lucide Icons](https://lucide.dev/) - For the clean icons
- [Claude AI](https://claude.ai/) - For inspiration and design guidance
- All contributors and supporters of this project

---

## Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/smart-classroom?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/smart-classroom?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/smart-classroom?style=social)

---

<div align="center">

**Made with ❤️ for Pakistani Universities**

⭐ Star this repository if you find it helpful!

[Report Bug](https://github.com/yourusername/smart-classroom/issues) • [Request Feature](https://github.com/yourusername/smart-classroom/issues)

</div>

---

## Security

### Reporting Security Issues

If you discover a security vulnerability, please send an email to msudaiskhalid.ai@gmail.com . All security vulnerabilities will be promptly addressed.

### Security Best Practices

- Passwords are stored securely (implement hashing in production)
- Input validation on all forms
- XSS protection
- CSRF protection
- Regular dependency updates

---

## Documentation

For detailed documentation, visit our [Wiki](https://github.com/yourusername/smart-classroom/wiki) or [Documentation Site](https://docs.smartclassroom.com).

### Quick Links

- [User Guide](docs/USER_GUIDE.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [FAQ](docs/FAQ.md)

---

## FAQ

**Q: Can I use this for my university?**  
A: Yes! The system is designed to be easily customizable for any university.

**Q: Is it free to use?**  
A: Yes, it's completely free and open-source under MIT license.

**Q: Can I contribute?**  
A: Absolutely! We welcome all contributions.

**Q: Does it work on mobile devices?**  
A: Yes, the interface is fully responsive and works on all devices.

**Q: How do I report bugs?**  
A: Please create an issue on GitHub with detailed information.

---

<div align="center">

**© 2025 Smart Classroom. All Rights Reserved.**

</div>
