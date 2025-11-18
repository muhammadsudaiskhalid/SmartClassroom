# 🚀 Quick Vercel Deployment Reference

## 📋 Copy-Paste Ready Values

### Backend Environment Variables (6 total):

```
MONGODB_URI
mongodb+srv://msudaiskhalidai_db_user:bjWplPTjnTylgofP@cluster0.pobn6iu.mongodb.net/smartclassroom?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
SmartClassroom-JWT-Secret-2025-Change-This-In-Production-Use-Long-Random-String

SUPER_ADMIN_USERNAME
superadmin

SUPER_ADMIN_PASSWORD
superadmin@iamsudaiskhalid

NODE_ENV
production

FRONTEND_URL
*
```

### Frontend Environment Variable (1 total):

```
REACT_APP_API_URL
https://smartclassroom-backend.vercel.app
```
✅ **Your Backend URL:** https://smartclassroom-backend.vercel.app

---

## 🎯 Deployment Order

1. **Deploy Backend First** → Get backend URL
2. **Deploy Frontend** → Use backend URL in env variable
3. **Update Backend CORS** → Use frontend URL
4. **Test Everything**

---

## ⚙️ Project Settings

### Backend:
- Root Directory: `server` ✓
- Framework: Other
- Build Command: (empty)

### Frontend:
- Root Directory: (root - don't change)
- Framework: Create React App
- Build Command: `npm run build`

---

## 🧪 Test URLs

```
Backend Health:  https://your-backend.vercel.app/health
Frontend:        https://your-frontend.vercel.app
Admin Portal:    https://your-frontend.vercel.app/admin
```

---

## 🔐 Test Credentials

**Student:** DU-S001 / password123
**Teacher:** DU-T001 / password123
**Admin:** ADMIN001 / password123

---

## ✅ Current Status

- ✅ Code pushed to GitHub
- ✅ MongoDB connected and seeded
- ✅ Vercel tab opened
- 🔄 **Next: Import repository and configure**

**Follow VERCEL_DEPLOY.md for complete instructions!**
