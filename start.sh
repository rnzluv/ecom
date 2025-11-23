#!/bin/bash
# Aurevra Jewelry E-Commerce - Start Script
# This script starts both backend and frontend servers

echo ""
echo "================================"
echo "  Aurevra Jewelry - Start Script"
echo "================================"
echo ""

# Check if required directories exist
if [ ! -d "backend" ]; then
    echo "ERROR: backend folder not found!"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo "ERROR: frontend folder not found!"
    exit 1
fi

echo "[1/4] Starting Backend Server..."
echo "================================"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "[2/4] Waiting for backend to start..."
sleep 5

echo "[3/4] Starting Frontend Server..."
echo "================================"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================"
echo "  Servers Starting..."
echo "================================"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
