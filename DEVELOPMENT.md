# Development Setup Guide 🛠️

This guide will help you set up the Groundio development environment.

## Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v8.0.0 or higher
- **Expo CLI** v6.0.0 or higher
- **Git** v2.30.0 or higher
- **VS Code** (recommended IDE)

## Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/Srihaas007/Groundio.git
cd Groundio
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm start
```

4. **Run on different platforms:**
- **iOS Simulator:** Press `i` or run `npm run ios`
- **Android Emulator:** Press `a` or run `npm run android`
- **Web Browser:** Press `w` or run `npm run web`

## Project Structure

```
Groundio/
├── app/                    # Main application screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── screens/           # All screen components
│   │   ├── customers/     # Customer-facing screens
│   │   └── merchant/      # Merchant-facing screens
│   ├── _layout.tsx        # Root layout component
│   └── index.tsx          # Entry point
├── components/            # Reusable UI components
│   ├── navigation/        # Navigation components
│   └── ui/               # UI components
├── context/              # React Context providers
├── services/             # API services and utilities
│   ├── firebase.js       # Firebase configuration
│   ├── paymentService.js # Payment processing
│   └── notificationService.js # Push notifications
├── navigation/           # Navigation configuration
├── assets/              # Static assets (images, fonts)
├── constants/           # App constants and configuration
├── hooks/               # Custom React hooks
├── styles/              # Global styles and themes
├── utils/               # Utility functions
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
├── eas.json           # EAS Build configuration
└── README.md          # Project documentation
```

## Configuration Files

### app.json
Main Expo configuration file containing:
- App metadata (name, version, icon)
- Platform-specific settings
- Plugin configurations
- Build settings

### eas.json
EAS Build configuration for:
- Development builds
- Preview builds
- Production builds
- App store submissions

### package.json
Contains:
- Project dependencies
- Build scripts
- Development tools
- Testing configuration

## Development Workflow

### 1. Feature Development
```bash
# Create a new feature branch
git checkout -b feature/booking-system

# Make your changes
# Test thoroughly
# Commit changes
git add .
git commit -m "Add booking system feature"

# Push to repository
git push origin feature/booking-system

# Create pull request
```

### 2. Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:ci

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### 3. Building
```bash
# Development build
eas build --profile development --platform ios

# Preview build
eas build --profile preview --platform android

# Production build
eas build --profile production --platform all
```

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication, Firestore, and Storage
4. Add web app to get configuration

### 2. Configure Firebase
Update `services/firebase.js` with your configuration:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Set up Authentication
Enable authentication methods in Firebase Console:
- Email/Password
- Google Sign-In
- Phone Authentication (optional)

### 4. Configure Firestore
Set up collections:
- `users` - User profiles
- `venues` - Venue information
- `bookings` - Booking records
- `notifications` - Push notifications

## Development Tools

### VS Code Extensions
Recommended extensions for development:
- **ES7+ React/Redux/React-Native snippets**
- **Expo Tools**
- **Firebase Explorer**
- **Git Lens**
- **Prettier - Code formatter**
- **ESLint**
- **React Native Tools**

### VS Code Settings
Add to your `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### Debugging

#### React Native Debugger
1. Install React Native Debugger
2. Enable debugging in Expo Dev Tools
3. Set breakpoints and inspect state

#### Flipper (Advanced)
1. Install Flipper desktop app
2. Configure React Native integration
3. Use for network inspection, state management

## Environment Variables

Create environment-specific files:

### .env.development
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=your_dev_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### .env.production
```bash
EXPO_PUBLIC_API_URL=https://api.groundio.com
EXPO_PUBLIC_FIREBASE_API_KEY=your_prod_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

## API Integration

### Firebase Functions (Backend)
```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createBooking = functions.https.onCall(async (data, context) => {
  // Validate authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  // Process booking
  const booking = await admin.firestore().collection('bookings').add({
    ...data,
    userId: context.auth.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { bookingId: booking.id };
});
```

### Payment Processing
```javascript
// services/paymentService.js
class PaymentService {
  async processPayment(paymentData) {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      return await response.json();
    } catch (error) {
      throw new Error('Payment processing failed');
    }
  }
}
```

## Common Development Tasks

### Adding a New Screen
1. Create screen component in appropriate folder
2. Add navigation route
3. Update navigation types (if using TypeScript)
4. Add necessary imports

### Adding a New Component
1. Create component in `components/` folder
2. Export from index file
3. Add PropTypes or TypeScript interfaces
4. Write unit tests

### Database Operations
```javascript
// Create document
const docRef = await addDoc(collection(db, 'venues'), venueData);

// Read document
const docSnap = await getDoc(doc(db, 'venues', venueId));

// Update document
await updateDoc(doc(db, 'venues', venueId), updates);

// Delete document
await deleteDoc(doc(db, 'venues', venueId));

// Real-time listener
const unsubscribe = onSnapshot(collection(db, 'venues'), (snapshot) => {
  // Handle updates
});
```

## Performance Optimization

### Code Splitting
```javascript
// Lazy load screens
const HomeScreen = React.lazy(() => import('./screens/HomeScreen'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <HomeScreen />
</Suspense>
```

### Image Optimization
```javascript
// Use optimized images
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  contentFit="cover"
  cachePolicy="memory-disk"
/>
```

### Memory Management
```javascript
// Clean up listeners
useEffect(() => {
  const unsubscribe = onSnapshot(query, callback);
  return unsubscribe; // Cleanup on unmount
}, []);
```

## Troubleshooting

### Common Issues

#### Metro bundler issues
```bash
# Clear cache
npx expo start --clear

# Reset Metro cache
npx react-native start --reset-cache
```

#### Expo CLI issues
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Login to Expo
npx expo login
```

#### Build issues
```bash
# Clear EAS build cache
eas build --clear-cache

# Check build logs
eas build:list
```

### Performance Issues
- Use React DevTools Profiler
- Monitor bundle size with `expo-bundle-analyzer`
- Optimize images and assets
- Implement lazy loading

### Memory Leaks
- Use memory profiler
- Check for uncleaned listeners
- Avoid circular references
- Optimize large lists with FlatList

## Contributing

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Write clear commit messages

### Pull Request Process
1. Create feature branch
2. Write tests for new features
3. Update documentation
4. Submit pull request
5. Address review feedback

### Code Review Checklist
- [ ] Code follows style guide
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No console.logs in production code
- [ ] Error handling is implemented
- [ ] Performance impact considered

## Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

### Community
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

### Learning Resources
- [React Native Express](http://reactnativeexpress.com/)
- [Expo Learn](https://docs.expo.dev/tutorial/introduction/)
- [Firebase Codelabs](https://firebase.google.com/codelabs)

---

For questions or support, contact the development team or create an issue in the repository.
