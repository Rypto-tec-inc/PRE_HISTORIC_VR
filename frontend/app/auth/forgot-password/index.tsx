import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window');

export default function ForgotPasswordIndex() {
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Home Button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/welcome')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="home" size={24} color="#EA580C" />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Compact Header */}
          <View style={styles.header}>
            <Image
              source={require('../../../assets/auth_image/PREHISTORIC-LIBERIA-removebg-preview.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Choose your recovery method</Text>
          </View>

          {/* Method Selection */}
          <View style={styles.methodContainer}>
            <TouchableOpacity
              style={[styles.methodOption, method === 'email' && styles.selectedOption]}
              onPress={() => setMethod('email')}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <MaterialIcons 
                  name="email" 
                  size={24} 
                  color={method === 'email' ? '#EA580C' : '#666'} 
                  style={styles.optionIcon}
                />
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, method === 'email' && styles.selectedTitle]}>
                    Email Address
                  </Text>
                  <Text style={styles.optionSubtitle}>
                    Recovery code sent to your email
                  </Text>
                </View>
                {method === 'email' && (
                  <MaterialIcons name="check-circle" size={20} color="#EA580C" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodOption, method === 'phone' && styles.selectedOption]}
              onPress={() => setMethod('phone')}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <MaterialIcons 
                  name="phone" 
                  size={24} 
                  color={method === 'phone' ? '#EA580C' : '#666'} 
                  style={styles.optionIcon}
                />
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, method === 'phone' && styles.selectedTitle]}>
                    Phone Number
                  </Text>
                  <Text style={styles.optionSubtitle}>
                    Recovery code sent via SMS
                  </Text>
                </View>
                {method === 'phone' && (
                  <MaterialIcons name="check-circle" size={20} color="#EA580C" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push(`./${method}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => router.push('../login')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={16} color="#666" />
            <Text style={styles.backToLoginText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
  },
  homeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 60,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  methodContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  methodOption: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    borderColor: '#EA580C',
    backgroundColor: '#2A1A15',
    shadowColor: '#EA580C',
    shadowOpacity: 0.2,
    elevation: 5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedTitle: {
    color: '#EA580C',
  },
  optionSubtitle: {
    color: '#888',
    fontSize: 12,
  },
  continueButton: {
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backToLoginText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 8,
  },
}); 