@echo off
REM ============================================================================
REM NEXUS AI - Development Environment Setup Script (Windows)
REM ============================================================================
REM This script installs all dependencies for both frontend and backend.
REM Run this ONCE when first cloning the repository.
REM
REM Usage:
REM   setup.bat
REM ============================================================================

echo ========================================================
echo   NEXUS AI - Enterprise Knowledge OS Setup
echo ========================================================
echo.

REM --- Backend Setup ---
echo [1/2] Setting up Backend (Python venv + dependencies)...

cd backend

REM Create Python virtual environment
if not exist "venv" (
    python -m venv venv
    echo   [OK] Created Python virtual environment
) else (
    echo   [OK] Python virtual environment already exists
)

REM Activate venv and install dependencies
call venv\Scripts\activate.bat
python -m pip install --upgrade pip -q
pip install -r requirements.txt -q
call deactivate

echo   [OK] Backend dependencies installed

cd ..

REM --- Frontend Setup ---
echo [2/2] Setting up Frontend (npm dependencies)...

cd frontend
call npm install --legacy-peer-deps
cd ..

echo.
echo ========================================================
echo   Setup Complete!
echo ========================================================
echo.
echo To start the project, run:
echo   start.bat
echo.
echo Or start individually:
echo   Backend:  cd backend ^& call venv\Scripts\activate ^& python app\main.py
echo   Frontend: cd frontend ^& npm run dev
echo.
pause
