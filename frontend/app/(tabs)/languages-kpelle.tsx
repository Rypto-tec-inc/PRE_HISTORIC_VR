import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function KpelleLanguagePage() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Image Card with Overlay */}
        <View style={styles.imageCard}>
          <Image source={require('../../assets/r_image/PREHISTORIC-LIBERIA.png')} style={styles.image} resizeMode="cover" />
          {/* Overlay */}
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.overlayBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.overlayBtn}>
              <Ionicons name="bookmark-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Title Overlay */}
          <View style={styles.infoOverlay}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Kpelle Language</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="location-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.location}>Liberia, West Africa</Text>
              </View>
            </View>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>Free</Text>
            </View>
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <MaterialCommunityIcons name="alpha-k-box-outline" size={22} color="#EA580C" />
          </View>
          <Text style={styles.overviewText}>
            The Kpelle are the largest ethnic group in Liberia, with a rich cultural heritage that spans generations. Their language is deeply connected to traditional farming practices, community governance, and spiritual beliefs. Discover the Kpelle language and explore how this influential tribe has shaped Liberia's cultural and social landscape.
          </Text>
        </View>
      </ScrollView>
      {/* Learn Now Button */}
      <TouchableOpacity style={styles.learnButton} onPress={() => {}}>
        <Text style={styles.learnButtonText}>Learn Now</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  imageCard: {
    margin: 18,
    marginBottom: 12,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#232323',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  image: {
    width: '100%',
    height: 210,
    borderRadius: 24,
  },
  overlay: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    zIndex: 2,
  },
  overlayBtn: {
    backgroundColor: 'rgba(30,30,30,0.7)',
    borderRadius: 16,
    padding: 7,
  },
  infoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20,20,20,0.85)',
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 2,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  location: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'SpaceMono-Regular',
  },
  badgeBox: {
    backgroundColor: '#232323',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  badgeText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Tanker',
  },
  section: {
    marginHorizontal: 18,
    marginTop: 10,
    backgroundColor: '#232323',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginRight: 8,
  },
  overviewText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
    lineHeight: 20,
  },
  learnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    borderRadius: 16,
    margin: 18,
    paddingVertical: 16,
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  learnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginRight: 4,
  },
}); 