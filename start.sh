#!/bin/bash
# =============================================================================
# NEXUS AI — Development Server Start Script
# =============================================================================
# Starts both the FastAPI backend and Next.js frontend development servers.
#
# Usage:
#   chmod +x start.sh
#   ./start.sh
#
# To stop both servers: Ctrl+C
# =============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo "========================================================"
echo "  NEXUS AI — Starting Development Servers"
echo "========================================================"
echo ""

# Check if setup has been run
if [ ! -d "backend/venv" ]; then
    echo -e "${YELLOW}⚠ Virtual environment not found. Run ./setup.sh first.${NC}"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠ Frontend dependencies not found. Run ./setup.sh first.${NC}"
    exit 1
fi

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}Servers stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# --- Start Backend ---
echo -e "${YELLOW}[1/2] Starting FastAPI Backend...${NC}"
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}  ✓ Backend starting on http://localhost:8000${NC}"

# Wait for backend to be ready
echo -e "${YELLOW}  Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s -o /dev/null http://localhost:8000/ 2>/dev/null; then
        echo -e "${GREEN}  ✓ Backend is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}  ⚠ Backend not responding yet, continuing...${NC}"
    fi
    sleep 1
done

# --- Start Frontend ---
echo -e "${YELLOW}[2/2] Starting Next.js Frontend...${NC}"
cd frontend
npx next dev --port 3000 &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}  ✓ Frontend starting on http://localhost:3000${NC}"

echo ""
echo "========================================================"
echo -e "${GREEN}  Both servers are starting up!${NC}"
echo "========================================================"
echo ""
echo -e "${CYAN}  Frontend:${NC}  http://localhost:3000"
echo -e "${CYAN}  Backend:${NC}   http://localhost:8000"
echo -e "${CYAN}  API Docs:${NC}  http://localhost:8000/api/v1/openapi.json"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Wait for both processes
wait
