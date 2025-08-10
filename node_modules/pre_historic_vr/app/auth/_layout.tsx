import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#191919" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#191919' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Sign In',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="signup" 
          options={{ 
            title: 'Sign Up',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="forgot-password" 
          options={{ 
            title: 'Reset Password',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="verify-email" 
          options={{ 
            title: 'Verify Email',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="reset-password" 
          options={{ 
            title: 'Reset Password',
            headerShown: false
          }} 
        />
      </Stack>
    </>
  );
} 