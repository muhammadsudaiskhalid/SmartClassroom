# 🚀 Deployment Guide - Smart Classroom

## Overview

You have two parts to deploy:
1. **Backend** - Node.js API + PostgreSQL database
2. **Frontend** - React application

---

## 🎯 Recommended Deployment Strategy

### Best Option: Use Free Hosting Platforms

- **Backend + Database**: Railway or Render (Free tier)
- **Frontend**: Vercel or Netlify (Free tier)

This keeps frontend and backend separate, which is ideal for scaling.

---

## 📦 Option 1: Railway (Recommended - Easiest)

Railway provides both backend hosting and PostgreSQL database in one place!

### Step 1: Prepare Backend for Deployment

#### A. Update package.json

Open `d:\SmartClassroom\server\package.json` and ensure you have:

```json
{
  "engines": {
    "node": ">=16.0.0"
  },
  "scripts": {
    "start": "node index.js",
    "build": "prisma generate"
  }
}
```

#### B. Create Procfile (optional for Railway)

Create `d:\SmartClassroom\server\Procfile`:
```
web: node index.js
```

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Authorize Railway** to access your GitHub
6. **Select** `muhammadsudaiskhalid/SmartClassroom`
7. **Add PostgreSQL database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-create the database

8. **Configure Backend Service**:
   - Click on your service
   - Go to "Settings" → "Root Directory"
   - Set to: `server`

9. **Add Environment Variables**:
   Click "Variables" and add:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   SUPER_ADMIN_USERNAME=superadmin
   SUPER_ADMIN_PASSWORD=YourSecurePassword123!
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

10. **Deploy**:
    - Railway will auto-deploy
    - After deployment, run migrations:
      - Go to service → "Settings" → "Deploy"
      - Add custom start command: `npm run build && npm run db:push && npm run db:seed && npm start`

