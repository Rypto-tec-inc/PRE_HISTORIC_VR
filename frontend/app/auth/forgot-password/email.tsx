import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { 
  Image, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window');

export default function ForgotPasswordEmail() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  
  // Ref for input focusing
  const emailRef = useRef<TextInput>(null);

  const handleSendCode = () => {
    if (email) {
      router.push('./verify');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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
              <Text style={styles.subtitle}>We'll send a verification code to your email</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSendCode}
                  autoFocus={true}
                />
                {email.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setEmail('')}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="clear" size={20} color="#888" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Email Validation Hint */}
              {email.length > 0 && !email.includes('@') && (
                <View style={styles.hintContainer}>
                  <MaterialIcons name="info" size={16} color="#FF9800" />
                  <Text style={styles.hintText}>Please enter a valid email address</Text>
                </View>
              )}

              {/* Send Code Button */}
              <TouchableOpacity
                style={[styles.sendButton, !email && styles.disabledButton]}
                onPress={handleSendCode}
                disabled={!email}
                activeOpacity={0.8}
              >
                <Text style={styles.sendButtonText}>Send Verification Code</Text>
                <MaterialIcons name="send" size={20} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>

            {/* Footer Actions */}
            <View style={styles.footerActions}>
              {/* Back to Method Selection */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <MaterialIcons name="arrow-back" size={16} color="#666" />
                <Text style={styles.backButtonText}>Choose different method</Text>
              </TouchableOpacity>

              {/* Help */}
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => {
                  // Add help functionality
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.helpText}>Need help?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    lineHeight: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: '#232323',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  hintText: {
    color: '#FF9800',
    fontSize: 12,
    marginLeft: 6,
  },
  sendButton: {
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#444',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  footerActions: {
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 8,
  },
  helpButton: {
    paddingVertical: 8,
  },
  helpText: {
    color: '#EA580C',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
}); 