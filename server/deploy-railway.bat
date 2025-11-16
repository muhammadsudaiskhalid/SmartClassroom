@echo off
echo ========================================
echo Railway CLI Deployment Script
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/5] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed
    pause
    exit /b 1
)

echo.
echo [3/5] Deploying to Railway...
call railway up
if errorlevel 1 (
    echo ERROR: Railway deployment failed
    pause
    exit /b 1
)

echo.
echo [4/5] Checking deployment status...
timeout /t 5 /nobreak >nul
call railway status

echo.
echo [5/5] Opening Railway dashboard...
start https://railway.app/project/6bc186ae-f345-4404-a5d1-b7a1da8bb328/service/5f98448f-63d0-4fa6-9406-60519e1afb5f

echo.
echo ========================================
echo Deployment complete!
echo Your backend URL: https://smartclassroom-production.up.railway.app
echo.
echo Next steps:
echo 1. Check Railway dashboard for deployment status
echo 2. Make sure DATABASE_URL is set to: ${{Postgres.DATABASE_URL}}
echo 3. Test health endpoint: https://smartclassroom-production.up.railway.app/health
echo ========================================
echo.
pause
