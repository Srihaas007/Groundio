# Groundio 🏟️

Cross-platform stadium and ground booking application built with Expo and React Native. This app provides a seamless experience for users to browse, book, and manage sports venues across Android, iOS, and web platforms.

## 🚀 Features

- **Multi-platform Support**: Works on iOS, Android, iPad, and Web
- **Real-time Booking**: Live availability updates using Firebase
- **Secure Payments**: Integrated with Stripe for secure transactions  
- **User Management**: Complete authentication and profile management
- **Venue Discovery**: Browse and search sports venues with detailed information
- **Booking Management**: Track and manage your bookings
- **Responsive Design**: Optimized for mobile phones, tablets, and desktop

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Navigation**: React Navigation 6
- **Payments**: Stripe
- **State Management**: React Context/Redux
- **UI Components**: Native React Native components with custom styling
- **Date/Time**: React Native UI DatePicker

## 📱 Platform Support

- **iOS**: iPhone and iPad (native app)
- **Android**: Phone and tablet (native app)
- **Web**: Progressive Web App (PWA)
- **Desktop**: Electron wrapper (optional)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Srihaas007/Groundio.git
   cd Groundio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional required packages**
   ```bash
   npm install @expo/vector-icons@^14.0.2 \
   @react-native-async-storage/async-storage@^1.24.0 \
   @react-native-community/checkbox@^0.5.17 \
   @react-native-community/datetimepicker@^8.2.0 \
   @react-navigation/drawer@^6.7.2 \
   @react-navigation/material-top-tabs@^6.6.14 \
   @react-navigation/native@^6.0.2 \
   @react-navigation/stack@^6.4.1 \
   date-fns@^3.6.0 \
   firebase@^10.13.0 \
   react-datepicker@^7.3.0 \
   react-native-reanimated@~3.10.1 \
   react-native-tab-view@^3.5.2 \
   react-native-ui-datepicker@^2.0.3 \
   react-toastify@^10.0.5
   ```

## � Getting Started

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Run on different platforms**
   - **iOS Simulator**: Press `i` in the terminal or scan QR code with Expo Go
   - **Android Emulator**: Press `a` in the terminal or scan QR code with Expo Go
   - **Web Browser**: Press `w` in the terminal
   - **Physical Device**: Install Expo Go app and scan the QR code

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication, Firestore, and Storage
3. Add your Firebase config to `firebase.config.js`

### Stripe Setup
1. Create a Stripe account
2. Get your publishable and secret keys
3. Configure payment methods in your Stripe dashboard

## 📁 Project Structure

```
Groundio/
├── app/                    # Main app screens (file-based routing)
├── components/            # Reusable UI components
├── contexts/             # React Context providers
├── services/             # API services and Firebase config
├── assets/               # Images, fonts, and other assets
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🔨 Build for Production

### Mobile Apps
```bash
# iOS
expo build:ios

# Android
expo build:android
```

### Web Deployment
```bash
# Build web version
expo export:web

# Deploy to hosting service (Netlify, Vercel, etc.)
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📖 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Srihaas007** - Lead Developer
- Contributors welcome!

## 📞 Support

For support, email support@groundio.com or join our Discord community.
