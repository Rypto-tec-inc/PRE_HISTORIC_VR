import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { 
  Alert, 
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
import { useAuth } from '../../contexts/AuthContext';
import PhoneInput from '../../components/PhoneInput';

const { height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Refs for input focusing
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    const loginData = loginMethod === 'email' ? email : phone;
    
    if (!loginData || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Format phone number with country code
    const formattedPhone = loginMethod === 'phone' && selectedCountry && phone 
      ? `${selectedCountry.dialCode}${phone.replace(/^0+/, '')}` // Remove leading zeros
      : null;

    const success = await signIn(loginMethod === 'email' ? email : null, password, formattedPhone);
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Invalid credentials');
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
          <View style={styles.content}>
            {/* Compact Header */}
            <View style={styles.header}>
              <Image
                source={require('../../assets/auth_image/PREHISTORIC-LIBERIA-removebg-preview.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to explore</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              {/* Login Method Toggle */}
              <View style={styles.methodToggle}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    loginMethod === 'email' && styles.activeMethodButton
                  ]}
                  onPress={() => setLoginMethod('email')}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name="email" 
                    size={18} 
                    color={loginMethod === 'email' ? '#EA580C' : '#666'} 
                  />
                  <Text style={[
                    styles.methodButtonText,
                    loginMethod === 'email' && styles.activeMethodButtonText
                  ]}>
                    Email
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    loginMethod === 'phone' && styles.activeMethodButton
                  ]}
                  onPress={() => setLoginMethod('phone')}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name="phone" 
                    size={18} 
                    color={loginMethod === 'phone' ? '#EA580C' : '#666'} 
                  />
                  <Text style={[
                    styles.methodButtonText,
                    loginMethod === 'phone' && styles.activeMethodButtonText
                  ]}>
                    Phone
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Email/Phone Input */}
              {loginMethod === 'email' ? (
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email Address"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              ) : (
                <PhoneInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone number"
                  style={styles.phoneInputContainer}
                  onCountryChange={setSelectedCountry}
                />
              )}

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  ref={passwordRef}
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
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

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push('./forgot-password')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('./signup')} activeOpacity={0.7}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Social Login or Additional Options */}
            <View style={styles.socialContainer}>
              <Text style={styles.socialText}>
                Secure login with biometric authentication
              </Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 15,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeMethodButton: {
    backgroundColor: '#EA580C',
  },
  methodButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  activeMethodButtonText: {
    color: '#fff',
  },
  inputContainer: {
    backgroundColor: '#232323',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  signupText: {
    color: '#aaa',
    fontSize: 14,
  },
  signupLink: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '600',
  },
  socialContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  socialText: {
    color: '#666',
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  phoneInputContainer: {
    marginBottom: 14,
  },
}); 