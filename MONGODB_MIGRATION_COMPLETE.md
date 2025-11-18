# MongoDB Migration & Vercel Deployment Guide

## 🎉 Migration Status: 95% Complete!

### ✅ What's Done:

1. **Mongoose Models Created** (8 models)
   - University.js
   - Admin.js
   - Teacher.js
   - Student.js
   - Class.js
   - Enrollment.js
   - JoinRequest.js
   - Minute.js

2. **Backend Updated**
   - package.json: Removed Prisma, added Mongoose
   - index.js: MongoDB connection + auth routes converted
   - routes/classes.js: Complete class management API (Mongoose)
   - routes/users.js: Complete user management API (Mongoose)
   - seed.js: MongoDB seed script with demo data

3. **Dependencies Installed**
   - mongoose@^8.0.3 installed
   - Prisma packages removed

4. **Files Cleaned**
   - Prisma folder deleted
   - Old route files replaced

---

## 🚀 Next Steps (5-10 minutes)

### Step 1: Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login with your account
3. Select your project: **SmartClassroom** (ID: 691c0141bee0ce7c1a5a520b)
4. Click **"Connect"** on your cluster
5. Choose **"Connect your application"**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your database user password
8. Add the database name `smartclassroom` before the `?`:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smartclassroom?retryWrites=true&w=majority
   ```

### Step 2: Update .env File

Open `server/.env` and replace the MongoDB connection strings:

```env
MONGODB_URI="mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/smartclassroom?retryWrites=true&w=majority"
DATABASE_URL="mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/smartclassroom?retryWrites=true&w=majority"
```

**Important:** Use the EXACT connection string from MongoDB Atlas!

### Step 3: Test MongoDB Connection & Seed Database

Open terminal and run:

```bash
cd d:\SmartClassroom\server
npm run seed
```

**Expected Output:**
```
Connecting to MongoDB...
Connected to MongoDB
Clearing existing data...
Data cleared
Creating universities...
Created universities: Demo University, Test Institute
...
✅ Database seeded successfully!

📊 Summary:
   Universities: 2
   Admins: 2
   Teachers: 3
   Students: 4
   Classes: 3
   Enrollments: 5
   Join Requests: 2
   Attendance Minutes: 5
```

### Step 4: Test Backend Locally

```bash
npm start
```

**Test endpoints:**

1. **Health Check:** http://localhost:5000/health
   
2. **Login Test (Admin):**
   ```bash
   curl -X POST http://localhost:5000/api/auth/admin/login \
     -H "Content-Type: application/json" \
     -d "{\"registrationNumber\":\"ADMIN001\",\"password\":\"password123\"}"
   ```

3. **Login Test (Teacher):**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"registrationNumber\":\"DU-T001\",\"password\":\"password123\"}"
   ```

4. **Login Test (Student):**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"registrationNumber\":\"DU-S001\",\"password\":\"password123\"}"
   ```

All should return a JWT token and user data!

---

## 📦 Deploy to Vercel (Both Frontend & Backend)

### Part A: Deploy Backend API

1. **Push code to GitHub:**
   ```bash
   cd d:\SmartClassroom
   git add .
   git commit -m "Migrate to MongoDB with Mongoose"
   git push origin main
   ```

2. **Create Vercel Project for Backend:**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New" → "Project"**
   - Import your GitHub repository
   - **Root Directory:** `server`
   - Click **"Deploy"**

3. **Add Environment Variables** (in Vercel project settings):
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smartclassroom?retryWrites=true&w=majority
   
   JWT_SECRET = SmartClassroom-JWT-Secret-2025-Change-This-In-Production-Use-Long-Random-String
   
   SUPER_ADMIN_USERNAME = superadmin
   
   SUPER_ADMIN_PASSWORD = superadmin@iamsudaiskhalid
   
   NODE_ENV = production
   
   FRONTEND_URL = https://your-frontend.vercel.app
   ```

4. **Redeploy** after adding environment variables

5. **Test API:** `https://your-backend.vercel.app/health`

### Part B: Deploy Frontend

1. **Create another Vercel Project for Frontend:**
   - Click **"Add New" → "Project"**
   - Import same GitHub repository
   - **Root Directory:** Leave empty (use root)
   - Framework Preset: Create React App
   - Click **"Deploy"**

