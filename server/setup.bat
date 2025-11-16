@echo off
echo ========================================
echo Smart Classroom Backend Setup
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [2/5] Checking environment file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file and configure:
    echo    - DATABASE_URL (PostgreSQL connection string^)
    echo    - JWT_SECRET (change to random string^)
    echo    - SUPER_ADMIN credentials (change defaults^)
    echo.
    echo Press any key after configuring .env file...
    pause >nul
) else (
    echo ✓ .env file exists
)
echo.

echo [3/5] Generating Prisma Client...
call npm run db:generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    echo Make sure DATABASE_URL is configured correctly in .env
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

echo [4/5] Running database migrations...
call npm run db:migrate
if %errorlevel% neq 0 (
    echo ERROR: Failed to run migrations
    echo Make sure PostgreSQL is running and DATABASE_URL is correct
    pause
    exit /b 1
)
echo ✓ Migrations completed
echo.

echo [5/5] Seeding database with demo data...
call npm run db:seed
if %errorlevel% neq 0 (
    echo WARNING: Failed to seed database
    echo You can skip this and add data manually
) else (
    echo ✓ Database seeded
)
echo.

echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo Demo Credentials:
echo.
echo Demo University:
echo   Admin: ADMIN001 / Admin@123
echo   Teacher: DU-T001 / Teacher@123
echo   Student: DU-S001 / Student@123
echo.
echo Test Institute:
echo   Admin: ADMIN002 / Admin@123
echo   Teacher: TI-T101 / Teacher@123
echo   Student: TI-S101 / Student@123
echo.
echo To start the server:
echo   npm run dev    (development with auto-reload^)
echo   npm start      (production^)
echo.
echo Server will run on: http://localhost:5000
echo.
pause
