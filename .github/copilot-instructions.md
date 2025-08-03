# Groundio - AI Agent Instructions

## Project Overview
Groundio is a cross-platform stadium and venue booking app built with **Expo/React Native**, targeting iOS, Android, and Web. The app uses **Firebase** for backend services and **Stripe** for payments, with a dual customer/merchant interface.

## Architecture & Key Patterns

### Authentication Flow
- **Context-driven auth**: `AuthContext` wraps the entire app and determines navigation flow
- **Conditional navigation**: `App.js` renders either `AuthStackNavigator` (login/signup) or `MainTabNavigator` (main app) based on `currentUser` state
- **Firebase integration**: All auth operations delegate to `authHelpers` in `services/firebase.js`
- **Platform-specific persistence**: Web uses `browserLocalPersistence`, mobile uses `AsyncStorage`

### Navigation Structure
```
App.js (AuthProvider wrapper)
├── AuthStackNavigator (when !currentUser)
│   ├── LoginScreen
│   ├── SignUpScreen 
│   └── ForgotPasswordScreen
└── MainTabNavigator (when currentUser exists)
    ├── HomeStackNavigator
    ├── BookingsScreen
    ├── SearchScreen
    └── ProfileStack
```

### Cross-Platform Styling Patterns
**Critical**: Use `boxShadow` for web compatibility, never legacy `shadow*` props:
```javascript
// ✅ Correct - Web compatible
boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
elevation: 3, // Android

// ❌ Avoid - Causes React Native Web warnings
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
```

**Platform-specific components**: Use conditional rendering in `Background.js` pattern:
```javascript
Platform.OS === 'web' ? (
  <View style={webStyles} />
) : (
  <ImageBackground source={require('...')} />
)
```

### Data & State Management
- **Mock data fallback**: `HomeScreen` uses `mockVenues.js` as primary data source with Firebase as backup to avoid index issues
- **Context pattern**: `AuthContext` provides auth state, methods, and loading states globally
- **No Redux**: Project uses React Context + local state only

### Firebase Integration
- **Modular imports**: Uses v9+ Firebase SDK with tree-shaking
- **Platform-aware auth**: Different persistence strategies for web vs mobile
- **Firestore queries**: Defensive coding with mock data fallbacks
- **Storage**: Configured for image uploads with proper error handling

## Development Workflow

### Essential Commands
```bash
# Start development (Metro bundler)
npm start

# Platform-specific testing
npm run web    # Web browser testing
npm run ios    # iOS simulator
npm run android # Android emulator

# Clean cache when shadow style warnings persist
npx expo start --clear

# Production builds
npm run build:web      # Web deployment
eas build --platform ios     # iOS build
eas build --platform android # Android build
```

### Testing Approach
- **Jest + Expo preset**: `jest.config.js` with extensive mock setup
- **Component testing**: Focus on `__tests__/` directories
- **Navigation mocking**: Comprehensive `jest.setup.js` mocks for React Navigation
- **Coverage targets**: 70% across all metrics (see jest.config.js)

### Key File Conventions
- **Screens**: Organized by user type (`customers/`, `merchant/`, `auth/`)
- **Components**: Reusable UI in `components/`, platform-specific variants with `.web.js` suffix
- **Services**: External integrations in `services/` (firebase, payments, notifications)
- **Styles**: Global styles in `styles/`, component-specific styles inline

## Common Patterns & Anti-Patterns

### Error Handling
- **Native alerts preferred**: Use `Alert.alert()` over custom toast components (ErrorToast was removed due to navigation conflicts)
- **Firebase errors**: Wrap all Firebase operations in try-catch with user-friendly messages
- **Loading states**: Always provide loading indicators for async operations

### Component Architecture
- **Functional components**: All components use hooks, no class components
- **Custom hooks**: Use for permissions (`useCameraPermissions`, `useLocationPermissions`)
- **Platform detection**: Use `Platform.OS` for conditional rendering/styling

### Performance Considerations
- **Image optimization**: Use `expo-image` for better caching
- **Lazy loading**: Implement for screens not immediately needed
- **Memory management**: Always clean up Firebase listeners in useEffect cleanup

## Integration Points

### Payment Processing
- **Stripe integration**: `paymentService.js` handles all payment operations
- **Secure handling**: API keys in environment variables, never hardcoded

### Push Notifications
- **Expo notifications**: `notificationService.js` with proper permission handling
- **Firebase messaging**: Integrated with user authentication state

### File Uploads
- **Multi-platform**: `FileUploader.js` and `ProfileImageUploader.js` handle permissions and platform differences
- **Firebase Storage**: Direct uploads with progress tracking

## Critical Notes
- **Always test web platform** when making style changes - shadow properties are the #1 compatibility issue
- **Mock data is intentional** - Firebase indexes cause development issues, so `mockVenues.js` is the primary data source
- **Authentication is global** - All screens can access `useAuth()` hook for user state and auth methods
- **Platform-specific styling** is essential - web requires different approaches for backgrounds, shadows, and inputs

## Quick Reference
- **Auth state**: `const { currentUser, loading, signOut } = useAuth()`
- **Navigation**: All screens receive `navigation` prop with standard React Navigation methods
- **Error display**: Use `Alert.alert(title, message)` for error messages
- **Loading states**: Use `CustomLoadingSpinner` component with Lottie animations
- **Platform check**: `Platform.OS === 'web'` for conditional logic
