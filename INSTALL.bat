@echo off
echo ====================================
echo Installing Dependencies...
echo ====================================
echo.

cd /d "%~dp0"
echo Current directory: %CD%
echo.

node --version
npm --version
echo.

npm install

echo.
echo ====================================
echo Installation Complete!
echo Run START_APP.bat to launch the app
echo ====================================
pause

