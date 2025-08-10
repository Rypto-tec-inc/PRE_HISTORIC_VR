import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: any;
  category: 'history' | 'mythology' | 'culture' | 'archaeology' | 'language';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pages: number;
  language: string;
  tribe: string;
  isAvailable: boolean;
  rating: number;
  readCount: number;
}

export default function BooksScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample books data
  const books: Book[] = [
    {
      id: '1',
      title: 'The Ancient Tribes of Liberia',
      author: 'Dr. Sarah Johnson',
      description: 'A comprehensive study of the early ethnic groups that inhabited the region now known as Liberia, their customs, and their way of life.',
      coverImage: require('../assets/r_image/PREHISTORIC-LIBERIA.png'),
      category: 'history',
      difficulty: 'intermediate',
      pages: 245,
      language: 'English',
      tribe: 'Multiple',
      isAvailable: true,
      rating: 4.5,
      readCount: 1234
    },
    {
      id: '2',
      title: 'Myths and Legends of the Kru People',
      author: 'Chief Kofi Mensah',
      description: 'Traditional stories passed down through generations, featuring heroes, spirits, and the origins of the Kru people.',
      coverImage: require('../assets/r_image/PREHISTORIC-LIBERIA.png'),
      category: 'mythology',
      difficulty: 'beginner',
      pages: 156,
      language: 'English',
      tribe: 'Kru',
      isAvailable: true,
      rating: 4.8,
      readCount: 892
    },
    {
      id: '3',
      title: 'Archaeological Discoveries in Coastal Liberia',
      author: 'Prof. Michael Brown',
      description: 'Recent findings from archaeological excavations along the Liberian coast, revealing ancient settlements and artifacts.',
      coverImage: require('../assets/r_image/PREHISTORIC-LIBERIA.png'),
      category: 'archaeology',
      difficulty: 'advanced',
      pages: 312,
      language: 'English',
      tribe: 'N/A',
      isAvailable: true,
      rating: 4.2,
      readCount: 567
    },
    {
      id: '4',
      title: 'Traditional Liberian Languages',
      author: 'Dr. Amina Diallo',
      description: 'A linguistic study of the various tribal languages spoken in ancient Liberia, including grammar and vocabulary.',
      coverImage: require('../assets/r_image/PREHISTORIC-LIBERIA.png'),
      category: 'language',
      difficulty: 'intermediate',
      pages: 198,
      language: 'English',
      tribe: 'Multiple',
      isAvailable: true,
      rating: 4.6,
      readCount: 745
    },
    {
      id: '5',
      title: 'Sacred Rituals of the Bassa People',
      author: 'Elder Grace Williams',
      description: 'An intimate look at the spiritual practices and ceremonies of the Bassa tribe, including initiation rites and healing rituals.',
      coverImage: require('../assets/r_image/PREHISTORIC-LIBERIA.png'),
      category: 'culture',
      difficulty: 'beginner',
      pages: 134,
      language: 'English',
      tribe: 'Bassa',
      isAvailable: true,
      rating: 4.7,
      readCount: 1023
    },
    {
      id: '6',
      title: 'Ancient Pottery Techniques',
      author: 'Master Potter James Kollie',
      description: 'A detailed guide to traditional pottery-making methods used by ancient Liberian craftspeople.',
      coverImage: require('../assets/r_image/PREHISTORIC-LIBERIA.png'),
      category: 'culture',
      difficulty: 'intermediate',
      pages: 178,
      language: 'English',
      tribe: 'Multiple',
      isAvailable: true,
      rating: 4.4,
      readCount: 634
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'book-open-variant' },
    { id: 'history', name: 'History', icon: 'history' },
    { id: 'mythology', name: 'Mythology', icon: 'crystal-ball' },
    { id: 'culture', name: 'Culture', icon: 'account-group' },
    { id: 'archaeology', name: 'Archaeology', icon: 'hammer-screwdriver' },
    { id: 'language', name: 'Language', icon: 'alphabetical-variant' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || book.difficulty === selectedDifficulty;
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleBookPress = (book: Book) => {
    Alert.alert(
      book.title,
      `Would you like to read "${book.title}" by ${book.author}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Read Now', 
          onPress: () => {
            // TODO: Implement book reading functionality
            Alert.alert('Coming Soon', 'Book reading feature will be available soon!');
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'history': return '#3b82f6';
      case 'mythology': return '#8b5cf6';
      case 'culture': return '#ea580c';
      case 'archaeology': return '#059669';
      case 'language': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ancient Books</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors, or topics..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialCommunityIcons 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.id ? '#fff' : '#EA580C'} 
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Difficulty Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.difficultyContainer}>
          {difficulties.map(difficulty => (
            <TouchableOpacity
              key={difficulty.id}
              style={[
                styles.difficultyChip,
                selectedDifficulty === difficulty.id && styles.difficultyChipActive
              ]}
              onPress={() => setSelectedDifficulty(difficulty.id)}
            >
              <Text style={[
                styles.difficultyChipText,
                selectedDifficulty === difficulty.id && styles.difficultyChipTextActive
              ]}>
                {difficulty.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Books Grid */}
        <View style={styles.booksContainer}>
          {filteredBooks.map(book => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookCard}
              onPress={() => handleBookPress(book)}
            >
              <Image source={book.coverImage} style={styles.bookCover} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <Text style={styles.bookDescription} numberOfLines={3}>{book.description}</Text>
                
                <View style={styles.bookMeta}>
                  <View style={styles.bookMetaRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(book.category) }]}>
                      <Text style={styles.categoryBadgeText}>{book.category}</Text>
                    </View>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(book.difficulty) }]}>
                      <Text style={styles.difficultyBadgeText}>{book.difficulty}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.bookStats}>
                    <View style={styles.bookStat}>
                      <Ionicons name="star" size={12} color="#fbbf24" />
                      <Text style={styles.bookStatText}>{book.rating}</Text>
                    </View>
                    <View style={styles.bookStat}>
                      <Ionicons name="eye" size={12} color="#6b7280" />
                      <Text style={styles.bookStatText}>{book.readCount}</Text>
                    </View>
                    <View style={styles.bookStat}>
                      <Ionicons name="document-text" size={12} color="#6b7280" />
                      <Text style={styles.bookStatText}>{book.pages}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredBooks.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="book-open-variant" size={64} color="#666" />
            <Text style={styles.emptyStateTitle}>No books found</Text>
            <Text style={styles.emptyStateSubtitle}>Try adjusting your filters or search terms</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EA580C',
  },
  categoryChipActive: {
    backgroundColor: '#EA580C',
  },
  categoryChipText: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  difficultyContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  difficultyChip: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#666',
  },
  difficultyChipActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  difficultyChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  difficultyChipTextActive: {
    color: '#fff',
  },
  booksContainer: {
    paddingHorizontal: 20,
  },
  bookCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bookCover: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bookInfo: {
    padding: 16,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#EA580C',
    marginBottom: 8,
  },
  bookDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 12,
  },
  bookMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bookMetaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  bookStats: {
    flexDirection: 'row',
    gap: 12,
  },
  bookStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookStatText: {
    color: '#ccc',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 