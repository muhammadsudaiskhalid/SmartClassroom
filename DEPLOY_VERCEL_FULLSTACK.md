# 🚀 Deploy Full Stack to Vercel

## Overview
Deploy both frontend (React) and backend (API) to Vercel with Neon PostgreSQL (free).

---

## Step 1: Create Free PostgreSQL Database on Neon (3 minutes)

### 1.1 Sign Up for Neon
1. Go to: **https://neon.tech**
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"**
4. Authorize Neon

### 1.2 Create Database
1. Click **"Create a project"**
2. **Project name**: `smartclassroom`
3. **Region**: Choose closest to you
4. **Postgres version**: 16 (default)
5. Click **"Create project"**

### 1.3 Copy Connection String
1. You'll see a **connection string** displayed
2. Look for **"Connection string"** 
3. Click **"Copy"** 
4. It looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
5. **Save this!** You'll need it for Vercel

---

## Step 2: Deploy Backend API to Vercel (5 minutes)

### 2.1 Create vercel.json for Backend
This file tells Vercel how to deploy the backend.

**File**: `d:/SmartClassroom/server/vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### 2.2 Deploy Backend to Vercel
1. Go to **https://vercel.com**
2. Click **"Add New..."** → **"Project"**
3. Select **"SmartClassroom"** repo
4. Click **"Import"**

**Configure Backend Project:**
- **Project Name**: `smartclassroom-backend`
- **Framework Preset**: Other
- **Root Directory**: Click "Edit" → Enter `server`
- **Build Command**: Leave empty or `npm install`
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

**Add Environment Variables** (click "Environment Variables"):
```
DATABASE_URL = [Paste Neon connection string from Step 1.3]
JWT_SECRET = 77896c86fd8a12c0941cbc745f2cd1850987ac7fdfb1783dd6edf25ccc0f7b7a
SUPER_ADMIN_USERNAME = superadmin
SUPER_ADMIN_PASSWORD = YourStrongPassword123!
NODE_ENV = production
FRONTEND_URL = https://smartclassroom.vercel.app
```

Click **"Deploy"**

### 2.3 Get Backend URL
1. After deployment, copy the URL
2. Example: `https://smartclassroom-backend.vercel.app`
3. **Test it**: `https://your-backend-url.vercel.app/health`

---

## Step 3: Initialize Database (2 minutes)

Since Vercel serverless functions run on-demand, we need to initialize the database once:

### Option A: Use Vercel CLI (Easiest)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Link to backend project:
```bash
cd d:\SmartClassroom\server
vercel link
```

4. Run database setup:
```bash
vercel env pull .env.production
npx prisma db push
npx prisma db seed
```

### Option B: Manual via Database Client

1. Install database client globally:
```bash
npm install -g prisma
```

2. Set environment variable (replace with your Neon connection string):
```bash
set DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require
```

3. Push schema and seed:
```bash
cd d:\SmartClassroom\server
npx prisma db push
npx prisma db seed
```

---

## Step 4: Deploy Frontend to Vercel (3 minutes)

### 4.1 Deploy Frontend
1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Select **"SmartClassroom"** repo again
3. Click **"Import"**

**Configure Frontend Project:**
- **Project Name**: `smartclassroom` (or `smartclassroom-frontend`)
- **Framework Preset**: Create React App
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build`
- **Output Directory**: `build`

**Add Environment Variable:**
```
REACT_APP_API_URL = https://your-backend-url.vercel.app/api
```
(Use the backend URL from Step 2.3)

Click **"Deploy"**

### 4.2 Get Frontend URL
1. After deployment: `https://smartclassroom.vercel.app`
2. Copy this URL

---

## Step 5: Update Backend CORS (1 minute)

1. Go back to **backend project** in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Find **FRONTEND_URL**
4. Update to your actual frontend URL: `https://smartclassroom.vercel.app`
5. Click **"Save"**
6. Go to **"Deployments"** → Click **"Redeploy"**

---

## Step 6: Test Full Stack (2 minutes)

1. Open frontend URL: `https://smartclassroom.vercel.app`
2. Login with:
   - Username: `DU-S001`
   - Password: `Student@123`
3. ✅ Should see dashboard with classes!

---

## ✅ What You Get

- ✅ Frontend: Hosted on Vercel (free)
- ✅ Backend API: Hosted on Vercel (free)
- ✅ Database: Neon PostgreSQL (free - 0.5GB)
- ✅ SSL: Automatic HTTPS
- ✅ Auto-deploy: Push to GitHub = auto-deploy
- ✅ Cost: $0/month

---

## 🎯 Quick Summary

```
1. Neon.tech → Create PostgreSQL → Copy connection string
2. Vercel → Deploy Backend (server folder) → Add env variables → Get URL
3. Local → Run prisma db push && db seed
4. Vercel → Deploy Frontend (root) → Add API URL
5. Update backend FRONTEND_URL → Redeploy
6. Test login!
```

---

## 💾 Important URLs to Save

- **Frontend**: https://____________.vercel.app
- **Backend**: https://____________.vercel.app  
- **Database**: [Your Neon connection string]
- **Health Check**: https://backend-url.vercel.app/health

---

**Start with Step 1: Create Neon database now!** 🚀
