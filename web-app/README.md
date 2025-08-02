# Groundio Web Application

A modern React web application for booking stadiums and venues, built with Vite and ready for Docker deployment.

## 🚀 Quick Start

### Development
```bash
cd web-app
npm install
npm run dev
```

### Docker Development
```bash
cd web-app
docker-compose up
```

### Production Build
```bash
cd web-app
npm run build
npm run serve
```

### Docker Production
```bash
cd web-app
docker-compose -f docker-compose.prod.yml up
```

## 🐳 Docker Deployment

### For Free Hosting (Render, Railway, etc.)

1. **Build the production image:**
   ```bash
   docker build -t groundio-web .
   ```

2. **Run locally:**
   ```bash
   docker run -p 3000:3000 groundio-web
   ```

3. **Deploy to cloud platforms:**
   - **Render**: Connect your GitHub repo and use the Dockerfile
   - **Railway**: Push to GitHub and connect the repository
   - **Fly.io**: Use `fly deploy` with the included Dockerfile
   - **Heroku**: Use `heroku container:push web` and `heroku container:release web`

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=3000
```

## 📁 Project Structure
```
web-app/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Route components
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── Dockerfile         # Production Docker config
├── Dockerfile.dev     # Development Docker config
├── docker-compose.yml # Development compose
└── docker-compose.prod.yml # Production compose
```

## 🌐 Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ React Router for navigation
- ✅ Modern CSS with dark/light theme support
- ✅ Form validation and error handling
- ✅ Docker containerization
- ✅ Production-ready build process
- 🔄 Firebase authentication (to be implemented)
- 🔄 Real venue booking system (to be implemented)

## 📱 Cross-Platform Support
- **Web**: Runs in all modern browsers
- **iOS**: Can be wrapped with Capacitor for native iOS app
- **Android**: Can be wrapped with Capacitor for native Android app

## 🚢 Free Deployment Options

1. **Render** (Recommended for beginners)
   - Free tier available
   - Automatic deployments from GitHub
   - Custom domain support

2. **Railway**
   - $5 credit monthly
   - Simple deployment process

3. **Vercel** (For static sites)
   - Unlimited free hosting
   - Automatic deployments

4. **Netlify** (For static sites)
   - Free tier with generous limits
   - Easy custom domain setup

## 🔧 Development Tools Included
- Vite for fast development and building
- ESLint for code quality
- Hot module replacement
- CSS with CSS Grid and Flexbox
- Modern JavaScript (ES6+)
