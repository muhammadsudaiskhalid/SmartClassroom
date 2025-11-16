@echo off
echo ========================================
echo Starting Smart Classroom Backend Server
echo ========================================
echo.
echo Server will run on: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
node index.js
