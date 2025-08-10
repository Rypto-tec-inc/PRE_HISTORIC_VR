import Constants from 'expo-constants';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  // Get version from expoConfig (new), manifest (old), or fallback
  const version =
    Constants.expoConfig?.version ||
    Constants.manifest?.version ||
    '1.0.0';

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Image
          source={require('../assets/auth_image/PREHISTORIC-LIBERIA-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomContent}>
        <Text style={styles.appName}>Prehistoric Liberia VR</Text>
        <Text style={styles.version}>Version {version}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
  },
  bottomContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  version: {
    color: '#888',
    fontSize: 12,
  },
}); 