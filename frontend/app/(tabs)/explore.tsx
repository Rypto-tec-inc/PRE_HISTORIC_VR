import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const exploreCategories = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'culture', name: 'Culture', icon: 'people' },
    { id: 'history', name: 'History', icon: 'book' },
    { id: 'geography', name: 'Geography', icon: 'map' },
  ];

  const exploreItems = [
    {
      id: 'about',
      title: 'About Liberia',
      subtitle: 'Discover the rich history and culture',
      icon: 'information-circle',
      color: '#EA580C',
      category: 'culture',
      image: require('../../assets/r_image/vecteezy_liberia-flags-design-vector_13365953.jpg'),
      route: 'about'
    },
    {
      id: 'map',
      title: 'Interactive Map',
      subtitle: 'Explore tribes and regions',
      icon: 'map',
      color: '#059669',
      category: 'geography',
      image: require('../../assets/r_image/culture.jpg'),
      route: 'map'
    },
    {
      id: 'community',
      title: 'Community',
      subtitle: 'Connect with other learners',
      icon: 'people-circle',
      color: '#7C3AED',
      category: 'culture',
      image: require('../../assets/r_image/art_work.jpeg'),
      route: 'community'
    },
    {
      id: 'achievements',
      title: 'Achievements',
      subtitle: 'Track your learning progress',
      icon: 'trophy',
      color: '#DC2626',
      category: 'culture',
      image: require('../../assets/r_image/download.jpeg'),
      route: 'achievements'
    },
    {
      id: 'libai',
      title: 'AI Assistant',
      subtitle: 'Get help with your questions',
      icon: 'chatbubble-ellipses',
      color: '#0891B2',
      category: 'culture',
      image: require('../../assets/r_image/Flux_Dev_A_realistic_and_immersive_VR_experience_where_modern__0.jpg'),
      route: 'libai'
    },
    {
      id: 'books',
      title: 'Digital Library',
      subtitle: 'Access cultural resources',
      icon: 'library',
      color: '#B45309',
      category: 'history',
      image: require('../../assets/r_image/Basotho SOTC ARCHIVES CULTURE UPGRADE.jpeg'),
      route: 'books'
    },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? exploreItems 
    : exploreItems.filter(item => item.category === selectedCategory);

  const handleItemPress = (route: string) => {
    if (route === 'about') {
      router.push('/(tabs)/about');
    } else if (route === 'map') {
      router.push('/(tabs)/map');
    } else if (route === 'community') {
      router.push('/(tabs)/community');
    } else if (route === 'achievements') {
      router.push('/(tabs)/achievements');
    } else if (route === 'libai') {
      router.push('/(tabs)/libai');
    } else if (route === 'books') {
      router.push('/books');
    }
  };

  const renderExploreCard = (item: any) => (
    <TouchableOpacity 
      key={item.id}
      style={[styles.card, { backgroundColor: item.color }]} 
      onPress={() => handleItemPress(item.route)} 
      activeOpacity={0.8}
    >
      {item.image && (
        <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
      )}
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Ionicons name={item.icon as any} size={24} color="#fff" />
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Liberia</Text>
        <Text style={styles.subtitle}>Discover the rich culture and history</Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {exploreCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon as any} 
              size={16} 
              color={selectedCategory === category.id ? '#EA580C' : '#666'} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Explore Items Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              {renderExploreCard(item)}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151515',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  categoryButtonActive: {
    backgroundColor: '#EA580C',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  gridItem: {
    width: (screenWidth - 60) / 2,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#f0f0f0',
    marginTop: 4,
  },
}); 