@echo off
REM Build and deploy Groundio application on Windows

echo 🚀 Starting Groundio deployment...

REM Check if kubectl is available
kubectl version --client >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ kubectl is not installed. Please install kubectl first.
    exit /b 1
)

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Build Docker images
echo 📦 Building Docker images...
docker build -t groundio/web:latest -f Dockerfile --target production .
docker build -t groundio/api:latest -f Dockerfile --target server .

REM Tag images for registry (update with your registry)
set REGISTRY=your-registry.com
docker tag groundio/web:latest %REGISTRY%/groundio/web:latest
docker tag groundio/api:latest %REGISTRY%/groundio/api:latest

REM Push images to registry
echo 📤 Pushing images to registry...
docker push %REGISTRY%/groundio/web:latest
docker push %REGISTRY%/groundio/api:latest

REM Apply Kubernetes configurations
echo ☸️ Applying Kubernetes configurations...

REM Create namespace if it doesn't exist
kubectl create namespace groundio --dry-run=client -o yaml | kubectl apply -f -

REM Apply secrets
kubectl apply -f k8s/secrets.yaml -n groundio

REM Apply database deployments first
kubectl apply -f k8s/database-deployment.yaml -n groundio

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
kubectl wait --for=condition=ready pod -l app=postgres -n groundio --timeout=300s

REM Apply API deployment
kubectl apply -f k8s/api-deployment.yaml -n groundio

REM Wait for API to be ready
echo ⏳ Waiting for API to be ready...
kubectl wait --for=condition=ready pod -l app=groundio-api -n groundio --timeout=300s

REM Apply web deployment
kubectl apply -f k8s/web-deployment.yaml -n groundio

REM Wait for web to be ready
echo ⏳ Waiting for web to be ready...
kubectl wait --for=condition=ready pod -l app=groundio-web -n groundio --timeout=300s

echo ✅ Deployment completed successfully!
echo 🌐 Your application should be available at: https://groundio.com

REM Show deployment status
echo.
echo 📊 Deployment Status:
kubectl get pods -n groundio
kubectl get services -n groundio
kubectl get ingress -n groundio

pause
