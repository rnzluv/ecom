@echo off
REM Aurevra Jewelry E-Commerce - Start Script
REM This script starts both backend and frontend servers

echo.
echo ================================
echo  Aurevra Jewelry - Start Script
echo ================================
echo.

REM Check if required directories exist
if not exist "backend" (
    echo ERROR: backend folder not found!
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ERROR: frontend folder not found!
    pause
    exit /b 1
)

echo [1/4] Starting Backend Server...
echo ================================
start cmd /k "cd backend && npm run dev"
timeout /t 5

echo [2/4] Backend should now be running on http://localhost:5000
echo.
echo [3/4] Starting Frontend Server...
echo ================================
start cmd /k "cd frontend && npm start"

echo.
echo ================================
echo  Servers Starting...
echo ================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
