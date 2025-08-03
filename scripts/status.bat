@echo off
echo 🏟️ Groundio Deployment Status Check
echo ==================================

echo 📋 Checking prerequisites...

where node >nul 2>&1 && echo ✅ node is installed || echo ❌ node is not installed
where npm >nul 2>&1 && echo ✅ npm is installed || echo ❌ npm is not installed
where docker >nul 2>&1 && echo ✅ docker is installed || echo ❌ docker is not installed
where kubectl >nul 2>&1 && echo ✅ kubectl is installed || echo ❌ kubectl is not installed

echo.
echo 📂 Project Structure:
dir /b | findstr /r "app web-app docker k8s scripts"

echo.
echo 🔧 Environment Status:
if exist ".env" (
    echo ✅ .env file exists
) else (
    echo ⚠️  .env file not found - create one from .env.example
)

echo.
echo 📦 Dependencies Status:
if exist "package.json" (
    echo ✅ Main package.json exists
    if exist "node_modules" (
        echo ✅ Main dependencies installed
    ) else (
        echo ⚠️  Main dependencies not installed - run 'npm install'
    )
)

if exist "web-app\package.json" (
    echo ✅ Web app package.json exists
    if exist "web-app\node_modules" (
        echo ✅ Web app dependencies installed
    ) else (
        echo ⚠️  Web app dependencies not installed - run 'cd web-app && npm install'
    )
)

echo.
echo 🐳 Docker Status:
docker info >nul 2>&1 && (
    echo ✅ Docker daemon is running
    docker --version
) || echo ❌ Docker daemon is not running

echo.
echo ☸️  Kubernetes Status:
kubectl cluster-info >nul 2>&1 && (
    echo ✅ Kubernetes cluster is accessible
    kubectl version --client --short
) || echo ⚠️  Kubernetes cluster not accessible

echo.
echo 🚀 Quick Start Commands:
echo ------------------------
echo 🔨 Install dependencies:        npm install ^&^& cd web-app ^&^& npm install
echo 📱 Start mobile development:    npm run start:mobile
echo 🌐 Start web development:       npm run start:web
echo 🐳 Start with Docker:           npm run docker:dev
echo ☸️  Deploy to Kubernetes:       npm run k8s:deploy:win

echo.
echo ✨ Ready to start development!
pause
