@echo off
echo Starting NewsPulse Services...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Starting Server...
start cmd /c "cd /d "%~dp0server" && node server.js"
timeout /t 3 /nobreak >nul
echo Starting App...
start cmd /c "cd /d "%~dp0" && npm run dev"
timeout /t 2 /nobreak >nul
echo.
echo All services started!
echo Server: http://localhost:3000
echo App: http://localhost:5173/newspulse/
echo Dashboard: http://localhost:3002/
echo.
echo Admin login: admin / admin123
pause
