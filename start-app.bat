@echo off
echo Starting Torodo Farms Application...
echo.

echo 1. Starting Backend Server...
cd server
start "Torodo Farms Server" cmd /k "npm start"
cd ..

echo 2. Waiting for server to start...
timeout /t 5 /nobreak > nul

echo 3. Starting Admin Dashboard...
cd client
start "Torodo Farms Admin" cmd /k "npm start"
cd ..

echo.
echo Applications are starting...
echo - Backend Server: http://localhost:5000
echo - Admin Dashboard: http://localhost:3000
echo.
echo Press any key to exit this script...
pause > nul 