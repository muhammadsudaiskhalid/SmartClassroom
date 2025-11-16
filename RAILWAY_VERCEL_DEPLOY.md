# 🚀 Railway + Vercel Deployment - Step by Step Guide

## Part 1: Deploy Backend to Railway (10 minutes)

### Step 1: Push Latest Changes to GitHub

First, let's make sure all your code is on GitHub:

```bash
cd d:\SmartClassroom
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Create Railway Account & Deploy

1. **Go to Railway**: https://railway.app
   
2. **Sign Up/Login**:
   - Click "Login" (top right)
   - Choose "Login with GitHub"
   - Authorize Railway to access your GitHub

3. **Create New Project**:
   - Click "New Project" (or "Start a New Project")
   - Select "Deploy from GitHub repo"
   - Find and select `muhammadsudaiskhalid/SmartClassroom`

4. **Add PostgreSQL Database**:
   - In your project, click "New"
   - Select "Database"
   - Choose "Add PostgreSQL"
   - Railway will create the database automatically
   - **IMPORTANT**: Copy the connection string (you'll need it)

### Step 3: Configure Backend Service

1. **Set Root Directory**:
   - Click on your backend service (not the database)
   - Go to "Settings" tab
   - Find "Root Directory"
   - Enter: `server`
   - Click "Save"

2. **Add Environment Variables**:
   - Click on "Variables" tab
   - Click "New Variable" and add these one by one:

   ```
   DATABASE_URL = ${{Postgres.DATABASE_URL}}
   ```
   *(This automatically uses Railway's PostgreSQL)*

   ```
   JWT_SECRET = [Generate a strong secret - see below]
   ```
   *Generate strong JWT secret with this command in terminal:*
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   *Copy the output and paste as JWT_SECRET value*

   ```
   SUPER_ADMIN_USERNAME = superadmin
   ```

   ```
   SUPER_ADMIN_PASSWORD = [Create a strong password]
   ```
   *Example: SuperAdmin@SmartClass2025!*

   ```
   NODE_ENV = production
   ```

   ```
   PORT = 5000
   ```

   ```
   FRONTEND_URL = https://smartclassroom.vercel.app
   ```
   *(You'll update this later with your actual Vercel URL)*

### Step 4: Deploy Backend

1. **Trigger Deployment**:
   - Railway should auto-deploy after you save variables
   - If not, go to "Deployments" tab and click "Deploy"

2. **Wait for Build** (2-3 minutes):
   - Watch the logs for any errors
   - You should see "Build successful"
   - Then "Deployment successful"

3. **Get Your Backend URL**:
   - Go to "Settings" tab
   - Scroll to "Networking" section
   - Click "Generate Domain"
   - Copy the URL (e.g., `smartclassroom-production.up.railway.app`)
   - **SAVE THIS URL** - you'll need it for frontend!

### Step 5: Initialize Database

Railway should automatically run your seed script. To verify:

1. **Check Deployment Logs**:
   - Go to "Deployments" tab
   - Click on latest deployment
   - Look for seed messages in logs

2. **If seed didn't run**, manually trigger it:
   - Go to service settings
   - Find "Start Command"
   - Change to: `npx prisma generate && npx prisma db push && node prisma/seed.js && node index.js`
   - Redeploy

3. **Or use Railway CLI** (optional):
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   railway run npm run db:seed
   ```

### Step 6: Test Backend

1. **Test Health Endpoint**:
   - Open browser
   - Go to: `https://your-backend-url.up.railway.app/health`
   - Should see: `{"status":"ok","timestamp":"..."}`

2. **Test Login** (optional):
   - Use Postman or curl
   ```bash
   curl -X POST https://your-backend-url.up.railway.app/api/auth/login ^
     -H "Content-Type: application/json" ^
     -d "{\"username\":\"DU-S001\",\"password\":\"Student@123\"}"
   ```
   - Should return a JWT token

---

## Part 2: Deploy Frontend to Vercel (5 minutes)

### Step 1: Create Vercel Account

1. **Go to Vercel**: https://vercel.com
2. **Sign Up/Login**:
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"
   - Authorize Vercel

### Step 2: Import Project

1. **New Project**:
   - Click "Add New..." → "Project"
   - Find `muhammadsudaiskhalid/SmartClassroom`
   - Click "Import"

2. **Configure Project**:
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `build` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

### Step 3: Add Environment Variable

1. **Before deploying**, expand "Environment Variables"
2. Click "Add" and enter:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-backend-url.up.railway.app/api`
   *(Replace with your actual Railway URL from Part 1 Step 4)*
   - **Environment**: Select all (Production, Preview, Development)
3. Click "Add"

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait 2-3 minutes** for build
3. **Copy Your URL**:
   - After deployment, you'll get a URL like:
   - `https://smartclassroom.vercel.app`
   - or `https://smartclassroom-xyz123.vercel.app`

### Step 5: Update Backend CORS

Now update Railway backend with your Vercel URL:

1. **Go back to Railway**
2. **Click on your backend service**
3. **Go to "Variables" tab**
4. **Find** `FRONTEND_URL`
5. **Update** with your Vercel URL (e.g., `https://smartclassroom.vercel.app`)
6. **Save** - Railway will auto-redeploy

---

## Part 3: Test Everything (5 minutes)

### Test 1: Frontend Loads

1. Open your Vercel URL in browser
2. You should see the Smart Classroom login page
3. No console errors (press F12 to check)

### Test 2: Login Works

