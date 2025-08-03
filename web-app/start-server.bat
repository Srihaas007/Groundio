@echo off
echo 🚀 Starting Groundio Production Server...
echo.
echo Building the application...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo.
echo ✅ Build successful!
echo.
echo Starting server with React Router support...
echo 📱 Your app will be available at http://localhost:3000
echo 🌐 React Router support enabled - all routes will work!
echo.
echo Press Ctrl+C to stop the server
echo.
npx http-server dist -p 3000 --proxy http://localhost:3000?
