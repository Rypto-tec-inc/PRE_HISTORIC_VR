import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const IMAGES = [
  require('../assets/tribe_art/culture.jpg'),
  require('../assets/tribe_art/bassa art.png'),
  require('../assets/r_image/tmpdby_bnr4.png'),
  
];

export default function Welcome() {
  const router = useRouter();
  const [imgIdx, setImgIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-change image with fade
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setImgIdx((prev) => (prev + 1) % IMAGES.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={{ flex: 1, backgroundColor: '#151515' }}>
      {/* Animated background image only */}
      <View style={styles.bg}>
        <Animated.Image
          source={IMAGES[imgIdx]}
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', opacity: fadeAnim }]}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        
        <View style={styles.content}>
          <Text style={styles.title}>
            Step Into Prehistoric Liberia
          </Text>
          <Text style={styles.subtitle}>
            Discover ancient cultures, artifacts, languages, and the story of our ancestors.
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)')} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21,21,21,0.60)', // Match app dark theme
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 120,
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    fontFamily: 'Tanker',
  },
  subtitle: {
    color: '#f3f3f3',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
    fontFamily: 'Tanker',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#EA580C', // App orange accent
    borderRadius: 14,
    paddingVertical: 16,
    width: '88%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
}); 