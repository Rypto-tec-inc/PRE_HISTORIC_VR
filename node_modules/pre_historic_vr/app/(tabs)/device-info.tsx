import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CREATED_DATE_KEY = 'device_created_date';

export default function DeviceInfoScreen() {
  const [connected, setConnected] = React.useState(true);
  const [createdDate, setCreatedDate] = useState('');
  const router = useRouter();

  // Get or set created date
  useEffect(() => {
    (async () => {
      let date = await SecureStore.getItemAsync(CREATED_DATE_KEY);
      if (!date) {
        date = new Date().toLocaleString();
        await SecureStore.setItemAsync(CREATED_DATE_KEY, date);
      }
      setCreatedDate(date);
    })();
  }, []);

  // Device info
  const device = {
    name: Device.modelName || 'Unknown',
    type: Device.deviceType === 1 ? 'Phone' : Device.deviceType === 2 ? 'Tablet' : 'Unknown',
    brand: Device.manufacturer || 'Unknown',
    os: Device.osName + ' ' + Device.osVersion,
    id: Device.osInternalBuildId || Device.deviceName || 'N/A',
    created: createdDate,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Device Info</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Device Card */}
        <View style={styles.deviceCard}>
          <View style={styles.deviceIconRow}>
            <View style={styles.deviceIconBox}>
              <MaterialCommunityIcons name="google-cardboard" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceDesc}>{device.type} • {device.os}</Text>
            </View>
            <Switch
              value={connected}
              onValueChange={setConnected}
              thumbColor={connected ? '#10b981' : '#444'}
              trackColor={{ false: '#333', true: '#10b981' }}
            />
          </View>
        </View>

        {/* Info Section */}
        <Text style={styles.sectionLabel}>INFO</Text>
        <View style={styles.infoCard}><Text style={styles.infoLabel}>Device name</Text><Text style={styles.infoValue}>{device.name}</Text></View>
        <View style={styles.infoCard}><Text style={styles.infoLabel}>Device Type</Text><Text style={styles.infoValue}>{device.type}</Text></View>
        <View style={styles.infoCard}><Text style={styles.infoLabel}>Device Brand</Text><Text style={styles.infoValue}>{device.brand}</Text></View>
        <View style={styles.infoCard}><Text style={styles.infoLabel}>OS</Text><Text style={styles.infoValue}>{device.os}</Text></View>
        <View style={styles.infoCard}><Text style={styles.infoLabel}>Device ID</Text><Text style={styles.infoValue}>{device.id}</Text></View>
        <View style={styles.infoCard}><Text style={styles.infoLabel}>Created Date</Text><Text style={styles.infoValue}>{device.created}</Text></View>

        {/* Action Section */}
        <Text style={styles.sectionLabel}>ACTION</Text>
        <TouchableOpacity style={styles.actionCard} onPress={() => setConnected(true)}>
          <Ionicons name="link" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.actionText}>Connect Device</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#2d1515' }]} onPress={() => setConnected(false)}>
          <Ionicons name="close-circle" size={20} color="#ef4444" style={{ marginRight: 10 }} />
          <Text style={[styles.actionText, { color: '#ef4444' }]}>Forget this device</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#232323',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Tanker',
  },
  deviceCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  deviceIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconBox: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 10,
    marginRight: 16,
  },
  deviceName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  deviceDesc: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  sectionLabel: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: 'SpaceMono-Regular',
  },
  infoCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 13,
    fontFamily: 'SpaceMono-Regular',
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Tanker',
  },
  actionCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Tanker',
  },
}); 