import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ErrorBoundary } from '../components/ErrorBoundary';
import OnboardingWrapper from '../components/OnboardingWrapper';
import TopBar from '../components/TopBar';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { SocketProvider } from '../contexts/SocketContext';
import SplashScreen from './splash';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Tanker: require('../assets/fonts/Tanker-Regular.ttf'),
  });

  // Set up notification handler (disabled for Expo Go compatibility)
  useEffect(() => {
    // Notifications are disabled in Expo Go with SDK 53
    // To enable notifications, use a development build instead
    console.log('Notifications disabled for Expo Go compatibility');
  }, []);

  if (!loaded) {
    return <SplashScreen />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <DataProvider>
            <OnboardingWrapper>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#191919' : '#fff' }} edges={['top']}>
                  <TopBar />
                  <View style={{ flex: 1, padding: 0, margin: 0 }}>
                    <Stack>
                      {/* Enhanced welcome page first */}
                      <Stack.Screen name="welcome" options={{ headerShown: false }} />
                      <Stack.Screen name="index" options={{ headerShown: false }} />
                      <Stack.Screen name="compass" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                      <Stack.Screen name="auth" options={{ headerShown: false }} />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                  </View>
                </SafeAreaView>
                <StatusBar style="auto" />
                <Toast />
              </ThemeProvider>
            </OnboardingWrapper>
          </DataProvider>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}


