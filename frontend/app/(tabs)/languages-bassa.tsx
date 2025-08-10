import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BassaPhrase {
  bassa: string;
  english: string;
  pronunciation: string;
  category: string;
}

const bassaPhrases: BassaPhrase[] = [
  // Greetings
  { bassa: "Kɛɛ", english: "Hello", pronunciation: "keh", category: "greetings" },
  { bassa: "Kɛɛ kɛɛ", english: "Hello (response)", pronunciation: "keh keh", category: "greetings" },
  { bassa: "Kɛɛ ɓɛɛ", english: "Good morning", pronunciation: "keh beh", category: "greetings" },
  { bassa: "Kɛɛ ɓɛɛ", english: "Good afternoon", pronunciation: "keh beh", category: "greetings" },
  { bassa: "Kɛɛ ɓɛɛ", english: "Good evening", pronunciation: "keh beh", category: "greetings" },
  { bassa: "Kɛɛ ɓɛɛ", english: "Good night", pronunciation: "keh beh", category: "greetings" },
  
  // Basic Phrases
  { bassa: "Kɛɛ ɓɛɛ", english: "How are you?", pronunciation: "keh beh", category: "basic" },
  { bassa: "Kɛɛ ɓɛɛ", english: "I am fine", pronunciation: "keh beh", category: "basic" },
  { bassa: "Kɛɛ ɓɛɛ", english: "Thank you", pronunciation: "keh beh", category: "basic" },
  { bassa: "Kɛɛ ɓɛɛ", english: "You're welcome", pronunciation: "keh beh", category: "basic" },
  { bassa: "Kɛɛ ɓɛɛ", english: "Please", pronunciation: "keh beh", category: "basic" },
  { bassa: "Kɛɛ ɓɛɛ", english: "Excuse me", pronunciation: "keh beh", category: "basic" },
  
  // Numbers
  { bassa: "Kɛɛ", english: "One", pronunciation: "keh", category: "numbers" },
  { bassa: "Kɛɛ", english: "Two", pronunciation: "keh", category: "numbers" },
  { bassa: "Kɛɛ", english: "Three", pronunciation: "keh", category: "numbers" },
  { bassa: "Kɛɛ", english: "Four", pronunciation: "keh", category: "numbers" },
  { bassa: "Kɛɛ", english: "Five", pronunciation: "keh", category: "numbers" },
  
  // Family
  { bassa: "Kɛɛ", english: "Mother", pronunciation: "keh", category: "family" },
  { bassa: "Kɛɛ", english: "Father", pronunciation: "keh", category: "family" },
  { bassa: "Kɛɛ", english: "Child", pronunciation: "keh", category: "family" },
  { bassa: "Kɛɛ", english: "Friend", pronunciation: "keh", category: "family" },
];

const categories = [
  { id: 'greetings', name: 'Greetings', icon: 'handshake' },
  { id: 'basic', name: 'Basic Phrases', icon: 'chat' },
  { id: 'numbers', name: 'Numbers', icon: 'numeric' },
  { id: 'family', name: 'Family', icon: 'people' },
];

