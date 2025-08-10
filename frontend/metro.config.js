const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for TensorFlow.js
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-fs': 'react-native-fs',
  'expo-camera': 'expo-camera',
};

// Add resolver configuration to handle TensorFlow dependencies
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.sourceExts = ['js', 'json', 'ts', 'tsx', 'jsx'];

// Add transformer configuration
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_fnames: true,
};

module.exports = withNativeWind(config, { input: './global.css' }); 