# 🚀 Deploy to Vercel - Step by Step

## ✅ Step 1: Code Pushed to GitHub ✓
Your code is now on GitHub: https://github.com/muhammadsudaiskhalid/SmartClassroom

---

## 📦 Step 2: Deploy Backend API

### A. Go to Vercel and Create New Project
1. Open: https://vercel.com/new
2. Login with GitHub if needed
3. Click **"Import Git Repository"**
4. Select: **muhammadsudaiskhalid/SmartClassroom**
5. Click **"Import"**

### B. Configure Backend Project
**Project Settings:**
- **Project Name:** `smartclassroom-backend` (or any name you like)
- **Framework Preset:** Other
- **Root Directory:** Click **"Edit"** → Select **`server`** folder ← IMPORTANT!
- **Build Command:** Leave empty
- **Output Directory:** Leave empty
- **Install Command:** `npm install`

### C. Add Environment Variables
Click **"Environment Variables"** tab and add these 6 variables:

| Variable Name | Value |
|---------------|-------|
| `MONGODB_URI` | `mongodb+srv://msudaiskhalidai_db_user:bjWplPTjnTylgofP@cluster0.pobn6iu.mongodb.net/smartclassroom?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `SmartClassroom-JWT-Secret-2025-Change-This-In-Production-Use-Long-Random-String` |
| `SUPER_ADMIN_USERNAME` | `superadmin` |
| `SUPER_ADMIN_PASSWORD` | `superadmin@iamsudaiskhalid` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `*` |

**Note:** We'll update `FRONTEND_URL` after deploying the frontend.

### D. Deploy Backend
1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment
3. Once deployed, **COPY YOUR BACKEND URL**: `https://your-backend-name.vercel.app`
4. **Test it:** Visit `https://your-backend-name.vercel.app/health`
   - Should see: `{"status":"ok","message":"Smart Classroom API is running"}`

**✅ Backend Deployed!** Write down your URL: _______________________________

---

## 🎨 Step 3: Deploy Frontend

### A. Create Another Vercel Project
1. Go to: https://vercel.com/new (again)
2. Click **"Import Git Repository"**
3. Select: **muhammadsudaiskhalid/SmartClassroom** (same repo)
4. Click **"Import"**

### B. Configure Frontend Project
**Project Settings:**
- **Project Name:** `smartclassroom-app` (or any name you like)
- **Framework Preset:** Create React App
- **Root Directory:** Leave as **root** (don't change this!)
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### C. Add Environment Variable
Click **"Environment Variables"** and add just 1 variable:

| Variable Name | Value |
|---------------|-------|
| `REACT_APP_API_URL` | `https://your-backend-name.vercel.app` ← Use YOUR backend URL from Step 2! |

⚠️ **IMPORTANT:** Replace `your-backend-name` with the actual backend URL you got in Step 2!

### D. Deploy Frontend
1. Click **"Deploy"** button
2. Wait 3-5 minutes for build and deployment
3. Once deployed, **COPY YOUR FRONTEND URL**: `https://your-frontend-name.vercel.app`

**✅ Frontend Deployed!** Write down your URL: _______________________________

---

## 🔄 Step 4: Update Backend CORS

Now we need to tell the backend which frontend URL is allowed:

1. Go back to your **backend project** in Vercel
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Find `FRONTEND_URL` and click **"Edit"**
5. Change from `*` to your actual frontend URL: `https://your-frontend-name.vercel.app`
6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click **"Redeploy"** on the latest deployment

**✅ CORS Updated!**

---

## 🧪 Step 5: Test Your Production App

### Test Backend:
Visit: `https://your-backend-name.vercel.app/health`

**Expected:**
```json
{
  "status": "ok",
  "message": "Smart Classroom API is running",
  "timestamp": "..."
}
```

### Test Frontend:
1. Visit: `https://your-frontend-name.vercel.app`
2. Click **"Sign In"**
3. Login with:
   - **Registration:** `DU-S001`
   - **Password:** `password123`
4. Should see student dashboard!

### Test All Roles:

**Student:**
- Registration: `DU-S001`
- Password: `password123`

**Teacher:**
- Registration: `DU-T001`
- Password: `password123`

**Admin:**
- Go to: `https://your-frontend-name.vercel.app/admin`
- Registration: `ADMIN001`
- Password: `password123`

---

## ✅ Deployment Complete Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend health endpoint works
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads successfully
- [ ] CORS updated with frontend URL
- [ ] Backend redeployed after CORS update
- [ ] Student login works
- [ ] Teacher login works
- [ ] Admin login works
- [ ] Can view classes
- [ ] Can view students (teacher)
- [ ] Can view minutes (student)

---

## 🔒 IMPORTANT: Change Default Passwords!

After testing, immediately:

1. Login as admin
2. Go to User Management
3. Change passwords for all demo users
4. Update admin password in MongoDB or create new admin

---

## 📝 Your Production URLs

Write them down here:

```
Backend:  https://________________________________.vercel.app
Frontend: https://________________________________.vercel.app
Admin:    https://________________________________.vercel.app/admin
```

---

## 🎉 You're Live!

Your Smart Classroom is now deployed and accessible worldwide!

**Next Steps:**
1. ✅ Test all features
2. ✅ Change all passwords
3. ✅ Share the frontend URL with users
4. ✅ Configure custom domain (optional)
5. ✅ Set up monitoring

---

## 🆘 Troubleshooting

### Issue: "Network Error" on login
**Fix:** Check that `REACT_APP_API_URL` in frontend matches your backend URL

### Issue: Backend shows 404
**Fix:** Make sure Root Directory is set to `server` in backend project

### Issue: Frontend blank page
**Fix:** Check browser console, verify API URL, rebuild frontend

### Issue: CORS error
**Fix:** Update `FRONTEND_URL` in backend, redeploy backend

---

## 📞 Need Help?

Check the detailed guide: `PRODUCTION_DEPLOYMENT.md`
