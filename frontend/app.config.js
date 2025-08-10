export default {
  expo: {
    name: "Prehistoric Liberia VR",
    slug: "prehistoric-liberia-vr",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "prehistoricliberia",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#191919"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.prehistoricliberia.vr"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#191919"
      },
      package: "com.prehistoricliberia.vr"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-haptics",
      "expo-speech",
      "expo-location",
      "expo-battery",
      "expo-device",
      "expo-notifications",
      "expo-file-system",
      "expo-media-library",
      "expo-camera",
      "expo-image-picker",
      "expo-av",
      "expo-sensors"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // API Configuration
      API_URL: process.env.API_URL || "http://localhost:3000/api",
      API_TIMEOUT: 30000,
      
      // Feature Flags
      ENABLE_AI_FEATURES: true,
      ENABLE_VR_FEATURES: true,
      ENABLE_ANALYTICS: true,
      ENABLE_NOTIFICATIONS: true,
      
      // App Configuration
      DEFAULT_LANGUAGE: "English",
      SUPPORTED_LANGUAGES: ["English", "French", "Bassa", "Kpelle"],
      
      // VR Configuration
      VR_PLATFORMS: ["WebVR", "Oculus", "HTC Vive", "Mobile VR"],
      VR_ASSETS_PATH: "./assets/vr/",
      
      // Cultural Content
      LIBERIAN_TRIBES: [
        "Bassa", "Kpelle", "Gio", "Mano", "Grebo", "Krahn", "Vai", "Mandingo",
        "Lorma", "Kissi", "Gola", "Gbandi", "Mende", "Dei", "Belleh", "Kru"
      ],
      
      LIBERIAN_COUNTIES: [
        "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount", "Grand Gedeh",
        "Grand Kru", "Lofa", "Margibi", "Maryland", "Montserrado", "Nimba",
        "River Cess", "River Gee", "Sinoe"
      ],
      
      // Development
      ENABLE_DEBUG_MODE: process.env.NODE_ENV === "development",
      ENABLE_MOCK_DATA: process.env.NODE_ENV === "development",
      
      // Analytics
      ANALYTICS_ENABLED: true,
      CRASH_REPORTING: true,
      
      // Security
      ENABLE_SSL_PINNING: false,
      ENABLE_BIOMETRIC_AUTH: true,
      
      // Performance
      ENABLE_OFFLINE_MODE: true,
      CACHE_DURATION: 86400, // 24 hours
      
      // Social Features
      ENABLE_COMMUNITY: true,
      ENABLE_SHARING: true,
      ENABLE_COMMENTS: true,
      
      // Educational Features
      ENABLE_QUIZZES: true,
      ENABLE_PROGRESS_TRACKING: true,
      ENABLE_CERTIFICATES: true,
      
      // Accessibility
      ENABLE_VOICE_NAVIGATION: true,
      ENABLE_HIGH_CONTRAST: true,
      ENABLE_LARGE_TEXT: true
    }
  }
}; 