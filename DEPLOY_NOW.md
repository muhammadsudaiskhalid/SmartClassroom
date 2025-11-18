# 🚀 Quick Deployment Commands

## Step 1: Commit and Push to GitHub

```bash
cd d:\SmartClassroom
git add .
git commit -m "Production ready: MongoDB migration complete with full API integration"
git push origin main
```

---

## Step 2: Vercel Backend Environment Variables

Copy these EXACTLY into Vercel Dashboard → Backend Project → Settings → Environment Variables:

### Variable 1: MONGODB_URI
```
mongodb+srv://msudaiskhalidai_db_user:bjWplPTjnTylgofP@cluster0.pobn6iu.mongodb.net/smartclassroom?retryWrites=true&w=majority&appName=Cluster0
```

### Variable 2: JWT_SECRET
```
SmartClassroom-JWT-Secret-2025-Change-This-In-Production-Use-Long-Random-String
```

### Variable 3: SUPER_ADMIN_USERNAME
```
superadmin
```

### Variable 4: SUPER_ADMIN_PASSWORD
```
superadmin@iamsudaiskhalid
```

### Variable 5: NODE_ENV
```
production
```

### Variable 6: FRONTEND_URL
```
*
```
(Update this to your actual frontend URL after frontend deployment)

---

## Step 3: After Backend Deployment

### Test Backend Health
Replace `YOUR-BACKEND-URL` with your actual Vercel backend URL:

```bash
curl https://YOUR-BACKEND-URL.vercel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Smart Classroom API is running",
  "timestamp": "2025-11-18T..."
}
```

---

## Step 4: Vercel Frontend Environment Variable

Copy this EXACTLY into Vercel Dashboard → Frontend Project → Settings → Environment Variables:

### Variable 1: REACT_APP_API_URL
```
https://YOUR-BACKEND-URL.vercel.app
```

⚠️ **IMPORTANT:** Replace `YOUR-BACKEND-URL` with your actual backend URL from Step 3!

---

## Step 5: Update Backend CORS

After frontend is deployed:

1. Go to Vercel → Backend Project → Settings → Environment Variables
2. Edit `FRONTEND_URL`
3. Change from `*` to your actual frontend URL:
```
https://YOUR-FRONTEND-URL.vercel.app
```
4. Save and Redeploy

---

## Step 6: Test Production Application

### Test Student Login
```
URL: https://YOUR-FRONTEND-URL.vercel.app/signin
Registration: DU-S001
Password: password123
```

### Test Teacher Login
```
URL: https://YOUR-FRONTEND-URL.vercel.app/signin
Registration: DU-T001
Password: password123
```

### Test Admin Login
```
URL: https://YOUR-FRONTEND-URL.vercel.app/admin
Registration: ADMIN001
Password: password123
```

---

## Step 7: Security - Change Passwords (CRITICAL!)

### Generate New JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Then:
1. Update JWT_SECRET in Vercel backend environment variables
2. Redeploy backend
3. Login to admin panel
4. Change all user passwords

---

## Vercel Project Configuration

### Backend Project Settings:
```
Project Name:     smartclassroom-backend
Framework:        Other
Root Directory:   server
Build Command:    (leave empty)
Output Directory: (leave empty)
Install Command:  npm install
Node Version:     18.x (automatic)
```

### Frontend Project Settings:
```
Project Name:     smartclassroom-app
Framework:        Create React App
Root Directory:   .
Build Command:    npm run build
Output Directory: build
Install Command:  npm install
Node Version:     18.x (automatic)
```

---

## Quick Reference URLs

### After Deployment, update these:

```
Backend API:      https://smartclassroom-backend-xxx.vercel.app
Frontend App:     https://smartclassroom-app-xxx.vercel.app
Health Check:     https://smartclassroom-backend-xxx.vercel.app/health
Admin Panel:      https://smartclassroom-app-xxx.vercel.app/admin
MongoDB Atlas:    https://cloud.mongodb.com/v2/691c0141bee0ce7c1a5a520b
```

---

## Troubleshooting Commands

### Check Backend Logs (PowerShell):
```powershell
# Test health
Invoke-RestMethod -Uri "https://YOUR-BACKEND-URL.vercel.app/health"

# Test login
$body = @{registrationNumber='DU-S001';password='password123'} | ConvertTo-Json
Invoke-RestMethod -Uri "https://YOUR-BACKEND-URL.vercel.app/api/auth/login" -Method POST -ContentType "application/json" -Body $body
```

### Check MongoDB Connection:
```
1. Go to MongoDB Atlas
2. Click "Metrics" → "Performance"
3. Verify connections are active
```

### Check CORS Issues:
```
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for CORS errors
4. Verify FRONTEND_URL is set correctly in backend
```

---

## Common Issues & Solutions

### Issue: "Failed to fetch" on login
**Solution:**
- Check `REACT_APP_API_URL` in frontend environment variables
- Verify backend is deployed and health endpoint works
- Check browser console for specific error

### Issue: CORS error
**Solution:**
- Update `FRONTEND_URL` in backend environment variables
- Remove trailing slash from URLs
- Redeploy backend

### Issue: "MongoDB connection failed"
**Solution:**
- Check `MONGODB_URI` is correct (no extra spaces)
- Verify MongoDB cluster is running
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0 for Vercel)

### Issue: "Invalid credentials" with correct password
**Solution:**
- Check if database is seeded (run seed script)
- Verify user exists in MongoDB Atlas → Browse Collections
- Check password in database is hashed

---

## Post-Deployment Checklist

```
□ Backend deployed successfully
□ Frontend deployed successfully
□ Health endpoint returns OK
□ Student login works
□ Teacher login works
□ Admin login works
□ Classes are visible
□ Minutes can be added
□ CORS is configured
□ All passwords changed
□ JWT secret rotated
□ MongoDB backup enabled
□ Monitoring configured
□ Documentation updated
```

---

## 🎉 Deployment Complete!

Your application is now live in production!

**Share your app:**
```
🌐 Frontend: https://YOUR-FRONTEND-URL.vercel.app
📱 Admin:    https://YOUR-FRONTEND-URL.vercel.app/admin
📊 API:      https://YOUR-BACKEND-URL.vercel.app
```

**Demo Credentials:**
- Student: DU-S001 / password123
- Teacher: DU-T001 / password123
- Admin: ADMIN001 / password123

⚠️ **Remember to change all passwords immediately!**

---

**Need help?** Check `PRODUCTION_DEPLOYMENT.md` for detailed instructions.
