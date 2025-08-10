import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
// Database functions removed since backend is deleted
// import { getUserFavorites, getUserProgress } from '../../lib/database';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const loadAchievements = async () => {
    try {
      // Mock user data since backend is removed
      const progress: any[] = [];
      const favorites: any[] = [];
      
      const visitedCount = progress.filter((p: any) => p.visited).length;
      const completedCount = progress.filter((p: any) => p.completed).length;
      const favoritesCount = favorites.length;
      // Define achievements
      const allAchievements: Achievement[] = [
        {
          id: 'first_visit',
          title: 'First Steps',
          description: 'Visit your first location',
          icon: 'footsteps',
          type: 'bronze',
          unlocked: visitedCount >= 1,
          progress: Math.min(visitedCount, 1),
          maxProgress: 1,
        },
        {
          id: 'explorer',
          title: 'Explorer',
          description: 'Visit 3 different locations',
          icon: 'map',
          type: 'silver',
          unlocked: visitedCount >= 3,
          progress: Math.min(visitedCount, 3),
          maxProgress: 3,
        },
        {
          id: 'master_explorer',
          title: 'Master Explorer',
          description: 'Visit all 5 locations',
          icon: 'compass',
          type: 'gold',
          unlocked: visitedCount >= 5,
          progress: Math.min(visitedCount, 5),
          maxProgress: 5,
        },
        {
          id: 'completionist',
          title: 'Completionist',
          description: 'Complete all locations',
          icon: 'trophy',
          type: 'platinum',
          unlocked: completedCount >= 5,
          progress: Math.min(completedCount, 5),
          maxProgress: 5,
        },
        {
          id: 'collector',
          title: 'Collector',
          description: 'Add 3 locations to favorites',
          icon: 'heart',
          type: 'silver',
          unlocked: favoritesCount >= 3,
          progress: Math.min(favoritesCount, 3),
          maxProgress: 3,
        },
        {
          id: 'vr_pioneer',
          title: 'VR Pioneer',
          description: 'Experience your first VR session',
          icon: 'virtual-reality',
          type: 'bronze',
          unlocked: false, // This would be set based on VR usage
          progress: 0,
          maxProgress: 1,
        },
        {
          id: 'audio_enthusiast',
          title: 'Audio Enthusiast',
          description: 'Listen to all audio tours',
          icon: 'headset',
          type: 'silver',
          unlocked: false, // This would be set based on audio completion
          progress: 0,
          maxProgress: 3,
        },
        {
          id: 'history_buff',
          title: 'History Buff',
          description: 'Learn about all historical events',
          icon: 'book-open',
          type: 'gold',
          unlocked: false, // This would be set based on event completion
          progress: 0,
          maxProgress: 2,
        },
      ];

      setAchievements(allAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
      Alert.alert('Error', 'Failed to load achievements');
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    loadAchievements();
  }, [user, loading]);

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'footsteps':
        return <Ionicons name="footsteps" size={32} color="#EA580C" />;
      case 'map':
        return <Ionicons name="map" size={32} color="#EA580C" />;
      case 'compass':
        return <Ionicons name="compass" size={32} color="#EA580C" />;
      case 'trophy':
        return <Ionicons name="trophy" size={32} color="#EA580C" />;
      case 'heart':
        return <Ionicons name="heart" size={32} color="#EA580C" />;
      case 'virtual-reality':
        return <MaterialCommunityIcons name="virtual-reality" size={32} color="#EA580C" />;
      case 'headset':
        return <Ionicons name="headset" size={32} color="#EA580C" />;
      case 'book-open':
        return <Ionicons name="library" size={32} color="#EA580C" />;
      default:
        return <Ionicons name="star" size={32} color="#EA580C" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      case 'platinum':
        return '#E5E4E2';
      default:
        return '#EA580C';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>Please Sign In</Text>
          <Text style={styles.subtitle}>Sign in to view your achievements</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>Track your progress and unlock badges</Text>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Progress</Text>
            <Text style={styles.progressCount}>{unlockedCount}/{totalCount}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(unlockedCount / totalCount) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round((unlockedCount / totalCount) * 100)}% Complete
            </Text>
          </View>
        </View>

        {/* Achievements Grid */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Your Achievements</Text>
          
          {achievements.map((achievement) => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementLocked
              ]}
            >
              <View style={styles.achievementHeader}>
                <View style={styles.achievementIcon}>
                  {getAchievementIcon(achievement.icon)}
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                <View style={[
                  styles.achievementBadge,
                  { backgroundColor: getTypeColor(achievement.type) }
                ]}>
                  <Text style={styles.achievementType}>{achievement.type.toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={styles.achievementProgress}>
                <View style={styles.progressBarSmall}>
                  <View 
                    style={[
                      styles.progressFillSmall, 
                      { 
                        width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                        backgroundColor: achievement.unlocked ? getTypeColor(achievement.type) : '#666'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressTextSmall}>
                  {achievement.progress}/{achievement.maxProgress}
                </Text>
              </View>
              
              {achievement.unlocked && (
                <View style={styles.unlockedIndicator}>
                  <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                  <Text style={styles.unlockedText}>Unlocked!</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Keep Exploring!</Text>
          <Text style={styles.ctaText}>
            Visit more locations and complete experiences to unlock more achievements
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton} 
            onPress={() => router.push('/(tabs)/map')}
          >
            <Text style={styles.ctaButtonText}>Explore Map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'Tanker',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
  },
  button: {
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tanker',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
    fontFamily: 'SpaceMono-Regular',
  },
  progressCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EA580C',
    marginBottom: 12,
    fontFamily: 'Tanker',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'SpaceMono-Regular',
  },
  achievementsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'Tanker',
  },
  achievementCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'Tanker',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'SpaceMono-Regular',
  },
  achievementBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  achievementType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'SpaceMono-Regular',
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarSmall: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 2,
  },
  progressTextSmall: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'SpaceMono-Regular',
  },
  unlockedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedText: {
    fontSize: 12,
    color: '#16a34a',
    marginLeft: 4,
    fontWeight: '600',
    fontFamily: 'SpaceMono-Regular',
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'Tanker',
  },
  ctaText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'SpaceMono-Regular',
  },
  ctaButton: {
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tanker',
  },
}); 