# 🚀 Quick Switch to Render.com (Railway Alternative)

Railway is having persistent GitHub snapshot issues. Render is more reliable and also FREE!

---

## Deploy to Render (10 minutes)

### Step 1: Create Render Account

1. Go to: **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub**
4. Authorize Render

### Step 2: Create PostgreSQL Database

1. Click **"New +"** button (top right)
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `smartclassroom-db`
   - **Database**: `smartclassroom`
   - **User**: `smartclassroom`
   - **Region**: Choose closest to you
   - **Plan**: **Free** (select free tier)
4. Click **"Create Database"**
5. **Wait 2-3 minutes** for database to be ready
6. **Copy** the **Internal Database URL** (you'll need it soon)

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect to **GitHub** repo: `SmartClassroom`
3. Configure:
   - **Name**: `smartclassroom-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: **Node**
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npx prisma db push --accept-data-loss && node prisma/seed.js ; node index.js`
   - **Plan**: **Free**

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these 7 variables:

```
DATABASE_URL = [Paste the Internal Database URL from Step 2]
JWT_SECRET = 77896c86fd8a12c0941cbc745f2cd1850987ac7fdfb1783dd6edf25ccc0f7b7a
SUPER_ADMIN_USERNAME = superadmin
SUPER_ADMIN_PASSWORD = YourStrongPassword123!
NODE_ENV = production
PORT = 10000
FRONTEND_URL = https://smartclassroom.vercel.app
```

**IMPORTANT**: 
- For `DATABASE_URL`, use the **Internal Database URL** from your PostgreSQL database
- Change `SUPER_ADMIN_PASSWORD` to your own password

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building (2-3 minutes)
3. Watch the logs - should see:
   - ✅ Installing dependencies
   - ✅ Generating Prisma Client
   - ✅ Pushing database schema
   - ✅ Seeding demo data
   - ✅ Server running on port 10000

### Step 6: Get Your Backend URL

1. Once deployed, you'll see your URL at the top
2. Format: `https://smartclassroom-backend.onrender.com`
3. **Copy this URL** - you'll need it for Vercel!

### Step 7: Test Backend

1. Open browser
2. Go to: `https://your-render-url.onrender.com/health`
3. Should see: `{"status":"ok","timestamp":"..."}`

✅ **If you see this - Backend is working!**

---

## Why Render > Railway for This

✅ No GitHub snapshot errors
✅ More reliable free tier
✅ Better build logs
✅ Same features (free PostgreSQL + hosting)
✅ No credit card required

---

## Your Render URLs

After deployment, save these:

- **Database**: `smartclassroom-db` (Internal URL)
- **Backend**: `https://smartclassroom-backend.onrender.com`
- **Health Check**: `https://smartclassroom-backend.onrender.com/health`

---

## Next Step: Deploy Frontend to Vercel

Once Render backend is working:

1. Go to **Vercel.com**
2. Sign in with GitHub
3. Import `SmartClassroom` repo
4. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-render-backend.onrender.com/api`
5. Deploy!

---

**Start here: https://render.com** 🚀

Much simpler than Railway's current issues!
