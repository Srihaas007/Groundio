#!/bin/bash

echo "=== Groundio Project Status Check ==="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the web-app directory."
    exit 1
fi

echo "✅ Found package.json"

# Check Node.js version
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check npm version
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed - run 'npm install'"
fi

# Check key files
FILES=("src/App.jsx" "src/index.css" "src/components/Header.jsx" "src/components/Hero.jsx")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Found $file"
    else
        echo "❌ Missing $file"
    fi
done

echo ""
echo "=== Quick Start Commands ==="
echo "Development server: npm run dev"
echo "Build for production: npm run build" 
echo "Preview production build: npm run preview"
echo ""

# Try to start the dev server if requested
if [ "$1" = "--start" ]; then
    echo "Starting development server..."
    npm run dev
fi
