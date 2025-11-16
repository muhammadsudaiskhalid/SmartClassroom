# 🎯 Railway Deployment - Environment Variables

Copy these values when setting up Railway:

## Required Environment Variables

### 1. DATABASE_URL
```
${{Postgres.DATABASE_URL}}
```
**Note**: Type exactly as shown - Railway will automatically replace this with your PostgreSQL connection string

---

### 2. JWT_SECRET
```
77896c86fd8a12c0941cbc745f2cd1850987ac7fdfb1783dd6edf25ccc0f7b7a
```
**Note**: This is a cryptographically secure random secret generated for your deployment

---

### 3. SUPER_ADMIN_USERNAME
```
superadmin
```
**Note**: You can change this to any username you prefer

---

### 4. SUPER_ADMIN_PASSWORD
```
SuperAdmin@SmartClass2025!
```
**⚠️ IMPORTANT**: Change this to your own strong password before deployment!

**Password Requirements:**
- At least 8 characters
- Include uppercase and lowercase letters
- Include numbers
- Include special characters (@, !, #, $, etc.)

---

### 5. NODE_ENV
```
production
```
**Note**: Leave as is

---

### 6. PORT
```
5000
```
**Note**: Leave as is (Railway may override this automatically)

---

### 7. FRONTEND_URL
```
https://smartclassroom.vercel.app
```
**⚠️ UPDATE THIS**: Replace with your actual Vercel URL after deploying frontend

---

## Quick Copy-Paste Format

For quick setup, copy each line:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=77896c86fd8a12c0941cbc745f2cd1850987ac7fdfb1783dd6edf25ccc0f7b7a
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=SuperAdmin@SmartClass2025!
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://smartclassroom.vercel.app
```

**Remember to**:
1. Change `SUPER_ADMIN_PASSWORD` to your own password
2. Update `FRONTEND_URL` after deploying to Vercel

---

## How to Add in Railway

1. Click on your backend service
2. Go to **Variables** tab
3. Click **New Variable**
4. Enter **Name** (e.g., `DATABASE_URL`)
5. Enter **Value** (e.g., `${{Postgres.DATABASE_URL}}`)
6. Click **Add**
7. Repeat for all 7 variables
8. Railway will auto-deploy after you save

---

## Verification

After adding all variables, you should see 7 environment variables in Railway:
- ✅ DATABASE_URL
- ✅ JWT_SECRET
- ✅ SUPER_ADMIN_USERNAME
- ✅ SUPER_ADMIN_PASSWORD
- ✅ NODE_ENV
- ✅ PORT
- ✅ FRONTEND_URL

---

**Next Step**: Wait for Railway to deploy, then copy your backend URL for Vercel setup!
