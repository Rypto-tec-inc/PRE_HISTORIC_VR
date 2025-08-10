import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const languages = [
  { name: 'Bassa', icon: 'alpha-b-circle-outline', intro: 'The Bassa are one of the largest ethnic groups in Liberia.' },
  { name: 'Belleh', icon: 'alpha-b-box-outline', intro: 'The Belleh (Belle) people are known for their unique traditions.' },
  { name: 'Dei', icon: 'alpha-d-circle-outline', intro: 'The Dei (Dey) are a coastal tribe with a rich history.' },
  { name: 'Gbandi', icon: 'alpha-g-circle-outline', intro: 'The Gbandi are found in northwestern Liberia.' },
  { name: 'Gio', icon: 'alpha-g-box-outline', intro: 'The Gio (Dan) are known for their masks and culture.' },
  { name: 'Gola', icon: 'alpha-g-circle', intro: 'The Gola are among the oldest tribes in Liberia.' },
  { name: 'Grebo', icon: 'alpha-g-box', intro: 'The Grebo are a coastal tribe with a strong warrior tradition.' },
  { name: 'Kissi', icon: 'alpha-k-circle-outline', intro: 'The Kissi are found in the forest regions.' },
  { name: 'Kpelle', icon: 'alpha-k-box-outline', intro: 'The Kpelle are the largest ethnic group in Liberia.' },
  { name: 'Krahn', icon: 'alpha-k-circle', intro: 'The Krahn are known for their resilience and history.' },
  { name: 'Kru', icon: 'alpha-k-box', intro: 'The Kru are famous for their seafaring skills.' },
  { name: 'Lorma', icon: 'alpha-l-circle-outline', intro: 'The Lorma (Loma) are found in the northwest.' },
  { name: 'Mandingo', icon: 'alpha-m-circle-outline', intro: 'The Mandingo are known for their trading and Islamic heritage.' },
  { name: 'Mano', icon: 'alpha-m-box-outline', intro: 'The Mano are closely related to the Gio.' },
  { name: 'Mende', icon: 'alpha-m-circle', intro: 'The Mende are found in both Liberia and Sierra Leone.' },
  { name: 'Vai', icon: 'alpha-v-circle-outline', intro: 'The Vai are famous for their unique script.' },
];

// Add image references for languages
const languageImages: Record<string, any> = {
  Bassa: require('../../assets/tribe_art/bassa art.png'),
  // Add more images for other languages if available
};

