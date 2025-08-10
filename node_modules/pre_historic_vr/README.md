# PRE_HISTORIC_VR Frontend

## Overview
React Native/Expo frontend for the Prehistoric Liberia VR application, providing an immersive cultural learning experience.

## Features
- Cultural exploration and learning
- VR experiences
- Language learning
- Achievement system
- User profiles and progress tracking
- Offline support

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npx expo start
   ```

3. Run on device/simulator:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## Project Structure

```
app/
├── (tabs)/          # Main tab navigation
├── auth/            # Authentication screens
├── onboarding.tsx   # User onboarding
├── welcome.tsx      # Welcome screen
└── splash.tsx       # Splash screen
```

## Configuration

Edit `app.config.js` to configure:
- API endpoints
- Feature flags
- Cultural content
- VR settings

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
