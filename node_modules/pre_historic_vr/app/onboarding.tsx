import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

const LIBERIAN_TRIBES = [
  'Bassa', 'Kpelle', 'Gio', 'Mano', 'Grebo', 'Krahn', 'Vai', 'Mandingo',
  'Lorma', 'Kissi', 'Gola', 'Gbandi', 'Mende', 'Dei', 'Belleh', 'Kru'
];

const COUNTIES = [
  'Bomi', 'Bong', 'Gbarpolu', 'Grand Bassa', 'Grand Cape Mount', 'Grand Gedeh',
  'Grand Kru', 'Lofa', 'Margibi', 'Maryland', 'Montserrado', 'Nimba',
  'River Cess', 'River Gee', 'Sinoe'
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const AGE_GROUPS = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const EDUCATION_LEVELS = ['Elementary', 'High School', 'University', 'Graduate', 'Other'];

export default function OnboardingScreen() {
  const { user, updateUser, completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    tribe: '',
    county: '',
    gender: '',
    ageGroup: '',
    educationLevel: '',
    interests: [] as string[]
  });

  const steps = [
    {
      title: 'Welcome to Prehistoric Liberia!',
      subtitle: 'Let\'s personalize your cultural journey',
      content: 'WelcomeStep'
    },
    {
      title: 'Your Cultural Heritage',
      subtitle: 'Tell us about your tribal background',
      content: 'TribeStep'
    },
    {
      title: 'Your Location',
      subtitle: 'Which county are you from?',
      content: 'LocationStep'
    },
    {
      title: 'About You',
      subtitle: 'Help us personalize your experience',
      content: 'PersonalStep'
    },
    {
      title: 'Your Interests',
      subtitle: 'What aspects of culture interest you most?',
      content: 'InterestsStep'
    }
  ];

  const interests = [
    'Traditional Music', 'Dance & Performance', 'Tribal Art', 'Oral History',
    'Traditional Medicine', 'Crafts & Pottery', 'Folklore & Legends', 'Language Learning',
    'Traditional Clothing', 'Cultural Festivals', 'Ancient Architecture', 'Spiritual Practices'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      
      // Update user profile with onboarding data
      const success = await updateUser(formData);
      
      if (success) {
        // Mark onboarding as completed
        const completed = await completeOnboarding();
        
        if (completed) {
          Alert.alert(
            'Welcome!',
            'Your profile has been set up successfully. You can now explore prehistoric Liberia!',
            [{ text: 'Let\'s Go!', onPress: () => router.replace('/(tabs)') }]
          );
        } else {
          Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Failed to save your profile. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    setFormData({ ...formData, interests: newInterests });
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: return true; // Welcome step
      case 1: return formData.tribe !== '';
      case 2: return formData.county !== '';
      case 3: return formData.gender !== '' && formData.ageGroup !== '' && formData.educationLevel !== '';
      case 4: return formData.interests.length > 0;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].content) {
      case 'WelcomeStep':
        return (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Ionicons name="globe" size={80} color="#d4af37" style={{ marginBottom: 20 }} />
            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', lineHeight: 24 }}>
              Embark on a journey through Liberia's rich cultural heritage. Discover the traditions, 
              languages, and stories of 16 unique tribes through immersive VR experiences.
            </Text>
          </View>
        );

      case 'TribeStep':
        return (
          <View>
            <Text style={{ color: '#fff', fontSize: 16, marginBottom: 20 }}>
              Which tribe do you identify with or are you most interested in learning about?
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {LIBERIAN_TRIBES.map((tribe) => (
                <TouchableOpacity
                  key={tribe}
                  style={{
                    backgroundColor: formData.tribe === tribe ? '#d4af37' : '#333',
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  onPress={() => setFormData({ ...formData, tribe })}
                >
                  <Text style={{ color: '#fff', fontSize: 16, flex: 1 }}>{tribe}</Text>
                  {formData.tribe === tribe && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 'LocationStep':
        return (
          <View>
            <Text style={{ color: '#fff', fontSize: 16, marginBottom: 20 }}>
              Which county are you from or currently reside in?
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {COUNTIES.map((county) => (
                <TouchableOpacity
                  key={county}
                  style={{
                    backgroundColor: formData.county === county ? '#d4af37' : '#333',
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  onPress={() => setFormData({ ...formData, county })}
                >
                  <Text style={{ color: '#fff', fontSize: 16, flex: 1 }}>{county}</Text>
                  {formData.county === county && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 'PersonalStep':
        return (
          <View>
            <Text style={{ color: '#fff', fontSize: 16, marginBottom: 20 }}>
              Tell us a bit about yourself to personalize your experience.
            </Text>
            
            {/* Gender */}
            <Text style={{ color: '#d4af37', fontSize: 14, marginBottom: 10 }}>Gender</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
              {GENDERS.map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={{
                    backgroundColor: formData.gender === gender ? '#d4af37' : '#333',
                    padding: 10,
                    borderRadius: 8,
                    margin: 4
                  }}
                  onPress={() => setFormData({ ...formData, gender })}
                >
                  <Text style={{ color: '#fff', fontSize: 14 }}>{gender}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Age Group */}
            <Text style={{ color: '#d4af37', fontSize: 14, marginBottom: 10 }}>Age Group</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
              {AGE_GROUPS.map((ageGroup) => (
                <TouchableOpacity
                  key={ageGroup}
                  style={{
                    backgroundColor: formData.ageGroup === ageGroup ? '#d4af37' : '#333',
                    padding: 10,
                    borderRadius: 8,
                    margin: 4
                  }}
                  onPress={() => setFormData({ ...formData, ageGroup })}
                >
                  <Text style={{ color: '#fff', fontSize: 14 }}>{ageGroup}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Education Level */}
            <Text style={{ color: '#d4af37', fontSize: 14, marginBottom: 10 }}>Education Level</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {EDUCATION_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={{
                    backgroundColor: formData.educationLevel === level ? '#d4af37' : '#333',
                    padding: 10,
                    borderRadius: 8,
                    margin: 4
                  }}
                  onPress={() => setFormData({ ...formData, educationLevel: level })}
                >
                  <Text style={{ color: '#fff', fontSize: 14 }}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'InterestsStep':
        return (
          <View>
            <Text style={{ color: '#fff', fontSize: 16, marginBottom: 20 }}>
              What aspects of Liberian culture interest you most? (Select at least one)
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={{
                    backgroundColor: formData.interests.includes(interest) ? '#d4af37' : '#333',
                    padding: 12,
                    borderRadius: 8,
                    margin: 4,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={{ color: '#fff', fontSize: 14, marginRight: 8 }}>{interest}</Text>
                  {formData.interests.includes(interest) && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      {/* Progress Bar */}
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ color: '#d4af37', fontSize: 14 }}>
            Step {currentStep + 1} of {steps.length}
          </Text>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
            <Text style={{ color: '#999', fontSize: 14 }}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View style={{ 
          width: '100%', 
          height: 4, 
          backgroundColor: '#333', 
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <View style={{ 
            width: `${((currentStep + 1) / steps.length) * 100}%`, 
            height: '100%', 
            backgroundColor: '#d4af37' 
          }} />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          {steps[currentStep].title}
        </Text>
        <Text style={{ color: '#999', fontSize: 16, marginBottom: 30 }}>
          {steps[currentStep].subtitle}
        </Text>

        {renderStepContent()}
      </ScrollView>

      {/* Navigation */}
      <View style={{ 
        padding: 20, 
        borderTopWidth: 1, 
        borderTopColor: '#333',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: currentStep === 0 ? '#555' : '#333',
            padding: 15,
            borderRadius: 10,
            minWidth: 100,
            alignItems: 'center'
          }}
          onPress={handlePrevious}
          disabled={currentStep === 0 || loading}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: (!isCurrentStepValid() || loading) ? '#555' : '#d4af37',
            padding: 15,
            borderRadius: 10,
            minWidth: 100,
            alignItems: 'center'
          }}
          onPress={handleNext}
          disabled={!isCurrentStepValid() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 