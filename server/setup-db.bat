@echo off
echo ========================================
echo Smart Classroom - Database Setup
echo ========================================
echo.
echo This script will:
echo 1. Create the database
echo 2. Run migrations
echo 3. Seed demo data
echo.
echo ⚠️  IMPORTANT: You need to know your PostgreSQL password
echo.
set /p PGPASSWORD="Enter your PostgreSQL password: "
echo.

echo [1/3] Creating database...
psql -U postgres -p 5433 -c "CREATE DATABASE smartclassroom;" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Database created successfully
) else (
    echo ℹ Database might already exist, continuing...
)
echo.

echo [2/3] Running migrations...
call npm run db:migrate
if %errorlevel% neq 0 (
    echo ❌ Migration failed. Please check your DATABASE_URL in .env file
    pause
    exit /b 1
)
echo ✓ Migrations completed
echo.

echo [3/3] Seeding demo data...
call npm run db:seed
if %errorlevel% neq 0 (
    echo ⚠️  Seeding failed, but database is ready
) else (
    echo ✓ Demo data seeded
)
echo.

echo ========================================
echo ✓ Database Setup Complete!
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
echo   npm run dev
echo.
pause
