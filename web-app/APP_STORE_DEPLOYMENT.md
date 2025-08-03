# 🏪 App Store & Play Store Deployment Guide

Your Groundio app is now ready for **Google Play Store** and **Apple App Store** deployment! This guide covers the complete process from native app building to store submission.

## 📱 Current Setup Status

✅ **Capacitor Initialized** - Native iOS and Android projects created  
✅ **Web App Built** - Production build ready in `/dist`  
✅ **Android Platform Added** - Ready for Play Store  
✅ **iOS Platform Added** - Ready for App Store  

## 🔧 Prerequisites

### For Android (Google Play Store):
- **Android Studio** (Download: https://developer.android.com/studio)
- **Google Play Console Account** ($25 one-time fee)
- **Java Development Kit (JDK) 11+**

### For iOS (Apple App Store):
- **macOS computer** (required for iOS development)
- **Xcode** (Free from Mac App Store)
- **Apple Developer Account** ($99/year)
- **iOS device for testing** (iPhone/iPad)

## 🤖 Android Deployment (Google Play Store)

### Step 1: Open Android Project
```bash
npx cap open android
```
This opens Android Studio with your native Android project.

### Step 2: Configure App Details
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">Groundio</string>
    <string name="title_activity_main">Groundio - Stadium Booking</string>
    <string name="package_name">com.groundio.app</string>
    <string name="custom_url_scheme">com.groundio.app</string>
</resources>
```

### Step 3: Update App Icons & Splash Screen
- Replace icons in `android/app/src/main/res/mipmap-*` folders
- Update splash screen in `android/app/src/main/res/drawable`

### Step 4: Generate Signed APK
1. In Android Studio: **Build → Generate Signed Bundle/APK**
2. Choose **Android App Bundle** (recommended for Play Store)
3. Create new keystore or use existing one
4. **IMPORTANT:** Save keystore file safely - you'll need it for updates!

### Step 5: Test on Device
```bash
npx cap run android
```

### Step 6: Upload to Play Store
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Upload your AAB file
4. Fill out store listing (description, screenshots, etc.)
5. Submit for review

## 🍎 iOS Deployment (Apple App Store)

### Step 1: Open iOS Project (macOS Only)
```bash
npx cap open ios
```
This opens Xcode with your native iOS project.

### Step 2: Configure Bundle Identifier
1. In Xcode, select your project
2. Under **General → Identity**, set Bundle Identifier to `com.groundio.app`
3. Select your **Team** (Apple Developer Account)

### Step 3: Update App Icons & Launch Screen
- Replace icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Update launch screen in `ios/App/App/Base.lproj/LaunchScreen.storyboard`

### Step 4: Build for Release
1. In Xcode: **Product → Archive**
2. Once archived, click **Distribute App**
3. Choose **App Store Connect**
4. Upload to App Store

### Step 5: Submit via App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill out app information
4. Add screenshots and descriptions
5. Submit for App Store review

## 🎨 App Assets Needed

### Icons (Create these sizes):
- **Android**: 48x48, 72x72, 96x96, 144x144, 192x192, 512x512
- **iOS**: 29x29, 40x40, 58x58, 60x60, 80x80, 87x87, 120x120, 180x180, 1024x1024

### Screenshots (Required for stores):
- **Phone**: 5.5" and 6.5" iPhone screens
- **Tablet**: iPad screenshots
- **Android**: Various screen sizes

### Store Descriptions:
- **Short description** (80 chars for Play Store)
- **Full description** (4000 chars for Play Store, unlimited for App Store)
- **Keywords** (100 chars for App Store)

## 🚀 Quick Commands Summary

```bash
# Build web app
npm run build

# Sync changes to native apps
npx cap sync

# Open native IDEs
npx cap open android    # Android Studio
npx cap open ios        # Xcode (macOS only)

# Run on devices
npx cap run android
npx cap run ios

# Check native project status
npx cap doctor
```

## 📋 Store Submission Checklist

### Before Submission:
- [ ] App builds without errors
- [ ] Tested on real devices
- [ ] All features work offline (if applicable)
- [ ] App icons and splash screens updated
- [ ] Privacy policy created (required)
- [ ] Screenshots for all required device sizes
- [ ] Store descriptions written
- [ ] Age rating determined
- [ ] Pricing set (free or paid)

### Google Play Store:
- [ ] Google Play Console account created ($25)
- [ ] App bundle (AAB) generated and signed
- [ ] Content rating questionnaire completed
- [ ] Target API level meets requirements
- [ ] App tested on multiple Android devices

### Apple App Store:
- [ ] Apple Developer account active ($99/year)
- [ ] Bundle ID matches your domain (com.groundio.app)
- [ ] App archived and uploaded via Xcode
- [ ] TestFlight testing completed
- [ ] App Store guidelines compliance verified

## 🔄 Updates Process

When you update your web app:

1. Make changes to your React code
2. Build: `npm run build`
3. Sync: `npx cap sync`
4. Test on devices
5. Generate new signed builds
6. Upload to respective stores

## 💰 Costs Summary

- **Google Play Store**: $25 one-time registration fee
- **Apple App Store**: $99/year developer account
- **Development**: Free (using your existing setup)

## 🎯 Timeline Expectations

- **Development Ready**: ✅ Complete (your app is ready!)
- **Store Setup**: 1-2 days
- **Google Play Review**: 1-3 days
- **Apple App Store Review**: 1-7 days
- **Total Time to Live**: ~1-2 weeks

Your Groundio app is **100% ready** for app store deployment! The native projects are created, and you just need to build and submit to the stores. 🚀

## 🆘 Need Help?

- **Android Issues**: Check Android Studio documentation
- **iOS Issues**: Check Xcode and Apple Developer documentation
- **Capacitor Issues**: Visit https://capacitorjs.com/docs
- **Store Policies**: Review Google Play and App Store guidelines

You're all set to get Groundio on the app stores! 🎉
