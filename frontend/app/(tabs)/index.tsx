import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import { useBatteryStatus } from '../../hooks/useBatteryStatus';
import { apiClient } from '../../lib/api';

export default function HomeScreen() {
  const router = useRouter();
  const { batteryLevel, isCharging, isSupported } = useBatteryStatus();
  const { user, loading } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Backend data state
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Load backend data
  const loadBackendData = async () => {
    if (!user) return;
    
    try {
      setLoadingData(true);
      const progressData = await apiClient.getUserProgress();
      setUserProgress(progressData);
    } catch (error) {
      console.error('Error loading backend data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      loadBackendData();
    }
  }, [user, loading]);

  // Refresh data periodically
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      loadBackendData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Images for the carousel
  const carouselImages = [
    require('../../assets/r_image/woman.jpg'),
    require('../../assets/r_image/VR.jpg'),
    require('../../assets/r_image/vr-african-woman2.jpg'),

  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prevSlide => {
        const nextSlide = (prevSlide + 1) % carouselImages.length;
        // Scroll to the next slide
        scrollViewRef.current?.scrollTo({
          x: nextSlide * 328, // 320 (width) + 8 (marginRight)
          animated: true,
        });
        return nextSlide;
      });
    }, 5000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Demo functions
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Welcome to Prehistoric Liberia!',
      text2: 'Your journey through ancient history begins now.',
      position: 'top',
    });
  };

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Toast.show({
      type: 'info',
      text1: 'Haptic Feedback',
      text2: 'Did you feel the vibration?',
    });
  };

  const scheduleNotification = async () => {
    // Notifications are disabled in Expo Go with SDK 53
    // To enable notifications, use a development build instead
    Toast.show({
      type: 'info',
      text1: 'Notifications Disabled',
      text2: 'Use a development build to enable notifications',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Image Carousel Banner */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const slide = Math.round(
                e.nativeEvent.contentOffset.x / 328 // 320 (width) + 8 (marginRight)
              );
              setActiveSlide(slide);
            }}
            scrollEventThrottle={16}
            style={{ width: 320 }}
          >
            {carouselImages.map((img, idx) => (
              <View key={idx} style={{ position: 'relative', width: 320, height: 180, marginRight: idx === carouselImages.length - 1 ? 0 : 8 }}>
                <Image
                  source={img}
                  style={{ width: 320, height: 180, borderRadius: 18, resizeMode: 'cover' }}
                  accessible
                  accessibilityLabel={
                    idx === 0
                      ? 'A vibrant classroom scene featuring a diverse group of Liberian students wearing VR headsets'
                      : 'Creative representation of a woman from ancient Liberia'
                  }
                />
                {/* Dark overlay filter */}
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#202020',
                    opacity: 0.4,
                    borderRadius: 18,
                  }}
                />
              </View>
            ))}
          </ScrollView>
          {/* Carousel indicators */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
            {carouselImages.map((_, idx) => (
              <View
                key={idx}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 3,
                  backgroundColor: activeSlide === idx ? '#EA580C' : '#555',
                  opacity: activeSlide === idx ? 1 : 0.5,
                }}
              />
            ))}
          </View>
        </View>



        {/* Demo Features Section */}
        {/* <Text style={styles.sectionTitle}>DEMO FEATURES</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.exploreCard} onPress={showToast}>
            <MaterialCommunityIcons name="toast" size={28} color="#8b5cf6" />
            <Text style={styles.exploreTitle}>Show Toast</Text>
            <Text style={styles.exploreSubtitle}>Test toast messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreCard} onPress={triggerHaptic}>
            <MaterialCommunityIcons name="vibrate" size={28} color="#8b5cf6" />
            <Text style={styles.exploreTitle}>Haptic Feedback</Text>
            <Text style={styles.exploreSubtitle}>Feel the vibration</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.exploreCard} onPress={scheduleNotification}>
            <MaterialCommunityIcons name="bell-ring" size={28} color="#8b5cf6" />
            <Text style={styles.exploreTitle}>Schedule Notification</Text>
            <Text style={styles.exploreSubtitle}>Get notified in 5 seconds</Text>
          </TouchableOpacity>
        </View> */}

        {/* Notifications and Device Info Row */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.exploreCard, {flex: 1, marginHorizontal: 4}]} onPress={() => router.push('/notifications')}>
            <View style={styles.notificationsIconBox}>
              <Ionicons name="notifications-outline" size={24} color="#38bdf8" />
              {/* Notification badge */}
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </View>
            <Text style={[styles.exploreTitle, {color: '#38bdf8'}]}>Notifications</Text>
            <Text style={styles.exploreSubtitle}>View your latest updates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.exploreCard, {flex: 1, marginHorizontal: 4}]} onPress={() => router.push('/device-info')}>
            <View style={styles.deviceInfoIconBox}>
              <MaterialCommunityIcons name="google-cardboard" size={24} color="#10b981" />
            </View>
            <Text style={[styles.exploreTitle, {color: '#10b981'}]}>VR Device Status</Text>
            <Text style={styles.exploreSubtitle}>Check your headset connection</Text>
          </TouchableOpacity>
        </View>

        

        {/* Your Journey Card */}
                      <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/(tabs)/profile')}>
          <View style={styles.profileIconBox}>
            <FontAwesome5 name="user-astronaut" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileTitle}>Your Journey</Text>
            <Text style={styles.profileSubtitle}>
              {loadingData ? 'Loading...' : 
                `${userProgress?.stats?.totalVisited || 0}/${userProgress?.stats?.totalMarkers || 0} Sites Explored • View your profile for achievements`
              }
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </TouchableOpacity>

        

        {/* VR Experiences Section */}
        <Text style={styles.sectionTitle}>VIRTUAL REALITY EXPERIENCES</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.exploreCard} onPress={() => router.push('/vr')}>
            <MaterialCommunityIcons name="google-cardboard" size={28} color="#38bdf8" />
            <Text style={styles.exploreTitle}>VR Museum</Text>
            <Text style={styles.exploreSubtitle}>Walk through ancient exhibits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreCard} onPress={() => Alert.alert('VR Art Gallery', 'Coming soon!')}>
            <MaterialCommunityIcons name="image-multiple" size={28} color="#38bdf8" />
            <Text style={styles.exploreTitle}>VR Art Gallery</Text>
            <Text style={styles.exploreSubtitle}>3D tribal paintings</Text>
          </TouchableOpacity>
        </View>

        {/* Ancient Cultures Section */}
        <Text style={styles.sectionTitle}>ANCIENT CULTURES</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.exploreCard} onPress={() => router.push('/languages')}>
            <MaterialCommunityIcons name="alphabetical-variant" size={28} color="#EA580C" />
            <Text style={styles.exploreTitle}>Languages</Text>
            <Text style={styles.exploreSubtitle}>Ancient tribal dialects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreCard} onPress={() => router.push('/(tabs)/community')}>
            <MaterialCommunityIcons name="account-group" size={28} color="#EA580C" />
            <Text style={styles.exploreTitle}>Community</Text>
            <Text style={styles.exploreSubtitle}>Join tribes & share</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.exploreCard} onPress={() => Alert.alert('Tribes', 'Coming soon!')}>
            <MaterialCommunityIcons name="account-group" size={28} color="#EA580C" />
            <Text style={styles.exploreTitle}>Tribes</Text>
            <Text style={styles.exploreSubtitle}>Early ethnic groups</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreCard} onPress={() => router.push('/books')}>
            <MaterialCommunityIcons name="book-open-variant" size={28} color="#EA580C" />
            <Text style={styles.exploreTitle}>Books</Text>
            <Text style={styles.exploreSubtitle}>Ancient texts & stories</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.exploreCard} onPress={() => Alert.alert('Spiritual Life', 'Coming soon!')}>
            <MaterialCommunityIcons name="crystal-ball" size={28} color="#EA580C" />
            <Text style={styles.exploreTitle}>Spiritual Life</Text>
            <Text style={styles.exploreSubtitle}>Ancient beliefs & rituals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreCard} onPress={() => Alert.alert('Sacred Masks', 'Coming soon!')}>
            <MaterialCommunityIcons name="face-man" size={28} color="#EA580C" />
            <Text style={styles.exploreTitle}>Sacred Masks</Text>
            <Text style={styles.exploreSubtitle}>3D mask exploration</Text>
          </TouchableOpacity>
        </View>

        {/* Community Section */}
        <Text style={styles.sectionTitle}>JOIN THE COMMUNITY</Text>
        <TouchableOpacity style={styles.communitySectionCard} onPress={() => router.push('/(tabs)/community')}>
          <View style={styles.communitySectionContent}>
            <MaterialCommunityIcons name="account-group" size={32} color="#EA580C" />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.communitySectionTitle}>Connect with Tribes</Text>
              <Text style={styles.communitySectionSubtitle}>Share experiences, join discussions, and discover ancient traditions with fellow explorers</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#EA580C" />
          </View>
        </TouchableOpacity>

        {/* Artifacts & Sites Section */}
        <Text style={styles.sectionTitle}>ARTIFACTS & ARCHAEOLOGICAL SITES</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.exploreCard} onPress={() => Alert.alert('Rock Art', 'Coming soon!')}>
            <MaterialCommunityIcons name="image-filter-hdr" size={28} color="#fff" />
            <Text style={styles.exploreTitle}>Rock Art</Text>
            <Text style={styles.exploreSubtitle}>Ancient cave paintings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreCard} onPress={() => Alert.alert('Stone Tools', 'Coming soon!')}>
            <MaterialCommunityIcons name="hammer-screwdriver" size={28} color="#fff" />
            <Text style={styles.exploreTitle}>Stone Tools</Text>
            <Text style={styles.exploreSubtitle}>Prehistoric technology</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.exploreCard} onPress={() => Alert.alert('Pottery', 'Coming soon!')}>
            <MaterialCommunityIcons name="pot" size={28} color="#fff" />
            <Text style={styles.exploreTitle}>Pottery</Text>
            <Text style={styles.exploreSubtitle}>Ancient ceramics</Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Map Section */}
        <Text style={styles.sectionTitle}>EXPLORE THE LAND</Text>
        <TouchableOpacity style={styles.mapCard} onPress={() => router.push('/map')}>
          <View style={styles.mapContent}>
            <Ionicons name="map" size={32} color="#10b981" />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.mapTitle}>Interactive Map</Text>
              <Text style={styles.mapSubtitle}>Discover tribes, sites, and stories across Liberia</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#10b981" />
          </View>
        </TouchableOpacity>

        {/* Compass Section */}
        <TouchableOpacity style={styles.compassCard} onPress={() => router.push('/compass')}>
          <View style={styles.compassContent}>
            <MaterialCommunityIcons name="compass" size={32} color="#f59e0b" />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.compassTitle}>Digital Compass</Text>
              <Text style={styles.compassSubtitle}>Navigate to archaeological sites with precision</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#f59e0b" />
          </View>
        </TouchableOpacity>

        {/* AI Assistant Section */}
        <Text style={styles.sectionTitle}>YOUR GUIDE</Text>
        <TouchableOpacity style={styles.aiCard} onPress={() => router.push('/libai')}>
          <View style={styles.aiContent}>
            <MaterialCommunityIcons name="robot" size={32} color="#8b5cf6" />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.aiTitle}>Mis Nova</Text>
              <Text style={styles.aiSubtitle}>Your celestial guide to ancient Liberia</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8b5cf6" />
          </View>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 0, // now zero
    paddingBottom: 8,
    backgroundColor: '#191919',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  topBarCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    minWidth: 0,
  },
  flag: {
    width: 28,
    height: 18,
    marginRight: 6,
    resizeMode: 'contain',
  },
  logo: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  welcome: {
    color: '#aaa',
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: 'SpaceMono-Regular',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginTop: 2,
  },
  titleSmall: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    textAlign: 'center',
    flexShrink: 1,
  },
  menuButton: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 6,
  },
  notificationButton: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 6,
    marginRight: 6,
  },
  batteryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
  },
  batteryText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'SpaceMono-Regular',
    marginLeft: 3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    marginTop: 2,
  },
  profileIconBox: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 10,
    marginRight: 16,
  },
  profileTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  profileSubtitle: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: 'SpaceMono-Regular',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exploreCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    marginHorizontal: 4,
    minWidth: 120,
  },
  exploreTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
    fontFamily: 'Tanker',
    textAlign: 'center',
  },
  exploreSubtitle: {
    color: '#aaa',
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  mapCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  mapContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  mapSubtitle: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    marginTop: 2,
  },
  aiCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  aiSubtitle: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    marginTop: 2,
  },
  deviceInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 2,
    marginHorizontal: 16,
  },
  deviceInfoIconBox: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 8,
    marginRight: 16,
  },
  deviceInfoTitle: {
    color: '#10b981',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  deviceInfoSubtitle: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  notificationsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 2,
    marginHorizontal: 16,
  },
  notificationsIconBox: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 8,
    marginRight: 16,
  },
  notificationsTitle: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  notificationsSubtitle: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  compassCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  compassContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compassTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  compassSubtitle: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    marginTop: 2,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 2,
    marginHorizontal: 16,
  },
  communityIconBox: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 8,
    marginRight: 16,
  },
  communityTitle: {
    color: '#EA580C',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  communitySubtitle: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  communitySectionCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  communitySectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communitySectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  communitySectionSubtitle: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    marginTop: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EA580C',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  achievementsScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  achievementCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  achievementIconBox: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  achievementTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementPoints: {
    color: '#EA580C',
    fontSize: 10,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
  },
  noAchievementsCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  noAchievementsText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Tanker',
    textAlign: 'center',
    marginTop: 8,
  },
  noAchievementsSubtext: {
    color: '#555',
    fontSize: 10,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  viewAllAchievementsCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#EA580C',
  },
  viewAllText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    textAlign: 'center',
    marginTop: 8,
  },
  viewAllSubtext: {
    color: '#aaa',
    fontSize: 10,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  progressStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  progressStatCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  progressStatNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginTop: 8,
  },
  progressStatLabel: {
    color: '#aaa',
    fontSize: 10,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
}); 