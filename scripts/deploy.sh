#!/bin/bash

# Build and deploy Groundio application

set -e

echo "🚀 Starting Groundio deployment..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Build Docker images
echo "📦 Building Docker images..."
docker build -t groundio/web:latest -f Dockerfile --target production .
docker build -t groundio/api:latest -f Dockerfile --target server .

# Tag images for registry (update with your registry)
REGISTRY="your-registry.com"
docker tag groundio/web:latest $REGISTRY/groundio/web:latest
docker tag groundio/api:latest $REGISTRY/groundio/api:latest

# Push images to registry
echo "📤 Pushing images to registry..."
docker push $REGISTRY/groundio/web:latest
docker push $REGISTRY/groundio/api:latest

# Apply Kubernetes configurations
echo "☸️ Applying Kubernetes configurations..."

# Create namespace if it doesn't exist
kubectl create namespace groundio --dry-run=client -o yaml | kubectl apply -f -

# Apply secrets (make sure to update with real values)
kubectl apply -f k8s/secrets.yaml -n groundio

# Apply database deployments first
kubectl apply -f k8s/database-deployment.yaml -n groundio

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n groundio --timeout=300s

# Apply API deployment
kubectl apply -f k8s/api-deployment.yaml -n groundio

# Wait for API to be ready
echo "⏳ Waiting for API to be ready..."
kubectl wait --for=condition=ready pod -l app=groundio-api -n groundio --timeout=300s

# Apply web deployment
kubectl apply -f k8s/web-deployment.yaml -n groundio

# Wait for web to be ready
echo "⏳ Waiting for web to be ready..."
kubectl wait --for=condition=ready pod -l app=groundio-web -n groundio --timeout=300s

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should be available at: https://groundio.com"

# Show deployment status
echo ""
echo "📊 Deployment Status:"
kubectl get pods -n groundio
kubectl get services -n groundio
kubectl get ingress -n groundio
