#!/bin/bash
# Start both frontend and backend servers for local development

echo "🚀 Starting UX Website Auditor - Local Development"
echo "================================================"
echo ""

# Check if servers are already running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Backend server already running on port 3000"
else
    echo "Starting backend server on port 3000..."
    cd api && node server.js > /tmp/backend-server.log 2>&1 &
    BACKEND_PID=$!
    echo "✅ Backend started (PID: $BACKEND_PID)"
fi

if lsof -ti:5173 > /dev/null 2>&1; then
    echo "⚠️  Frontend server already running on port 5173"
else
    echo "Starting frontend server on port 5173..."
    npm run dev > /tmp/vite-dev.log 2>&1 &
    FRONTEND_PID=$!
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
fi

echo ""
echo "================================================"
echo "🎉 Servers are running!"
echo ""
echo "Frontend: http://localhost:5173/mp2/"
echo "Backend:  http://localhost:3000/api"
echo ""
echo "📋 Logs:"
echo "  Backend:  tail -f /tmp/backend-server.log"
echo "  Frontend: tail -f /tmp/vite-dev.log"
echo ""
echo "To stop servers:"
echo "  pkill -f 'node server.js'"
echo "  pkill -f 'vite'"
echo "================================================"
