# 🚀 Quick Setup Guide - Your PostgreSQL is Ready!

## ✅ What's Done

✓ PostgreSQL installed (port 5433)
✓ Backend dependencies installed
✓ Prisma client generated
✓ .env file created

---

## 📝 Next Steps (Follow in Order)

### Step 1: Update Database Password

Open the file: `d:\SmartClassroom\server\.env`

Find this line:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5433/smartclassroom?schema=public"
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

**Example:**
If your password is `admin123`, change it to:
```
DATABASE_URL="postgresql://postgres:admin123@localhost:5433/smartclassroom?schema=public"
```

Save the file.

---

### Step 2: Create Database

Open **Command Prompt** or **PowerShell** and run:

```cmd
psql -U postgres -p 5433
```

When prompted for password, enter your PostgreSQL password.

Then in the PostgreSQL prompt, run:

```sql
CREATE DATABASE smartclassroom;
\q
```

---

### Step 3: Run Migrations

In the terminal (from `d:\SmartClassroom\server`), run:

```cmd
npm run db:migrate
```

When prompted for a migration name, just press Enter (or type "init").

This will create all database tables.

---

### Step 4: Seed Demo Data

```cmd
npm run db:seed
```

This adds demo universities, users, and classes.

---

### Step 5: Start Backend Server

```cmd
npm run dev
```

✅ Backend will run on: **http://localhost:5000**

Test it by opening: **http://localhost:5000/health**

You should see: `{"status":"ok","timestamp":"..."}`

---

## 🎓 Demo Credentials (After Seeding)

### Demo University
- **Admin:** ADMIN001 / Admin@123
- **Teacher:** DU-T001 / Teacher@123
- **Student:** DU-S001 / Student@123

### Test Institute
- **Admin:** ADMIN002 / Admin@123
- **Teacher:** TI-T101 / Teacher@123
- **Student:** TI-S101 / Student@123

---

## 🔧 Optional: View Database Visually

```cmd
npm run db:studio
```

This opens Prisma Studio at **http://localhost:5555** where you can see all your data!

---

## ❓ Troubleshooting

### "Database does not exist"
Run this in PostgreSQL:
```sql
CREATE DATABASE smartclassroom;
```

### "Password authentication failed"
Check your password in `.env` file matches your PostgreSQL password.

### "Port 5433 already in use"
Your PostgreSQL is already running - this is good! Just continue with migrations.

### "Connection refused"
Make sure PostgreSQL service is running:
- Windows: Services → postgresql-x64-XX → Start

---

## ✅ Quick Test

After setup, test the API:

**PowerShell:**
```powershell
$body = @{
    registrationNumber = "DU-S001"
    password = "Student@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

Should return a token and user data!

---

## 🎯 Summary

1. ✅ Update `.env` with your PostgreSQL password
2. ✅ Create database: `CREATE DATABASE smartclassroom;`
3. ✅ Run migrations: `npm run db:migrate`
4. ✅ Seed data: `npm run db:seed`
5. ✅ Start server: `npm run dev`
6. ✅ Test: http://localhost:5000/health

**That's it! Your backend will be running!** 🚀

---

Need help? All commands are in this file - just copy and paste!
