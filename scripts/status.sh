#!/bin/bash

echo "🏟️ Groundio Deployment Status Check"
echo "=================================="

# Check if required tools are installed
echo "📋 Checking prerequisites..."

check_command() {
    if command -v $1 &> /dev/null; then
        echo "✅ $1 is installed"
        return 0
    else
        echo "❌ $1 is not installed"
        return 1
    fi
}

# Check all required tools
check_command "node"
check_command "npm"
check_command "docker"
check_command "kubectl"

echo ""
echo "📂 Project Structure:"
ls -la | grep -E "(app|web-app|docker|k8s|scripts)"

echo ""
echo "🔧 Environment Status:"
if [ -f ".env" ]; then
    echo "✅ .env file exists"
else
    echo "⚠️  .env file not found - create one from .env.example"
fi

echo ""
echo "📦 Dependencies Status:"
if [ -f "package.json" ]; then
    echo "✅ Main package.json exists"
    if [ -d "node_modules" ]; then
        echo "✅ Main dependencies installed"
    else
        echo "⚠️  Main dependencies not installed - run 'npm install'"
    fi
fi

if [ -f "web-app/package.json" ]; then
    echo "✅ Web app package.json exists"
    if [ -d "web-app/node_modules" ]; then
        echo "✅ Web app dependencies installed"
    else
        echo "⚠️  Web app dependencies not installed - run 'cd web-app && npm install'"
    fi
fi

echo ""
echo "🐳 Docker Status:"
if docker info > /dev/null 2>&1; then
    echo "✅ Docker daemon is running"
    docker --version
else
    echo "❌ Docker daemon is not running"
fi

echo ""
echo "☸️  Kubernetes Status:"
if kubectl cluster-info > /dev/null 2>&1; then
    echo "✅ Kubernetes cluster is accessible"
    kubectl version --client --short
else
    echo "⚠️  Kubernetes cluster not accessible"
fi

echo ""
echo "🚀 Quick Start Commands:"
echo "------------------------"
echo "🔨 Install dependencies:        npm install && cd web-app && npm install"
echo "📱 Start mobile development:    npm run start:mobile"
echo "🌐 Start web development:       npm run start:web"
echo "🐳 Start with Docker:           npm run docker:dev"
echo "☸️  Deploy to Kubernetes:       npm run k8s:deploy"

echo ""
echo "✨ Ready to start development!"
