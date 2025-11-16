# 🚀 Quick Start Guide

## What You Get

A **production-ready backend** with:

✅ **Multi-Tenant Architecture** - Each university has isolated data  
✅ **PostgreSQL Database** - Enterprise-grade storage  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcrypt with 10 salt rounds  
✅ **Rate Limiting** - Brute force protection  
✅ **RESTful API** - Clean, documented endpoints  

## Prerequisites

Before starting, install:

1. **Node.js 16+**: [Download here](https://nodejs.org/)
2. **PostgreSQL 12+**: [Download here](https://www.postgresql.org/download/)
3. **Git**: [Download here](https://git-scm.com/)

## Installation (Windows)

### Step 1: Install PostgreSQL

1. Download and install PostgreSQL
2. Remember the password you set for `postgres` user
3. PostgreSQL should run on default port `5432`

### Step 2: Create Database

Open **Command Prompt** and run:

```cmd
psql -U postgres
```

Enter your PostgreSQL password, then:

```sql
CREATE DATABASE smartclassroom;
\q
```

### Step 3: Setup Backend

```cmd
cd d:\SmartClassroom\server
setup.bat
```

The setup script will:
- Install all dependencies
- Create `.env` file
- Generate Prisma client
- Run database migrations
- Seed demo data

### Step 4: Configure Environment

Edit `server\.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smartclassroom"
JWT_SECRET="change-this-to-long-random-string-in-production"
SUPER_ADMIN_USERNAME="superadmin"
SUPER_ADMIN_PASSWORD="SuperAdmin@2024!ChangeThis"
```

**Replace**:
- `YOUR_PASSWORD` with your PostgreSQL password
- JWT_SECRET with random string (at least 32 characters)
- Super admin credentials

### Step 5: Start Server

```cmd
cd d:\SmartClassroom\server
npm run dev
```

Server runs on: **http://localhost:5000**

## Installation (Manual Setup)

If the setup script doesn't work:

```cmd
cd d:\SmartClassroom\server

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file (see Step 4 above)
notepad .env

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed demo data (optional)
npm run db:seed

# Start server
npm run dev
```

## Verify Installation

### Test 1: Health Check

Open browser: http://localhost:5000/health

Should show:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Login API

Using PowerShell:

```powershell
$body = @{
    registrationNumber = "DU-S001"
    password = "Student@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

Should return token and user data.

### Test 3: Prisma Studio

```cmd
npm run db:studio
```

Opens GUI at http://localhost:5555 to view database.

## Demo Credentials

After seeding, you can login with:

### Demo University
- **Admin**: `ADMIN001` / `Admin@123`
- **Teacher**: `DU-T001` / `Teacher@123`
- **Student**: `DU-S001` / `Student@123`

### Test Institute
- **Admin**: `ADMIN002` / `Admin@123`
- **Teacher**: `TI-T101` / `Teacher@123`
- **Student**: `TI-S101` / `Student@123`

## Connect Frontend

### Step 1: Install Axios

```cmd
cd d:\SmartClassroom
npm install axios
```

### Step 2: Create Environment File

Create `d:\SmartClassroom\.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Copy API Services

Copy these files to your React app:

From `BACKEND_INTEGRATION.md`:
- `src/services/api.service.js`
- Updated `src/services/auth.service.js`
- Updated `src/services/admin.service.js`
- Updated `src/services/class.service.js`

### Step 4: Test Full Stack

1. Start backend: `cd server && npm run dev`
2. Start frontend: `cd d:\SmartClassroom && npm start`
3. Open: http://localhost:3000
4. Login with demo credentials
5. Verify data isolation between universities

## Database Management

### View Database

```cmd
npm run db:studio
```

### Reset Database

```cmd
npx prisma migrate reset
```

⚠️ This deletes all data! Use only in development.

### Create Migration

After schema changes:

```cmd
npm run db:migrate
```

### Seed Again

```cmd
npm run db:seed
```

## Troubleshooting

### "Connection refused" error

**Problem**: PostgreSQL not running

**Solution**:
1. Open Services (Win + R → `services.msc`)
2. Find "postgresql-x64-XX"
3. Right-click → Start

### "Database does not exist"

**Solution**:
```cmd
psql -U postgres
CREATE DATABASE smartclassroom;
\q
```

### "Prisma Client not generated"

**Solution**:
```cmd
npm run db:generate
```

### Port 5000 already in use

**Solution**: Change PORT in `.env`:
```env
PORT=5001
```

### Migration failed

**Solution**:
```cmd
npx prisma migrate reset
npm run db:migrate
```

## Next Steps

1. ✅ Backend running
2. ✅ Database connected
3. ✅ Demo data loaded
4. 📖 Read `BACKEND_INTEGRATION.md` for frontend setup
5. 📖 Read `README.md` for API documentation
6. 🚀 Deploy to production (see DEPLOYMENT.md)

## Production Deployment

For production deployment:

1. Use managed PostgreSQL (AWS RDS, Heroku Postgres, Supabase)
2. Change all credentials in `.env`
3. Set `NODE_ENV=production`
4. Use process manager (PM2)
5. Enable HTTPS
6. Set up monitoring

See `README.md` for detailed deployment instructions.

## Support

- **Backend API Docs**: `server/README.md`
- **Integration Guide**: `BACKEND_INTEGRATION.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Security Guide**: `SECURITY.md`

---

**Need Help?**

Check the logs:
```cmd
# Backend logs (in terminal running server)
# Frontend logs (browser console)
```

---

**🎉 You're all set! Your multi-tenant classroom system is ready!**
