# Groundio - Production Deployment Guide 🚀

This guide will help you deploy Groundio to production across all platforms (iOS, Android, Web, and iPad).

## Prerequisites

Before deploying, ensure you have:

- **Node.js** v18.0.0 or higher
- **Expo CLI** v6.0.0 or higher
- **EAS CLI** for building production apps
- **Firebase** project configured
- **Stripe** account for payments
- **Apple Developer** account (for iOS)
- **Google Play Console** account (for Android)

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create environment configuration files:

**For development:**
```bash
# .env.development
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

**For production:**
```bash
# .env.production
EXPO_PUBLIC_FIREBASE_API_KEY=your_production_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_production_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_firebase_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_production_firebase_app_id
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

## Platform-Specific Setup

### iOS Deployment

#### 1. Configure app.json for iOS
```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.groundio.stadiumboking",
      "buildNumber": "1",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "This app uses location to find nearby venues.",
        "NSCameraUsageDescription": "This app uses camera to take photos for profile and venue images.",
        "NSPhotoLibraryUsageDescription": "This app uses photo library to select images for profile and venues."
      }
    }
  }
}
```

#### 2. Build and Submit
```bash
# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### Android Deployment

#### 1. Configure app.json for Android
```json
{
  "expo": {
    "android": {
      "package": "com.groundio.stadiumboking",
      "versionCode": 1,
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

#### 2. Build and Submit
```bash
# Build for Google Play Store
eas build --platform android --profile production

# Submit to Google Play Store
eas submit --platform android
```

### Web Deployment

#### 1. Build Web Version
```bash
# Build for web
expo export:web

# The build will be in the web-build directory
```

#### 2. Deploy to Hosting Platforms

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir web-build
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Firebase Hosting:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## Database & Backend Setup

### Firebase Configuration

1. **Firestore Database Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Venues are readable by all, writable by owners
    match /venues/{venueId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == resource.data.merchantId;
    }
    
    // Bookings are readable/writable by involved parties
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == resource.data.merchantId);
    }
    
    // Notifications are readable/writable by the user
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

2. **Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /venues/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Payment Integration

#### Stripe Setup

1. **Create webhook endpoint** for handling payment events:
```bash
# Example webhook URL
https://your-backend-server.com/webhooks/stripe
```

2. **Backend payment processing** (Node.js example):
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Testing

### Run Tests
```bash
# Run unit tests
npm run test:ci

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Manual Testing Checklist

#### Mobile Apps (iOS/Android)
- [ ] User registration and login
- [ ] Venue browsing and search
- [ ] Booking creation and management
- [ ] Payment processing
- [ ] Push notifications
- [ ] Location services
- [ ] Image upload/camera
- [ ] Offline functionality

#### Web App
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] PWA functionality
- [ ] Browser compatibility
- [ ] SEO optimization
- [ ] Performance metrics

#### iPad Specific
- [ ] Split-screen multitasking
- [ ] Landscape orientation
- [ ] Large screen layouts
- [ ] Apple Pencil support (if applicable)

## Performance Optimization

### 1. Bundle Size Optimization
```bash
# Analyze bundle size
npx expo-doctor

# Remove unused dependencies
npm prune
```

### 2. Image Optimization
- Use WebP format for web
- Implement lazy loading
- Compress images before upload
- Generate multiple sizes/resolutions

### 3. Caching Strategy
- Implement proper cache headers
- Use React Query for API caching
- Cache static assets
- Implement offline functionality

## Monitoring & Analytics

### 1. Error Tracking
```bash
# Install Sentry
npm install @sentry/react-native

# Configure in app
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});
```

### 2. Analytics
```bash
# Install Firebase Analytics
npm install @react-native-firebase/analytics

# Track events
import analytics from '@react-native-firebase/analytics';

await analytics().logEvent('venue_booked', {
  venue_id: venueId,
  amount: bookingAmount,
});
```

## Security Considerations

### 1. API Security
- Implement rate limiting
- Use HTTPS everywhere
- Validate all inputs
- Implement proper authentication

### 2. Data Protection
- Encrypt sensitive data
- Implement proper user permissions
- Regular security audits
- GDPR compliance

### 3. App Security
- Enable code obfuscation
- Implement certificate pinning
- Use secure storage for sensitive data

## Maintenance & Updates

### 1. Over-the-Air Updates
```bash
# Install Expo Updates
npm install expo-updates

# Configure in app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    }
  }
}
```

### 2. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: eas build --platform all --non-interactive
```

## Launch Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] App store assets prepared
- [ ] Privacy policy and terms of service
- [ ] Beta testing completed

### Launch Day
- [ ] Deploy to production
- [ ] Monitor error rates
- [ ] Check payment processing
- [ ] Verify push notifications
- [ ] Monitor server performance

### Post-Launch
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Bug fixes and updates
- [ ] Feature usage analytics

## Support & Documentation

### User Support
- In-app help system
- FAQ section
- Contact support form
- Video tutorials

### Developer Resources
- API documentation
- SDK documentation
- Integration guides
- Best practices

## Scaling Considerations

### Infrastructure
- Use CDN for static assets
- Implement database sharding
- Add read replicas
- Use caching layers

### Features
- Multi-language support
- Multiple payment methods
- Advanced search filters
- Social features
- Admin dashboard

---

For additional support or questions, contact the development team at dev@groundio.com
