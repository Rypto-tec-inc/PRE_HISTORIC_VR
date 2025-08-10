import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { 
  Alert, 
  Image, 
  ImageBackground,
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

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Refs for input focusing
  const emailPhoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return { strength: 'weak', color: '#ef4444', text: 'Too short' };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 'medium', color: '#f59e0b', text: 'Add uppercase, lowercase & number' };
    return { strength: 'strong', color: '#10b981', text: 'Strong password' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async () => {
    if (!fullName || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (signupMethod === 'email' && !email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (signupMethod === 'phone' && !phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    // Format phone number with country code
    const formattedPhone = signupMethod === 'phone' && selectedCountry && phone 
      ? `${selectedCountry.dialCode}${phone.replace(/^0+/, '')}` // Remove leading zeros
      : null;

    const success = await signUp(
      signupMethod === 'email' ? email : null, 
      password, 
      fullName, 
      formattedPhone
    );
    
    if (success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } else {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ImageBackground
        source={require('../../assets/auth_image/Untitled-1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >

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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the cultural journey</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full Name"
                  placeholderTextColor="#888"
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                  onSubmitEditing={() => emailPhoneRef.current?.focus()}
                  blurOnSubmit={false}
                  autoFocus
                />
              </View>

              {/* Signup Method Toggle */}
              <View style={styles.methodToggle}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    signupMethod === 'email' && styles.activeMethodButton
                  ]}
                  onPress={() => setSignupMethod('email')}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name="email" 
                    size={18} 
                    color={signupMethod === 'email' ? '#EA580C' : '#666'} 
                  />
                  <Text style={[
                    styles.methodButtonText,
                    signupMethod === 'email' && styles.activeMethodButtonText
                  ]}>
                    Email
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    signupMethod === 'phone' && styles.activeMethodButton
                  ]}
                  onPress={() => setSignupMethod('phone')}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name="phone" 
                    size={18} 
                    color={signupMethod === 'phone' ? '#EA580C' : '#666'} 
                  />
                  <Text style={[
                    styles.methodButtonText,
                    signupMethod === 'phone' && styles.activeMethodButtonText
                  ]}>
                    Phone
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Email/Phone Input */}
              {signupMethod === 'email' ? (
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    ref={emailPhoneRef}
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
                  {email ? (
                    <TouchableOpacity 
                      style={styles.clearButton}
                      onPress={() => setEmail('')}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="clear" size={18} color="#888" />
                    </TouchableOpacity>
                  ) : null}
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
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
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
                <View style={styles.passwordStrength}>
                  <View style={[styles.strengthBar, { backgroundColor: passwordStrength.color }]} />
                  <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.text}
                  </Text>
                </View>
              )}

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.signupButton, loading && styles.disabledButton]}
                onPress={handleSignup}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>

              {/* Terms and Privacy */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>By creating an account, you agree to our </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/terms')} activeOpacity={0.7}>
                  <Text style={styles.termsLink}>Terms</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}> and </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/privacy-policy')} activeOpacity={0.7}>
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('./login')} activeOpacity={0.7}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Secure registration with email verification
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    marginBottom: 15,
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
    marginBottom: 14,
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
  phoneInputContainer: {
    marginBottom: 14,
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
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: -8,
  },
  strengthBar: {
    height: 3,
    width: 50,
    borderRadius: 2,
    marginRight: 8,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  signupButton: {
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
  disabledButton: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  termsText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  termsLink: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: '#aaa',
    fontSize: 14,
  },
  loginLink: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 