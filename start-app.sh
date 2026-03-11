#!/bin/bash

echo "Starting Torodo Farms Application..."
echo

echo "1. Starting Backend Server..."
cd server
gnome-terminal --title="Torodo Farms Server" -- bash -c "npm start; exec bash" &
cd ..

echo "2. Waiting for server to start..."
sleep 5

echo "3. Starting Admin Dashboard..."
cd client
gnome-terminal --title="Torodo Farms Admin" -- bash -c "npm start; exec bash" &
cd ..

echo
echo "Applications are starting..."
echo "- Backend Server: http://localhost:5000"
echo "- Admin Dashboard: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all processes..."
wait 