import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.7;

export default function CompassScreen() {
  const router = useRouter();
  const [heading, setHeading] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        
        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        // Start watching heading
        Location.watchHeadingAsync((headingData) => {
          setHeading(headingData.magHeading);
        });
      }
    })();
  }, []);

  const getDirectionName = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getDirectionColor = (degrees: number) => {
    const direction = getDirectionName(degrees);
    switch (direction) {
      case 'N': return '#ef4444'; // Red for North
      case 'E': return '#10b981'; // Green for East
      case 'S': return '#3b82f6'; // Blue for South
      case 'W': return '#f59e0b'; // Amber for West
      default: return '#8b5cf6'; // Purple for diagonal directions
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Digital Compass</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Compass Display */}
      <View style={styles.compassContainer}>
        <View style={styles.compassRing}>
          {/* Compass Rose */}
          <View style={[styles.compassRose, { transform: [{ rotate: `${-heading}deg` }] }]}>
            <View style={styles.northArrow}>
              <MaterialIcons name="navigation" size={40} color="#ef4444" />
            </View>
            <View style={styles.southArrow}>
              <MaterialIcons name="navigation" size={40} color="#3b82f6" />
            </View>
            <View style={styles.eastArrow}>
              <MaterialIcons name="navigation" size={40} color="#10b981" />
            </View>
            <View style={styles.westArrow}>
              <MaterialIcons name="navigation" size={40} color="#f59e0b" />
            </View>
            
            {/* Direction Labels */}
            <Text style={[styles.directionLabel, styles.northLabel]}>N</Text>
            <Text style={[styles.directionLabel, styles.southLabel]}>S</Text>
            <Text style={[styles.directionLabel, styles.eastLabel]}>E</Text>
            <Text style={[styles.directionLabel, styles.westLabel]}>W</Text>
          </View>
        </View>

        {/* Center Indicator */}
        <View style={styles.centerIndicator}>
          <View style={styles.centerDot} />
        </View>
      </View>

      {/* Direction Info */}
      <View style={styles.infoContainer}>
        <View style={styles.directionInfo}>
          <Text style={styles.directionText}>
            {getDirectionName(heading)}
          </Text>
          <Text style={styles.degreesText}>
            {Math.round(heading)}°
          </Text>
        </View>

        {/* Location Info */}
        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Current Location</Text>
            <Text style={styles.coordinatesText}>
              {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
            </Text>
            <Text style={styles.altitudeText}>
              Altitude: {location.coords.altitude ? `${Math.round(location.coords.altitude)}m` : 'N/A'}
            </Text>
          </View>
        )}

        {/* Permission Status */}
        {!hasPermission && (
          <View style={styles.permissionWarning}>
            <Ionicons name="warning" size={24} color="#f59e0b" />
            <Text style={styles.permissionText}>
              Location permission required for compass functionality
            </Text>
          </View>
        )}
      </View>

      {/* Navigation Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/map')}
        >
          <MaterialIcons name="map" size={24} color="#10b981" />
          <Text style={styles.actionText}>Open Map</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/libai')}
        >
          <MaterialIcons name="robot" size={24} color="#8b5cf6" />
          <Text style={styles.actionText}>Ask AI Guide</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  settingsButton: {
    padding: 8,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  compassRing: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 4,
    borderColor: '#333',
    backgroundColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassRose: {
    width: COMPASS_SIZE - 40,
    height: COMPASS_SIZE - 40,
    position: 'relative',
  },
  northArrow: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
  },
  southArrow: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
    transform: [{ rotate: '180deg' }],
  },
  eastArrow: {
    position: 'absolute',
    right: -20,
    top: '50%',
    marginTop: -20,
    transform: [{ rotate: '90deg' }],
  },
  westArrow: {
    position: 'absolute',
    left: -20,
    top: '50%',
    marginTop: -20,
    transform: [{ rotate: '-90deg' }],
  },
  directionLabel: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Tanker',
  },
  northLabel: {
    top: 10,
    alignSelf: 'center',
    color: '#ef4444',
  },
  southLabel: {
    bottom: 10,
    alignSelf: 'center',
    color: '#3b82f6',
  },
  eastLabel: {
    right: 10,
    top: '50%',
    marginTop: -10,
    color: '#10b981',
  },
  westLabel: {
    left: 10,
    top: '50%',
    marginTop: -10,
    color: '#f59e0b',
  },
  centerIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EA580C',
    borderWidth: 3,
    borderColor: '#fff',
  },
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 7,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  directionInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  directionText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 8,
  },
  degreesText: {
    color: '#aaa',
    fontSize: 18,
    fontFamily: 'SpaceMono-Regular',
  },
  locationInfo: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  locationTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 8,
  },
  coordinatesText: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    marginBottom: 4,
  },
  altitudeText: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
  },
  permissionText: {
    color: '#f59e0b',
    fontSize: 14,
    marginLeft: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
    minWidth: 100,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'SpaceMono-Regular',
  },
}); 