#!/bin/bash
# =============================================================================
# NEXUS AI — Development Environment Setup Script
# =============================================================================
# This script installs all dependencies for both frontend and backend.
# Run this ONCE when first cloning the repository.
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
# =============================================================================

set -e

echo "========================================================"
echo "  NEXUS AI — Enterprise Knowledge OS Setup"
echo "========================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# --- Backend Setup ---
echo -e "${YELLOW}[1/2] Setting up Backend (Python venv + dependencies)...${NC}"

cd backend

# Create Python virtual environment
if [ ! -d "venv" ]; then
    python -m venv venv
    echo -e "${GREEN}  ✓ Created Python virtual environment${NC}"
else
    echo -e "${GREEN}  ✓ Python virtual environment already exists${NC}"
fi

# Activate venv and install dependencies
source venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt -q
deactivate

echo -e "${GREEN}  ✓ Backend dependencies installed${NC}"

cd ..

# --- Frontend Setup ---
echo -e "${YELLOW}[2/2] Setting up Frontend (npm dependencies)...${NC}"

cd frontend
npm install --legacy-peer-deps
cd ..

echo -e "${GREEN}  ✓ Frontend dependencies installed${NC}"

echo ""
echo "========================================================"
echo -e "${GREEN}  Setup Complete!${NC}"
echo "========================================================"
echo ""
echo "To start the project, run:"
echo "  ./start.sh"
echo ""
echo "Or start individually:"
echo "  Backend:  cd backend && source venv/bin/activate && python app/main.py"
echo "  Frontend: cd frontend && npm run dev"
echo ""
