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
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordVerify() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, idx: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[idx] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && idx < 5) {
        inputRefs.current[idx + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const codeString = code.join('');

  const handleVerify = () => {
    if (codeString.length === 6) {
      router.push('./reset');
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
              <Text style={styles.title}>Verify Code</Text>
              <Text style={styles.subtitle}>Enter the 6-digit code sent to your email</Text>
            </View>

            {/* Code Input Section */}
            <View style={styles.form}>
              <View style={styles.codeContainer}>
                {code.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => { inputRefs.current[idx] = ref; }}
                    style={[
                      styles.codeInput,
                      digit ? styles.filledInput : {},
                      idx === code.findIndex(c => c === '') ? styles.activeInput : {}
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={v => handleChange(v, idx)}
                    onKeyPress={e => handleKeyPress(e, idx)}
                    autoFocus={idx === 0}
                    textAlign="center"
                    placeholderTextColor="#666"
                  />
                ))}
              </View>

              {/* Progress Indicator */}
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {codeString.length}/6 digits entered
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(codeString.length / 6) * 100}%` }
                    ]} 
                  />
                </View>
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                style={[styles.verifyButton, codeString.length !== 6 && styles.disabledButton]}
                onPress={handleVerify}
                disabled={codeString.length !== 6}
                activeOpacity={0.8}
              >
                <Text style={styles.verifyButtonText}>Verify Code</Text>
                <MaterialIcons name="verified" size={20} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>

            {/* Footer Actions */}
            <View style={styles.footerActions}>
              {/* Resend Code */}
              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  // Add resend logic
                  setCode(['', '', '', '', '', '']);
                  inputRefs.current[0]?.focus();
                }}
                activeOpacity={0.7}
              >
                <MaterialIcons name="refresh" size={16} color="#EA580C" />
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>

              {/* Back */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <MaterialIcons name="arrow-back" size={16} color="#666" />
                <Text style={styles.backText}>Change Email</Text>
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
    alignItems: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 45,
    height: 55,
    backgroundColor: '#232323',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filledInput: {
    borderColor: '#EA580C',
    backgroundColor: '#2A1A15',
  },
  activeInput: {
    borderColor: '#EA580C',
    shadowColor: '#EA580C',
    shadowOpacity: 0.3,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressText: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: 2,
  },
  verifyButton: {
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  verifyButtonText: {
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
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  resendText: {
    color: '#EA580C',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 6,
  },
}); 