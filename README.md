# 🏟️ Groundio - Stadium & Venue Booking Platform

A modern, cross-platform venue booking application built with React Native/Expo for mobile and React for web, featuring Firebase backend and containerized deployment with Docker and Kubernetes.

## 🚀 Features

- **Cross-Platform**: Runs on iOS, Android, and Web
- **Modern UI**: Beautiful, responsive design with enhanced styling
- **Real-time**: Firebase integration for real-time data
- **Scalable**: Docker and Kubernetes ready for production
- **Secure**: Authentication, payment processing, and data protection
- **PWA Ready**: Web app works offline with service workers

## 📱 Platforms

### Mobile (React Native/Expo)
- iOS App Store ready
- Android Play Store ready
- Expo Go development

### Web (React + Vite)
- Modern web application
- Progressive Web App (PWA)
- Responsive design

## 🏗️ Architecture

```
groundio/
├── app/                    # Mobile React Native components
├── web-app/               # Web React application
├── docker/                # Docker configurations
├── k8s/                   # Kubernetes manifests
├── scripts/               # Deployment scripts
├── services/              # Firebase and API services
└── components/            # Shared components
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Docker (for containerization)
- kubectl (for Kubernetes deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/groundio.git
   cd groundio
   ```

2. **Install dependencies**
   ```bash
   # Install main app dependencies
   npm install
   
   # Install web app dependencies
   cd web-app && npm install && cd ..
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase config
   ```

### Running the Application

#### Mobile Development
```bash
# Start Expo development server
npm run start:mobile

# Run on specific platforms
npm run android
npm run ios
```

#### Web Development
```bash
# Start web development server
npm run start:web

# Alternative: Use Expo web
npm run web
```

#### Both Platforms
```bash
# Start main development server (mobile + web)
npm start
```

## 🐳 Docker Deployment

### Development Environment
```bash
# Start development containers
npm run docker:dev
# or
docker-compose up
```

### Production Environment
```bash
# Build and start production containers
npm run docker:prod
# or
docker-compose -f docker-compose.prod.yml up
```

### Building Docker Images
```bash
# Build production image
npm run docker:build

# Manual build
docker build -t groundio:latest .
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (local or cloud)
- kubectl configured
- Docker registry access

### Quick Deploy
```bash
# Linux/Mac
npm run k8s:deploy

# Windows
npm run k8s:deploy:win
```

### Manual Deployment

1. **Update registry in deployment scripts**
   ```bash
   # Edit scripts/deploy.sh or scripts/deploy.bat
   # Change REGISTRY variable to your registry
   ```

2. **Create secrets**
   ```bash
   # Update k8s/secrets.yaml with your actual secrets
   kubectl apply -f k8s/secrets.yaml -n groundio
   ```

3. **Deploy services**
   ```bash
   # Apply all Kubernetes configurations
   kubectl apply -f k8s/ -n groundio
   ```

4. **Check deployment status**
   ```bash
   kubectl get pods -n groundio
   kubectl get services -n groundio
   ```

### Scaling

```bash
# Scale web application
kubectl scale deployment groundio-web --replicas=5 -n groundio

# Scale API
kubectl scale deployment groundio-api --replicas=3 -n groundio
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in root directory:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret

# API Configuration
API_BASE_URL=https://api.groundio.com
WEB_BASE_URL=https://groundio.com
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:ci

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📦 Building for Production

### Mobile Apps
```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios

# Build for both platforms
npm run build:all
```

### Web Application
```bash
# Build web app
npm run build:web
```

## 🚀 Deployment Options

### 1. Cloud Platforms

#### Vercel (Web)
```bash
cd web-app
vercel --prod
```

#### Netlify (Web)
```bash
cd web-app
npm run build
# Upload dist/ folder to Netlify
```

#### Expo EAS (Mobile)
```bash
# Submit to app stores
npm run submit:android
npm run submit:ios
```

### 2. Self-Hosted

#### Docker Swarm
```bash
docker swarm init
docker stack deploy -c docker-compose.prod.yml groundio
```

#### Kubernetes
```bash
# Use the provided K8s configurations
kubectl apply -f k8s/
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Update all default passwords in `k8s/secrets.yaml`
- [ ] Configure SSL/TLS certificates
- [ ] Setup firewall rules
- [ ] Enable authentication for admin panels
- [ ] Configure backup strategy
- [ ] Setup monitoring and logging
- [ ] Review CORS settings
- [ ] Validate input sanitization

## 📊 Monitoring

### Health Checks
- Web: `http://your-domain/health`
- API: `http://your-api/health`
- Kubernetes: Built-in liveness/readiness probes

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🆘 Support

### Common Issues

#### Docker Issues
```bash
# Clean Docker system
docker system prune -a

# Rebuild without cache
docker build --no-cache -t groundio:latest .
```

#### Kubernetes Issues
```bash
# Check pod logs
kubectl logs -f deployment/groundio-web -n groundio

# Debug pod
kubectl describe pod <pod-name> -n groundio
```

#### Development Issues
```bash
# Clear caches
npm run install:clean
expo start --clear

# Reset Metro cache
npx expo start --clear
```

---

Made with ❤️ by the Groundio Team