1. Click "Student" login
2. Enter Demo University Student:
   - Username: `DU-S001`
   - Password: `Student@123`
3. Should successfully log in and see dashboard

### Test 3: University Isolation

1. **Logout** (if logged in)
2. Login as **Demo University Student**:
   - Username: `DU-S001`
   - Password: `Student@123`
   - Note the classes shown
3. **Logout**
4. Login as **Test Institute Student**:
   - Username: `TI-S101`
   - Password: `Student@123`
   - Should see DIFFERENT classes (university isolation working!)

### Test 4: Teacher Functions

1. Login as teacher:
   - Username: `DU-T001`
   - Password: `Teacher@123`
2. Try creating a class
3. Try viewing students

### Test 5: Admin Functions

1. Login as admin:
   - Username: `ADMIN001`
   - Password: `Admin@123`
2. Check system stats
3. View all users

---

## 🎉 Deployment Complete!

### Your Live URLs

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.up.railway.app`
- **Database**: Managed by Railway

### Demo Credentials

**Demo University Students:**
- `DU-S001` / `Student@123`
- `DU-S002` / `Student@123`

**Test Institute Student:**
- `TI-S101` / `Student@123`

**Teachers:**
- `DU-T001` / `Teacher@123` (CS)
- `DU-T002` / `Teacher@123` (Math)
- `TI-T101` / `Teacher@123` (Physics)

**Admins:**
- `ADMIN001` / `Admin@123`
- `ADMIN002` / `Admin@123`

**Super Admin:**
- Username: `superadmin`
- Password: (whatever you set in Railway variables)

---

## 📊 Monitoring & Logs

### Railway (Backend)

- **View Logs**: Railway Dashboard → Your Service → Deployments → Click deployment → View logs
- **Database**: Click PostgreSQL service → Connect (for direct DB access)
- **Metrics**: Service → Metrics tab (CPU, Memory, Network)

### Vercel (Frontend)

- **View Logs**: Vercel Dashboard → Your Project → Deployments → Click deployment → View logs
- **Analytics**: Project → Analytics tab
- **Performance**: Project → Speed Insights

---

## 🔄 Updating Your App

### Backend Updates

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend feature"
   git push origin main
   ```
3. Railway auto-deploys! (watch in Railway dashboard)

### Frontend Updates

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend feature"
   git push origin main
   ```
3. Vercel auto-deploys! (watch in Vercel dashboard)

### Database Schema Changes

1. Update `server/prisma/schema.prisma`
2. Push to GitHub
3. Railway will auto-migrate on next deploy
4. Or manually run:
   ```bash
   railway run npx prisma db push
   ```

---

## 🚨 Troubleshooting

### "Cannot connect to backend"

**Check:**
1. Railway service is running (green status)
2. Frontend env variable `REACT_APP_API_URL` is correct
3. Backend `FRONTEND_URL` matches Vercel URL
4. Both have `https://` prefix

**Fix:**
- Redeploy frontend after fixing env variables
- Redeploy backend after fixing CORS

### "Database connection error"

**Check:**
1. Railway PostgreSQL is running
2. `DATABASE_URL` in Railway variables uses `${{Postgres.DATABASE_URL}}`

**Fix:**
- Check Railway logs for database errors
- Verify database is in same Railway project

### "Login fails with 401"

**Check:**
1. Demo data was seeded
2. Using correct credentials
3. Backend `/health` endpoint works

**Fix:**
- Run seed manually: `railway run npm run db:seed`
- Check Railway logs for errors

### "CORS error"

**Check:**
1. `FRONTEND_URL` in Railway matches Vercel URL exactly
2. No trailing slash in URLs

**Fix:**
- Update Railway `FRONTEND_URL` variable
- Redeploy backend

---

## 💰 Pricing (Free Tier Limits)

### Railway Free Tier

- **$5 credit per month** (usually enough for hobby projects)
- Approximately **500 hours** of runtime
- If you run 24/7: ~20-21 days of free hosting
- After credit runs out, service pauses (not deleted)

### Vercel Free Tier

- **Unlimited** deployments
- **100GB bandwidth** per month
- **1000 build hours** per month
- More than enough for most projects!

### Upgrade Options

If you exceed limits:
- **Railway Hobby**: $5/month (no sleep, more resources)
- **Vercel Pro**: $20/month (more bandwidth, analytics)

---

## 🎯 Next Steps

1. **Custom Domain** (optional):
   - Vercel: Project Settings → Domains → Add domain
   - Railway: Service Settings → Networking → Custom domain

2. **Enable HTTPS** (already enabled by default!)
   - Both Railway and Vercel provide free SSL

3. **Set up Monitoring**:
   - Railway: Built-in metrics
   - Vercel: Analytics (free tier includes basic analytics)

4. **Database Backups**:
   - Railway: Manual backups in PostgreSQL service
   - Or use Prisma Studio to export data

5. **Share with Users**!
   - Give them your Vercel URL
   - Share demo credentials
   - Collect feedback!

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support

---

## ✅ Deployment Checklist

Before going live:

- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] Database seeded with demo data
- [ ] Backend health endpoint working
- [ ] Frontend deployed to Vercel
- [ ] Frontend env variable set
- [ ] CORS configured correctly
- [ ] Can login as student
- [ ] Can login as teacher
- [ ] Can login as admin
- [ ] University isolation working
- [ ] Changed default admin password
- [ ] Generated strong JWT secret
- [ ] All features tested
- [ ] URLs saved safely

---

**Ready to deploy? Start with Part 1! 🚀**

Let me know if you get stuck on any step!
