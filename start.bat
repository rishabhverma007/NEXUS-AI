@echo off
REM ============================================================================
REM NEXUS AI - Development Server Start Script (Windows)
REM ============================================================================
REM Starts both the FastAPI backend and Next.js frontend development servers.
REM
REM Usage:
REM   start.bat
REM
REM Close the terminal window or press Ctrl+C to stop.
REM ============================================================================

echo ========================================================
echo   NEXUS AI - Starting Development Servers
echo ========================================================
echo.

REM Check if setup has been run
if not exist "backend\venv" (
    echo [WARN] Virtual environment not found. Run setup.bat first.
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo [WARN] Frontend dependencies not found. Run setup.bat first.
    pause
    exit /b 1
)

REM --- Start Backend ---
echo [1/2] Starting FastAPI Backend...
start "NEXUS Backend" /B cmd /c "cd backend && call venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo   [OK] Backend starting on http://localhost:8000

REM --- Wait for backend (max 30 seconds) ---
echo   Waiting for backend...
set BACKEND_RETRIES=0
:wait_backend
if %BACKEND_RETRIES% GEQ 15 (
    echo   [WARN] Backend not responding after 30 seconds, continuing anyway...
    goto :backend_done
)
timeout /t 2 /nobreak >nul
curl -s -o nul http://localhost:8000/ 2>nul
if errorlevel 1 (
    set /a BACKEND_RETRIES+=1
    goto wait_backend
)
echo   [OK] Backend is ready!
:backend_done
set BACKEND_RETRIES=

REM --- Start Frontend ---
echo [2/2] Starting Next.js Frontend...
start "NEXUS Frontend" /B cmd /c "cd frontend && npx next dev --port 3000"
echo   [OK] Frontend starting on http://localhost:3000

echo.
echo ========================================================
echo   Both servers are starting up!
echo ========================================================
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000
echo   API Docs:  http://localhost:8000/api/v1/openapi.json
echo.
echo Close this window or press Ctrl+C to stop both servers.
echo.

REM Keep the window open
pause >nul
