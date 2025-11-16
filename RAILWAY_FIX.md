# 🚨 RAILWAY DEPLOYMENT FIX

## Problem
Railway is detecting your project as a React app (frontend) instead of the Node.js backend.

## Solution
Configure Railway to use the `/server` directory as the root.

---

## Fix in Railway Dashboard (2 minutes)

### Step 1: Go to Railway Service Settings

1. Open your Railway project
2. Click on the **service** (not the database)
3. Go to **"Settings"** tab

### Step 2: Set Root Directory

1. Scroll down to find **"Root Directory"**
2. Enter: `server`
3. Click **"Update"** or the save icon
4. Railway will **automatically redeploy** with the correct directory

### Step 3: Verify Build

1. Go to **"Deployments"** tab
2. Watch the new deployment
3. You should now see:
   ```
   ↳ Detected Node
   ↳ Using npm package manager
   ↳ Installing dependencies...
   ↳ Building with Prisma...
   ```

---

## Expected Deployment Output

After setting root directory to `server`, you should see:

```
Detected Node.js project
Installing dependencies from package.json
Running: npm ci
Running: npx prisma generate
Starting server: node index.js
🚀 Server running on port 5000
```

---

## Alternative: Delete and Recreate Service

If setting Root Directory doesn't work:

### Option A: Add Service from Dashboard

1. In Railway project, click **"New"**
2. Select **"Empty Service"**
3. Go to service **"Settings"**
4. Connect to GitHub repo
5. Set **Root Directory** to `server`
6. Add all environment variables (see `RAILWAY_ENV_VARIABLES.md`)
7. Deploy

### Option B: Use Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set root directory via CLI
railway up --service backend --rootDirectory server
```

---

## After Fix: Verify Everything

1. **Check Deployment Logs**:
   - Should see `🚀 Server running on port 5000`
   - Should see Prisma Client generated
   - Should see database seeded

2. **Test Health Endpoint**:
   - Visit: `https://your-backend-url.railway.app/health`
   - Should return: `{"status":"ok"}`

3. **Check Environment Variables**:
   - Make sure all 7 variables are still set:
     - DATABASE_URL
     - JWT_SECRET
     - SUPER_ADMIN_USERNAME
     - SUPER_ADMIN_PASSWORD
     - NODE_ENV
     - PORT
     - FRONTEND_URL

---

## Quick Fix Summary

**The Issue**: Railway thinks you're deploying frontend (React)
**The Fix**: Set Root Directory to `server` in Railway Settings
**Takes**: 30 seconds + redeploy time (2 minutes)

---

## Step-by-Step Visual Guide

```
Railway Dashboard
    ↓
Click Your Service (not database)
    ↓
Settings Tab
    ↓
Scroll to "Root Directory"
    ↓
Enter: server
    ↓
Click Update
    ↓
Wait for Auto-Redeploy (2 min)
    ↓
✅ Backend Deployed!
```

---

## If You Still See Errors

### Error: "npm ci failed"
**Cause**: Railway still using wrong directory
**Fix**: Double-check Root Directory is exactly `server` (lowercase, no slashes)

### Error: "Cannot find module"
**Cause**: Dependencies not installed in server folder
**Fix**: Verify Root Directory setting, redeploy

### Error: "Prisma Client not generated"
**Fix**: Add build command in Settings:
- Build Command: `npx prisma generate`
- Start Command: `npx prisma db push && node prisma/seed.js ; node index.js`

---

## Need to Start Over?

1. Delete the service in Railway (not the database!)
2. Create new service
3. Select "Deploy from GitHub repo"
4. Choose `SmartClassroom`
5. **IMMEDIATELY** set Root Directory to `server` before first deploy
6. Add all environment variables
7. Deploy

---

**Go fix it now**: Railway Dashboard → Your Service → Settings → Root Directory → `server` → Update

Then come back and let me know if it works! 🚀
