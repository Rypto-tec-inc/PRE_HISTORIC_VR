import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const [tab, setTab] = useState('Overview');
  // Example data for Prehistoric Liberia
  const info = {
    title: 'Prehistoric Liberia',
    location: 'Liberia, West Africa',
    badge: 'Free',
    duration: 'All Ages',
    temp: 'VR/3D',
    rating: '5.0',
    image: require('../../assets/r_image/PREHISTORIC-LIBERIA.png'),
    overview: `Prehistoric Liberia is a digital museum and immersive VR experience that brings to life the untold stories, artifacts, and ancient cultures of Liberia. Explore 3D-scanned artifacts, virtual villages, sacred masks, and interactive timelines—all in a modern, accessible way.`,
    details: `• 3D Artifacts & Masks\n• VR Museum & Villages\n• Ancient Languages & Tribes\n• Interactive Map & Timelines\n• Audio Tours & Stories\n• For students, educators, and explorers!`,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Image Card with Overlay */}
        <View style={styles.imageCard}>
          <Image source={info.image} style={styles.image} resizeMode="cover" />
          {/* Overlay */}
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.overlayBtn} onPress={() => {}}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.overlayBtn} onPress={() => {}}>
              <Ionicons name="bookmark-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Title Overlay */}
          <View style={styles.infoOverlay}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{info.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="location-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.location}>{info.location}</Text>
              </View>
            </View>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>{info.badge}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => setTab('Overview')} style={[styles.tabBtn, tab === 'Overview' && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === 'Overview' && styles.tabTextActive]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('Details')} style={[styles.tabBtn, tab === 'Details' && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === 'Details' && styles.tabTextActive]}>Details</Text>
          </TouchableOpacity>
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={18} color="#aaa" />
            <Text style={styles.infoItemText}>{info.duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="virtual-reality" size={18} color="#aaa" />
            <Text style={styles.infoItemText}>{info.temp}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome5 name="star" size={16} color="#fbbf24" />
            <Text style={styles.infoItemText}>{info.rating}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descBox}>
          <Text style={styles.descText}>{tab === 'Overview' ? info.overview : info.details}</Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Explore Now</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 22,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: '#232323',
  },
  tabText: {
    color: '#aaa',
    fontSize: 15,
    fontFamily: 'SpaceMono-Regular',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 28,
    marginBottom: 10,
    marginTop: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 2,
  },
  infoItemText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
    fontFamily: 'SpaceMono-Regular',
  },
  descBox: {
    backgroundColor: '#232323',
    borderRadius: 16,
    marginHorizontal: 18,
    padding: 18,
    marginBottom: 18,
    marginTop: 6,
  },
  descText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'SpaceMono-Regular',
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#232323',
    borderRadius: 16,
    marginHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 24,
    marginTop: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
}); 