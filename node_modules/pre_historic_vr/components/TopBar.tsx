import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useBatteryStatus } from '../hooks/useBatteryStatus';

export default function TopBar() {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { batteryLevel, isCharging, isSupported } = useBatteryStatus();

  // Hide TopBar on onboarding and splash screens only
  const isOnboarding = segments[0] === 'onboarding';
  const isSplash = segments[0] === 'splash';
  
  if (isOnboarding || isSplash) {
    return null;
  }

  const getBatteryIcon = () => {
    if (!isSupported || batteryLevel === null) {
      return 'battery-half';
    }
    
    if (isCharging) {
      return 'battery-charging';
    }
    
    if (batteryLevel <= 0.2) {
      return 'battery-dead';
    } else if (batteryLevel <= 0.6) {
      return 'battery-half';
    } else {
      return 'battery-full';
    }
  };

  const getBatteryColor = () => {
    if (!isSupported || batteryLevel === null) {
      return '#666';
    }
    
    if (isCharging) {
      return '#4CAF50';
    }
    
    if (batteryLevel <= 0.2) {
      return '#F44336';
    } else if (batteryLevel <= 0.4) {
      return '#FF9800';
    } else {
      return '#4CAF50';
    }
  };

  // Simulate RAM usage (you can replace this with actual RAM monitoring)
  const ramUsage = Math.floor(Math.random() * 40) + 60; // 60-100%
  const getRamColor = () => {
    if (ramUsage >= 90) return '#F44336';
    if (ramUsage >= 75) return '#FF9800';
    return '#4CAF50';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <TouchableOpacity 
            style={styles.logoContainer}
            onPress={() => router.push('/(tabs)')}
          >
            <Image 
              source={require('../assets/auth_image/PREHISTORIC-LIBERIA-removebg-preview.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.centerSection}>
          <View style={styles.statusBar}>
            <View style={styles.statusItem}>
              <Ionicons name="hardware-chip" size={16} color={getRamColor()} />
              <Text style={styles.statusText}>{ramUsage}%</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Ionicons name={getBatteryIcon()} size={16} color={getBatteryColor()} />
              <Text style={styles.statusText}>
                {batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          {user ? (
            <>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => router.push('/(tabs)/notifications')}
              >
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.avatarButton}
                onPress={() => router.push('/(tabs)/profile')}
              >
                {user.avatar ? (
                  <View style={styles.avatarImage}>
                    <Text style={styles.avatarText}>
                      {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                ) : (
                  <Ionicons name="person-circle-outline" size={32} color="#EA580C" />
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191919',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatarButton: {
    padding: 4,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#EA580C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Tanker',
  },
}); 