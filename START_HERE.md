# 🚀 START HERE - Quick Setup Guide

## ⚡ Fast Track (5 Minutes)

### Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 16+ installed
- ✅ PostgreSQL 12+ installed and running
- ✅ Git installed

### Step 1: Backend Setup

```cmd
cd server
npm install
copy .env.example .env
```

**Edit `.env` file** with your PostgreSQL password:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smartclassroom"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
SUPER_ADMIN_USERNAME="superadmin"
SUPER_ADMIN_PASSWORD="SuperAdmin@2024!ChangeThis"
```

### Step 2: Database Setup

```cmd
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Step 3: Start Backend

```cmd
npm run dev
```

✅ Backend running on: http://localhost:5000

### Step 4: Frontend Setup (New Terminal)

```cmd
cd ..
npm install axios
```

Create `.env` in root folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Start Frontend

```cmd
npm start
```

✅ Frontend running on: http://localhost:3000

---

## 🎓 Demo Credentials

**Demo University:**
- Admin: `ADMIN001` / `Admin@123`
- Teacher: `DU-T001` / `Teacher@123`
- Student: `DU-S001` / `Student@123`

**Test Institute:**
- Admin: `ADMIN002` / `Admin@123`
- Teacher: `TI-T101` / `Teacher@123`
- Student: `TI-S101` / `Student@123`

---

## ⚠️ If Something Goes Wrong

**PostgreSQL not running?**
```cmd
# Open Services: Win + R → services.msc
# Find "postgresql-x64-XX" → Start
```

**Database doesn't exist?**
```cmd
psql -U postgres
CREATE DATABASE smartclassroom;
\q
```

**Need to reset?**
```cmd
cd server
npx prisma migrate reset
npm run db:seed
```

---

## 📚 Full Documentation

- **Backend Setup**: `server/QUICKSTART.md`
- **API Docs**: `server/README.md`
- **Integration**: `BACKEND_INTEGRATION.md`
- **Architecture**: `DATABASE_SETUP_SUMMARY.md`
- **Checklist**: `IMPLEMENTATION_CHECKLIST.md`

---

## ✅ Success Check

- [ ] Backend health check: http://localhost:5000/health shows `{"status":"ok"}`
- [ ] Frontend loads: http://localhost:3000
- [ ] Can login with demo credentials
- [ ] Database GUI works: `npm run db:studio`

---

**Everything working? Great! Read `BACKEND_INTEGRATION.md` to connect React to the API.** 🎉
