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
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordReset() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Refs for input focusing
  const confirmRef = useRef<TextInput>(null);

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8;
  };

  const passwordsMatch = password === confirm && confirm.length > 0;
  const isValidPassword = validatePassword(password);
  const canSubmit = isValidPassword && passwordsMatch;

  const handleResetPassword = () => {
    if (!canSubmit) {
      Alert.alert('Error', 'Please ensure passwords match and are at least 8 characters long');
      return;
    }

    // Reset password logic here
    Alert.alert(
      'Success',
      'Your password has been reset successfully!',
      [
        {
          text: 'Sign In',
          onPress: () => router.replace('../login')
        }
      ]
    );
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
              <Text style={styles.title}>New Password</Text>
              <Text style={styles.subtitle}>Create a strong, secure password</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              {/* New Password Input */}
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New password (min. 8 characters)"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  blurOnSubmit={false}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#888" 
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View 
                      style={[
                        styles.strengthFill,
                        { 
                          width: `${Math.min((password.length / 12) * 100, 100)}%`,
                          backgroundColor: password.length < 8 ? '#FF5252' : 
                                         password.length < 10 ? '#FF9800' : '#4CAF50'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[
                    styles.strengthText,
                    { color: password.length < 8 ? '#FF5252' : 
                            password.length < 10 ? '#FF9800' : '#4CAF50' }
                  ]}>
                    {password.length < 8 ? 'Weak' : 
                     password.length < 10 ? 'Medium' : 'Strong'}
                  </Text>
                </View>
              )}

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  ref={confirmRef}
                  style={styles.passwordInput}
                  placeholder="Confirm new password"
                  placeholderTextColor="#888"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!showConfirm}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={handleResetPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirm(!showConfirm)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name={showConfirm ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#888" 
                  />
                </TouchableOpacity>
              </View>

              {/* Password Match Indicator */}
              {confirm.length > 0 && (
                <View style={styles.matchContainer}>
                  <MaterialIcons 
                    name={passwordsMatch ? "check-circle" : "cancel"} 
                    size={16} 
                    color={passwordsMatch ? "#4CAF50" : "#FF5252"} 
                  />
                  <Text style={[
                    styles.matchText,
                    { color: passwordsMatch ? "#4CAF50" : "#FF5252" }
                  ]}>
                    {passwordsMatch ? "Passwords match" : "Passwords don't match"}
                  </Text>
                </View>
              )}

              {/* Reset Password Button */}
              <TouchableOpacity
                style={[styles.resetButton, !canSubmit && styles.disabledButton]}
                onPress={handleResetPassword}
                disabled={!canSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.resetButtonText}>Reset Password</Text>
                <MaterialIcons name="check" size={20} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>

            {/* Footer Actions */}
            <View style={styles.footerActions}>
              {/* Back to Verify */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <MaterialIcons name="arrow-back" size={16} color="#666" />
                <Text style={styles.backText}>Back to verification</Text>
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
  passwordInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginRight: 12,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  matchText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  resetButton: {
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
  resetButtonText: {
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
  },
  backText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 8,
  },
}); 