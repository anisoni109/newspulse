@echo off
setlocal enabledelayedexpansion

echo ============================================
echo    Starting NewsPulse Services...
echo ============================================
echo.

REM Kill any existing Node processes to avoid port conflicts
echo Killing existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend Server on port 3000 (invisible)
echo [1/4] Starting backend server on port 3000...
start "NewsPulse Server" /min cmd /c "cd /d "%~dp0server" && node server.js"
timeout /t 3 /nobreak >nul

REM Start NewsPulse Vite App on port 5173 (invisible)  
echo [2/4] Starting NewsPulse App on port 5173...
start "NewsPulse App" /min cmd /c "cd /d "%~dp0" && npm run dev"
timeout /t 8 /nobreak >nul

REM Start MonitorDashboard Vite on port 3002 (invisible)
echo [3/4] Starting Monitor Dashboard on port 3002...
start "MonitorDashboard" /min cmd /c "cd /d \"C:/Users/aniso/MonitorDashboard\" && npx vite --port 3002"
timeout /t 8 /nobreak >nul

echo [4/4] Opening browser windows...
timeout /t 2 /nobreak >nul
start "" http://localhost:5173/newspulse/
timeout /t 1 /nobreak >nul
start "" http://localhost:3002/

echo.
echo ============================================
echo    NewsPulse Services Started!
echo ============================================
echo.
echo   Server API:       http://localhost:3000
echo   NewsPulse App:    http://localhost:5173/newspulse/
echo   Monitor Dashboard: http://localhost:3002
echo.
echo   Admin login: admin / admin123
echo ============================================
pause