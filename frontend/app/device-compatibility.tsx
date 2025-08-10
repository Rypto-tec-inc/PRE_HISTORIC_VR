import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Sensors from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeviceCompatibility() {
  const [loading, setLoading] = useState(true);
  const [gyro, setGyro] = useState(false);
  const [accel, setAccel] = useState(false);
  const [compatible, setCompatible] = useState(false);

  useEffect(() => {
    async function checkSensors() {
      let gyroAvailable = false;
      let accelAvailable = false;
      try {
        gyroAvailable = await Sensors.Gyroscope.isAvailableAsync();
        accelAvailable = await Sensors.Accelerometer.isAvailableAsync();
      } catch {}
      setGyro(gyroAvailable);
      setAccel(accelAvailable);
      setCompatible(gyroAvailable && accelAvailable);
      setLoading(false);
    }
    checkSensors();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#191919' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Device Compatibility</Text>
      </View>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#EA580C" />
        ) : (
          <>
            <View style={styles.resultRow}>
              <Ionicons name="phone-portrait-outline" size={28} color="#EA580C" style={{ marginRight: 12 }} />
              <Text style={styles.resultText}>Device: <Text style={{ color: '#fff' }}>{Device.modelName || 'Unknown'}</Text></Text>
            </View>
            <View style={styles.resultRow}>
              <MaterialIcons name="screen-rotation" size={28} color={gyro ? '#16a34a' : '#dc2626'} style={{ marginRight: 12 }} />
              <Text style={styles.resultText}>Gyroscope: <Text style={{ color: gyro ? '#16a34a' : '#dc2626' }}>{gyro ? 'Available' : 'Not Available'}</Text></Text>
            </View>
            <View style={styles.resultRow}>
              <MaterialIcons name="directions-run" size={28} color={accel ? '#16a34a' : '#dc2626'} style={{ marginRight: 12 }} />
              <Text style={styles.resultText}>Accelerometer: <Text style={{ color: accel ? '#16a34a' : '#dc2626' }}>{accel ? 'Available' : 'Not Available'}</Text></Text>
            </View>
            <View style={[styles.compatBox, { backgroundColor: compatible ? '#16a34a' : '#dc2626' }] }>
              <Text style={styles.compatText}>{compatible ? 'Your device is compatible with Prehistoric VR!' : 'Sorry, your device is not fully compatible.'}</Text>
            </View>
            <Text style={styles.note}>* VR features require a device with a gyroscope and accelerometer.</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 32,
    paddingBottom: 18,
    backgroundColor: '#191919',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#232323',
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontFamily: 'Tanker',
    fontSize: 24,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  resultText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Tanker',
  },
  compatBox: {
    marginTop: 30,
    marginBottom: 16,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  compatText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Tanker',
    textAlign: 'center',
  },
  note: {
    color: '#EA580C',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Tanker',
  },
}); 