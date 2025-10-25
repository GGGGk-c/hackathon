@echo off
echo ====================================
echo ANT61 Satellite System - Starting...
echo ====================================
echo.

cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo.

echo Checking npm installation...
npm --version
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo ====================================
echo Starting development server...
echo The app will open at http://localhost:3000
echo Press Ctrl+C to stop the server
echo ====================================
echo.

call npm run dev

pause

