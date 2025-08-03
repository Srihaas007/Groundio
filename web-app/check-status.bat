@echo off
echo === Groundio Project Status Check ===
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this from the web-app directory.
    exit /b 1
)

echo ✅ Found package.json

REM Check Node.js version
where node >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js: !NODE_VERSION!
) else (
    echo ❌ Node.js not found
    exit /b 1
)

REM Check npm version
where npm >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm: !NPM_VERSION!
) else (
    echo ❌ npm not found
    exit /b 1
)

REM Check if node_modules exists
if exist "node_modules\" (
    echo ✅ Dependencies installed
) else (
    echo ⚠️  Dependencies not installed - run 'npm install'
)

REM Check key files
set FILES=src\App.jsx src\index.css src\components\Header.jsx src\components\Hero.jsx
for %%f in (%FILES%) do (
    if exist "%%f" (
        echo ✅ Found %%f
    ) else (
        echo ❌ Missing %%f
    )
)

echo.
echo === Quick Start Commands ===
echo Development server: npm run dev
echo Build for production: npm run build
echo Preview production build: npm run preview
echo.

REM Try to start the dev server if requested
if "%1"=="--start" (
    echo Starting development server...
    npm run dev
)