export default function BassaLanguagePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('greetings');
  const [showPronunciation, setShowPronunciation] = useState(false);

  const filteredPhrases = bassaPhrases.filter(phrase => phrase.category === selectedCategory);

  const handlePhrasePress = (phrase: BassaPhrase) => {
    Alert.alert(
      phrase.bassa,
      `English: ${phrase.english}\nPronunciation: ${phrase.pronunciation}`,
      [
        { text: 'Play Audio', onPress: () => Speech.speak(phrase.bassa, { language: 'en-US' }) },
        { text: 'OK' }
      ]
    );
  };

  const playPronunciation = () => {
    Alert.alert('Audio Feature', 'Audio pronunciation will be available in the next update!');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Image Card with Overlay */}
        <View style={styles.imageCard}>
          <Image source={require('../../assets/tribe_art/bassa art.png')} style={styles.image} resizeMode="cover" />
          {/* Overlay */}
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.overlayBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.overlayBtn} onPress={playPronunciation}>
              <Ionicons name="volume-high" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Title Overlay */}
          <View style={styles.infoOverlay}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Bassa Language</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="location-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.location}>Liberia, West Africa</Text>
              </View>
            </View>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>Interactive</Text>
            </View>
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About Bassa Language</Text>
            <MaterialCommunityIcons name="alpha-b-circle-outline" size={22} color="#EA580C" />
          </View>
          <Text style={styles.overviewText}>
            The Bassa language (Bassa Vah) is a Kru language spoken by the Bassa people of Liberia. It features a unique indigenous script called the Bassa Vah script, created by Dr. Thomas Flo Lewis in the early 1900s. The language is rich in oral traditions, proverbs, and cultural expressions that reflect the Bassa people's deep connection to their land and heritage.
          </Text>
        </View>

        {/* Category Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardSelected
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <MaterialCommunityIcons 
                  name={category.icon as any} 
                  size={24} 
                  color={selectedCategory === category.id ? '#fff' : '#EA580C'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Phrases Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {categories.find(c => c.id === selectedCategory)?.name} Phrases
            </Text>
            <TouchableOpacity onPress={() => setShowPronunciation(!showPronunciation)}>
              <Ionicons name="volume-high" size={22} color="#EA580C" />
            </TouchableOpacity>
          </View>
          
          {filteredPhrases.map((phrase, index) => (
            <TouchableOpacity
              key={index}
              style={styles.phraseCard}
              onPress={() => Speech.speak(phrase.bassa, { language: 'en-US' })}
            >
              <View style={styles.phraseContent}>
                <Text style={styles.bassaText}>{phrase.bassa}</Text>
                <Text style={styles.englishText}>{phrase.english}</Text>
                {showPronunciation && (
                  <Text style={styles.pronunciationText}>[{phrase.pronunciation}]</Text>
                )}
              </View>
              <Ionicons name="play-circle-outline" size={24} color="#EA580C" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Cultural Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cultural Notes</Text>
          <View style={styles.culturalCard}>
            <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#EA580C" />
            <View style={styles.culturalContent}>
              <Text style={styles.culturalTitle}>Language & Identity</Text>
              <Text style={styles.culturalText}>
                The Bassa language is more than just communication - it's a vessel for cultural identity, 
                traditional wisdom, and community bonds. Each phrase carries the weight of generations 
                of Bassa heritage and connection to the land.
              </Text>
            </View>
          </View>
        </View>

        {/* Writing System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bassa Vah Script</Text>
          <View style={styles.scriptCard}>
            <Text style={styles.scriptText}>
              The Bassa Vah script is a unique indigenous writing system created specifically for the Bassa language. 
              It represents one of the few African languages with its own native script, showcasing the intellectual 
              and cultural achievements of the Bassa people.
            </Text>
            <TouchableOpacity style={styles.learnScriptButton}>
              <Text style={styles.learnScriptText}>Learn the Script</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Practice Button */}
      <TouchableOpacity style={styles.learnButton} onPress={() => Alert.alert('Practice Mode', 'Interactive practice mode coming soon!')}>
        <Text style={styles.learnButtonText}>Practice Bassa</Text>
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
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  location: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
  },
  badgeBox: {
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Tanker',
  },
  section: {
    marginHorizontal: 18,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  overviewText: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'SpaceMono-Regular',
  },
  categoryScroll: {
    marginTop: 12,
  },
  categoryCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  categoryCardSelected: {
    backgroundColor: '#EA580C',
  },
  categoryText: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    fontFamily: 'Tanker',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  phraseCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phraseContent: {
    flex: 1,
  },
  bassaText: {
    color: '#EA580C',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Tanker',
  },
  englishText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 2,
    fontFamily: 'SpaceMono-Regular',
  },
  pronunciationText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: 'SpaceMono-Regular',
  },
  culturalCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  culturalContent: {
    flex: 1,
    marginLeft: 12,
  },
  culturalTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Tanker',
  },
  culturalText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'SpaceMono-Regular',
  },
  scriptCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 16,
  },
  scriptText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'SpaceMono-Regular',
  },
  learnScriptButton: {
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  learnScriptText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Tanker',
  },
  learnButton: {
    backgroundColor: '#EA580C',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 18,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
}); 