11. **Get your backend URL**:
    - Go to "Settings" → "Networking"
    - Copy the public URL (e.g., `https://smartclassroom-production.up.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import** `muhammadsudaiskhalid/SmartClassroom`
5. **Configure**:
   - Framework Preset: Create React App
   - Root Directory: `./` (root)
   - Build Command: `npm run build`
   - Output Directory: `build`

6. **Environment Variables**:
   Add in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api
   ```

7. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Get your frontend URL (e.g., `https://smartclassroom.vercel.app`)

8. **Update Backend CORS**:
   - Go back to Railway
   - Update `FRONTEND_URL` variable to your Vercel URL
   - Redeploy backend

---

## 📦 Option 2: Render (Alternative)

### Backend on Render

1. **Go to Render**: https://render.com
2. **Sign up/Login** with GitHub
3. **New** → **Web Service**
4. **Connect** your GitHub repo
5. **Configure**:
   ```
   Name: smartclassroom-backend
   Root Directory: server
   Environment: Node
   Build Command: npm install && npm run db:generate
   Start Command: npm run db:push && npm run db:seed && npm start
   ```

6. **Add PostgreSQL**:
   - Dashboard → "New" → "PostgreSQL"
   - Copy the Internal Database URL

7. **Environment Variables**:
   ```
   DATABASE_URL=[paste internal database URL]
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   SUPER_ADMIN_USERNAME=superadmin
   SUPER_ADMIN_PASSWORD=YourSecurePassword123!
   NODE_ENV=production
   PORT=10000
   ```

8. **Deploy** - Render will auto-deploy

### Frontend on Vercel (same as Option 1 Step 3)

---

## 📦 Option 3: Single Server Deployment (VPS)

If you have a VPS (DigitalOcean, AWS EC2, etc.):

### Prerequisites
- Ubuntu 20.04+ server
- Domain name (optional)
- SSH access

### Quick Deployment Script

```bash
# 1. Connect to your server
ssh user@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 4. Create database
sudo -u postgres psql
CREATE DATABASE smartclassroom;
CREATE USER smartuser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE smartclassroom TO smartuser;
\q

# 5. Install PM2 (process manager)
sudo npm install -g pm2

# 6. Clone your repo
git clone https://github.com/muhammadsudaiskhalid/SmartClassroom.git
cd SmartClassroom

# 7. Setup backend
cd server
npm install
cp .env.example .env
nano .env  # Edit with your settings

# 8. Run migrations and seed
npm run db:generate
npm run db:push
npm run db:seed

# 9. Start backend with PM2
pm2 start index.js --name smartclassroom-backend
pm2 save
pm2 startup

# 10. Setup frontend
cd ..
npm install
npm run build

# 11. Install Nginx
sudo apt install nginx -y

# 12. Configure Nginx (see below)

# 13. Install SSL (optional)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

### Nginx Configuration

Create `/etc/nginx/sites-available/smartclassroom`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /home/user/SmartClassroom/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/smartclassroom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Security Checklist Before Deployment

### Backend (.env file)

✅ Change all default credentials:
```env
JWT_SECRET=use-at-least-32-random-characters-here
SUPER_ADMIN_USERNAME=your-unique-admin-name
SUPER_ADMIN_PASSWORD=Strong!Password123#
NODE_ENV=production
```

### Database

✅ Use strong PostgreSQL password
✅ Enable SSL connections (most platforms do this automatically)
✅ Restrict database access to your backend only

### Frontend

✅ Update API URL to production backend
✅ Remove any console.log statements
✅ Enable production build optimizations

---

## 📊 Post-Deployment Checklist

After deploying:

1. ✅ **Test Health Endpoint**
   - Visit: `https://your-backend-url.com/health`
   - Should return: `{"status":"ok"}`

2. ✅ **Test Login**
   - Go to frontend URL
   - Login with demo credentials
   - Verify data loads from backend

3. ✅ **Test University Isolation**
   - Login as Demo Uni student
   - Login as Test Inst student
   - Verify they see different data

4. ✅ **Monitor Logs**
   - Railway: Check deployment logs
   - Render: View logs in dashboard
   - VPS: `pm2 logs`

5. ✅ **Test All Features**
   - Create class (teacher)
   - Join request (student)
   - Admin functions

---

## 🎯 Quick Start Recommendation

**For fastest deployment (5-10 minutes):**

1. **Backend**: Use Railway
   - Auto-detects Node.js
   - Includes PostgreSQL
   - Free tier: 500 hours/month

2. **Frontend**: Use Vercel
   - Perfect for React
   - Auto-deploys on git push
   - Free tier: Unlimited

**Total Cost: $0/month** (on free tiers)

---

## 📝 Environment Variables Summary

### Backend (Railway/Render)
```
DATABASE_URL=<auto-provided-by-platform>
JWT_SECRET=<32-character-random-string>
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=<strong-password>
NODE_ENV=production
PORT=5000
FRONTEND_URL=<your-vercel-url>
```

### Frontend (Vercel)
```
REACT_APP_API_URL=<your-railway-backend-url>/api
```

---

## 🚨 Common Issues & Solutions

### "Database connection failed"
- Check DATABASE_URL is correct
- Ensure database is running
- Verify firewall allows connection

### "CORS error"
- Update FRONTEND_URL in backend
- Redeploy backend after changing

### "Module not found"
- Run `npm install` in correct directory
- Check `package.json` has all dependencies

### "Prisma Client not generated"
- Add to build command: `npm run db:generate`
- Or add to start command before `node index.js`

---

## 📞 Need Help?

**Railway Docs**: https://docs.railway.app
**Render Docs**: https://render.com/docs
**Vercel Docs**: https://vercel.com/docs

---

## 🎉 Your Deployment Journey

1. ✅ Local development (DONE - you're here!)
2. ⏳ Deploy backend to Railway
3. ⏳ Deploy frontend to Vercel
4. ⏳ Test production deployment
5. ✅ Share with users!

---

**Ready to deploy? Start with Railway - it's the easiest!** 🚀

**Railway URL**: https://railway.app (Click "Start a New Project")