export default function LanguagesPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('online');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotationRef = useRef(0); // Track current rotation value

  // Pan responder for circular scrolling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        scaleAnim.setValue(0.95);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dy } = gestureState;
        const sensitivity = 0.5; // Adjust sensitivity
        const newRotation = rotationRef.current + (dy * sensitivity);
        
        // Calculate which language should be selected based on rotation
        const anglePerLanguage = 360 / languages.length;
        const selectedIndex = Math.round((newRotation % 360) / anglePerLanguage);
        const clampedIndex = ((selectedIndex % languages.length) + languages.length) % languages.length;
        
        if (clampedIndex !== currentIndex) {
          setCurrentIndex(clampedIndex);
          setSelectedLanguage(languages[clampedIndex].name);
        }
        
        rotationRef.current = newRotation;
        rotateAnim.setValue(newRotation);
      },
      onPanResponderRelease: () => {
        // Snap to the nearest language
        const anglePerLanguage = 360 / languages.length;
        const targetRotation = currentIndex * anglePerLanguage;
        
        Animated.parallel([
          Animated.timing(rotateAnim, {
            toValue: targetRotation,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        
        rotationRef.current = targetRotation;
      },
    })
  ).current;

  const handleLanguageSelect = (languageName: string) => {
    setSelectedLanguage(languageName);
    const index = languages.findIndex(lang => lang.name === languageName);
    if (index !== -1) {
      setCurrentIndex(index);
      const anglePerLanguage = 360 / languages.length;
      const targetRotation = index * anglePerLanguage;
      
      Animated.timing(rotateAnim, {
        toValue: targetRotation,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      rotationRef.current = targetRotation;
    }
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      router.push(`/languages-${selectedLanguage.toLowerCase()}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Language</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image 
          source={require('../../assets/r_image/PREHISTORIC-LIBERIA.png')} 
          style={styles.profileImage} 
          resizeMode="cover" 
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Liberian Languages</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.locationText}>Liberia, West Africa</Text>
          </View>
          <View style={styles.categoryRow}>
            <View style={styles.categoryDot} />
            <Text style={styles.categoryText}>Cultural Heritage</Text>
          </View>
        </View>
      </View>

      {/* Language Cards List - now scrollable */}
      <ScrollView style={styles.languageCardsScroll} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.languageCardsList}>
          {languages.map((language) => {
            const isSelected = selectedLanguage === language.name;
            return (
              <TouchableOpacity
                key={language.name}
                style={[styles.languageCard, isSelected && styles.selectedLanguageCard]}
                onPress={() => setSelectedLanguage(language.name)}
                activeOpacity={0.85}
              >
                {languageImages[language.name] && (
                  <Image
                    source={languageImages[language.name]}
                    style={styles.languageCardImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.languageCardContent}>
                  <Text style={styles.languageCardTitle}>{language.name}</Text>
                  <Text style={styles.languageCardIntro}>{language.intro}</Text>
                  {/* Add direct links for all tribes */}
                  <TouchableOpacity
                    style={styles.tribeLinkButton}
                    onPress={() => router.push(`/languages-${language.name.toLowerCase()}`)}
                  >
                    <Text style={styles.tribeLinkText}>Go to {language.name} Page</Text>
                    <Ionicons name="arrow-forward" size={16} color="#EA580C" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Navigation Button */}
      <TouchableOpacity 
        style={[
          styles.navButton,
          !selectedLanguage && styles.navButtonDisabled
        ]}
        onPress={handleContinue}
        disabled={!selectedLanguage}
      >
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
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
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  backButton: {
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Tanker',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#232323',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 22,
  },
  profileInfo: {
    flex: 1,
    paddingLeft: 16,
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationText: {
    color: '#666',
    fontSize: 13,
    fontFamily: 'SpaceMono-Regular',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EA580C',
    marginRight: 4,
  },
  categoryText: {
    color: '#EA580C',
    fontSize: 13,
    fontFamily: 'SpaceMono-Regular',
  },
  section: {
    marginHorizontal: 18,
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#232323',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(234,88,12,0.07)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  optionCard: {
    width: '47%',
    backgroundColor: 'rgba(35,35,35,0.95)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234,88,12,0.07)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  selectedOptionCard: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
    shadowColor: '#EA580C',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedRadioButton: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  optionText: {
    color: '#EA580C',
    fontSize: 14,
    fontFamily: 'Tanker',
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#fff',
  },
  circularContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  languageWheel: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languagePill: {
    position: 'absolute',
    backgroundColor: 'rgba(35,35,35,0.95)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(234,88,12,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  selectedLanguagePill: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
    shadowColor: '#EA580C',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  languageName: {
    color: '#EA580C',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    fontWeight: '600',
  },
  selectedLanguageName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centerIndicator: {
    position: 'absolute',
    top: screenWidth * 0.4, // Adjusted for larger wheel
    alignItems: 'center',
  },
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#232323',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  centerText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
    marginTop: 8,
  },
  categoryArc: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.3,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  categoryPill: {
    position: 'absolute',
    backgroundColor: 'rgba(35,35,35,0.95)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(234,88,12,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryPillText: {
    color: '#EA580C',
    fontSize: 10,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    fontWeight: '600',
  },
  scrollInstruction: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    marginTop: 10,
    marginBottom: 20,
  },
  navButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  languageCardsList: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 18,
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(234,88,12,0.07)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedLanguageCard: {
    borderColor: '#EA580C',
    backgroundColor: '#2d1a0e',
    shadowColor: '#EA580C',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  languageCardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#191919',
  },
  languageCardContent: {
    flex: 1,
  },
  languageCardTitle: {
    color: '#EA580C',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 4,
  },
  languageCardIntro: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'SpaceMono-Regular',
  },
  languageCardsScroll: {
    flex: 1,
    width: '100%',
  },
  bassaLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: 'rgba(234,88,12,0.08)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  bassaLinkText: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  tribeLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: 'rgba(234,88,12,0.08)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tribeLinkText: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
}); 