2. **Add Environment Variable:**
   ```
   REACT_APP_API_URL = https://your-backend.vercel.app
   ```

3. **Update Frontend .env** (optional for local):
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app
   ```

4. **Redeploy** after adding environment variable

5. **Test:** Open `https://your-frontend.vercel.app` and try logging in!

---

## 🧪 Demo Credentials (All use password: `password123`)

### Admins:
| University | Registration | Email |
|------------|-------------|-------|
| Demo University | ADMIN001 | admin1@demouniversity.edu |
| Test Institute | ADMIN002 | admin2@testinstitute.edu |

### Teachers:
| University | Registration | Email | Department |
|------------|-------------|-------|------------|
| Demo University | DU-T001 | sarah.smith@demouniversity.edu | Computer Science |
| Demo University | DU-T002 | michael.johnson@demouniversity.edu | Mathematics |
| Test Institute | TI-T101 | emily.chen@testinstitute.edu | Physics |

### Students:
| University | Registration | Email | Department | Semester |
|------------|-------------|-------|------------|----------|
| Demo University | DU-S001 | alice.williams@student.demouniversity.edu | Computer Science | 3 |
| Demo University | DU-S002 | bob.davis@student.demouniversity.edu | Computer Science | 2 |
| Test Institute | TI-S101 | charlie.brown@student.testinstitute.edu | Physics | 4 |
| Demo University | DU-S003 | diana.martinez@student.demouniversity.edu | Mathematics | 1 |

### Classes:
| Code | Name | Teacher | University |
|------|------|---------|------------|
| CS101 | Introduction to Programming | Dr. Sarah Smith | Demo University |
| MATH101 | Calculus I | Prof. Michael Johnson | Demo University |
| PHY301 | Quantum Mechanics | Dr. Emily Chen | Test Institute |

---

## 🔍 Troubleshooting

### "MongooseError: Connection failed"
- Check your MongoDB connection string in .env
- Ensure IP whitelist in MongoDB Atlas (0.0.0.0/0 for allow all)
- Verify database user credentials

### "Cannot find module 'mongoose'"
```bash
cd server
npm install mongoose
```

### "Seed script fails"
- Check MONGODB_URI is set correctly
- Ensure MongoDB cluster is running
- Check network connection

### "Vercel deployment fails"
- Ensure `server/vercel.json` exists
- Check build logs for errors
- Verify environment variables are set

### "CORS errors"
- Add your frontend URL to FRONTEND_URL env variable
- Check CORS configuration in index.js

---

## 📝 What Changed from Prisma to Mongoose?

| Aspect | Prisma | Mongoose |
|--------|--------|----------|
| ORM | Prisma Client | Mongoose ODM |
| Database | PostgreSQL | MongoDB Atlas |
| Schema | schema.prisma | model files |
| Query | `prisma.user.findMany()` | `User.find()` |
| ID Field | `id` (String) | `_id` (ObjectId) |
| Relations | `.include()` | `.populate()` |
| Create | `create({ data })` | `create({})` |
| Migration | `prisma migrate` | None (schemaless) |

---

## ✅ Migration Checklist

- [x] Create Mongoose models (8 models)
- [x] Update package.json (remove Prisma, add Mongoose)
- [x] Update index.js (MongoDB connection)
- [x] Convert authentication routes
- [x] Convert university routes
- [x] Create routes/classes.js (Mongoose)
- [x] Create routes/users.js (Mongoose)
- [x] Create seed.js for MongoDB
- [x] Delete Prisma folder
- [x] Install dependencies
- [ ] Update .env with MongoDB connection string (YOU DO THIS)
- [ ] Run seed script (YOU DO THIS)
- [ ] Test locally (YOU DO THIS)
- [ ] Deploy to Vercel (YOU DO THIS)

---

## 🎯 Summary

You've successfully migrated from **Prisma/PostgreSQL** to **Mongoose/MongoDB**! 

**What you need to do:**
1. Get MongoDB connection string from Atlas
2. Update `server/.env` with your connection string
3. Run `npm run seed` to populate database
4. Test locally with `npm start`
5. Deploy both frontend and backend to Vercel

**Total time:** 5-10 minutes

Good luck! 🚀
