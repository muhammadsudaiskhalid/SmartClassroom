# Smart Classroom 🎓

<div align="center">

![Smart Classroom](https://img.shields.io/badge/Smart-Classroom-orange)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

**A modern, real-time classroom management platform connecting teachers and students across universities**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Demo](#-demo) • [Contributing](#-contributing)

</div>

---

## 📖 About

Smart Classroom is a full-stack web application designed to streamline classroom management for universities in Pakistan. It provides a centralized platform for teachers to create and manage classes, post daily minutes, and communicate with students in real-time.

### Why Smart Classroom?

✨ **Multi-tenant Architecture** - Support for multiple universities  
⚡ **Real-time Communication** - WebSocket-based group chat in every class  
🎯 **Role-based Access** - Separate interfaces for Teachers, Students, and Admins  
📱 **Responsive Design** - Works seamlessly on all devices  
🔒 **Secure & Scalable** - Production-ready with JWT auth and MongoDB  

---

## 🌟 Features

### For Teachers
- 📚 Create and manage classes for multiple departments
- ✍️ Post daily class minutes with content, announcements, and tasks
- 👥 Approve/reject student join requests
- 💬 Real-time group chat with enrolled students
- 📊 View class statistics and student lists

### For Students
- 🔍 Discover classes by university, department, and semester
- 📝 Request to join classes and track approval status
- 📖 Access class minutes and materials
- 💬 Participate in class group chats
- 📅 View historical class content by date

### For Administrators
- 🏛️ Manage multiple universities (Super Admin)
- 👨‍🏫 Manage teachers and students (University Admin)
- ✅ Approve join requests
- 📈 View system statistics and analytics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muhammadsudaiskhalid/SmartClassroom.git
   cd SmartClassroom
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB URI and secrets
   
   # Seed database (optional)
   npm run seed
   
   # Start server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   # In root directory
   npm install
   
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:5000" > .env
   
   # Start development server
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Admin: http://localhost:3000/#admin

---

## 💻 Technology Stack

### Frontend
- **React 18.2** - UI framework
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Icons

### Backend
- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## 📚 Documentation

For detailed documentation, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)

- **[Installation Guide](PROJECT_DOCUMENTATION.md#-installation--setup)**
- **[User Guide](PROJECT_DOCUMENTATION.md#-user-guide)**
- **[Developer Guide](PROJECT_DOCUMENTATION.md#-developer-guide)**
- **[API Documentation](PROJECT_DOCUMENTATION.md#-api-documentation)**
- **[Deployment Guide](PROJECT_DOCUMENTATION.md#-deployment-guide)**
- **[Troubleshooting](PROJECT_DOCUMENTATION.md#-troubleshooting)**

---

## 🎯 Project Structure

```
SmartClassroom/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── auth/       # Authentication
│   │   ├── teacher/    # Teacher dashboard
│   │   ├── student/    # Student dashboard
│   │   ├── admin/      # Admin panels
│   │   └── shared/     # Reusable components
│   ├── context/        # React Context (Auth, Class, Socket)
│   ├── services/       # API services
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utilities
├── server/             # Backend application
│   ├── models/         # MongoDB models
│   ├── routes/         # Express routes
│   └── index.js        # Server entry
└── build/              # Production build
```

---

## 🎬 Demo

### Screenshots

#### Teacher Dashboard
![Teacher Dashboard](https://via.placeholder.com/800x400/f97316/ffffff?text=Teacher+Dashboard)

#### Student Dashboard
![Student Dashboard](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Student+Dashboard)

#### Real-time Chat
![Chat Interface](https://via.placeholder.com/800x400/10b981/ffffff?text=Real-time+Chat)

---

## 🚢 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel (Frontend)
```bash
vercel --prod
```

### Deploy to Railway (Backend)
```bash
railway up
```

See [Deployment Guide](PROJECT_DOCUMENTATION.md#-deployment-guide) for detailed instructions.

---

## 🔒 Security

- ✅ JWT-based authentication
- ✅ bcrypt password hashing (10 rounds)
- ✅ Rate limiting (5 attempts/5min)
- ✅ CORS protection
- ✅ Input validation
- ✅ XSS protection
- ✅ Socket.IO authentication

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sudais Khalid**
- Email: msudaiskhalid.ai@gmail.com
- GitHub: [@muhammadsudaiskhalid](https://github.com/muhammadsudaiskhalid)
- LinkedIn: [Sudais Khalid](https://linkedin.com/in/sudais-khalid)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Amazing UI library
- [Tailwind CSS](https://tailwindcss.com/) - Beautiful styling
- [Socket.IO](https://socket.io/) - Real-time communication
- [MongoDB](https://www.mongodb.com/) - Flexible database
- [Lucide](https://lucide.dev/) - Clean icons

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/muhammadsudaiskhalid/SmartClassroom?style=social)
![GitHub forks](https://img.shields.io/github/forks/muhammadsudaiskhalid/SmartClassroom?style=social)
![GitHub issues](https://img.shields.io/github/issues/muhammadsudaiskhalid/SmartClassroom)

---

<div align="center">

**Made with ❤️ for Modern Education**

[Report Bug](https://github.com/muhammadsudaiskhalid/SmartClassroom/issues) • [Request Feature](https://github.com/muhammadsudaiskhalid/SmartClassroom/issues) • [Documentation](PROJECT_DOCUMENTATION.md)

</div>
