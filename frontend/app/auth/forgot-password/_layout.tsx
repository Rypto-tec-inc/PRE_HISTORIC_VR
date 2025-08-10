import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ForgotPasswordLayout() {
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
          name="index"
          options={{
            title: 'Reset Method',
          }}
        />
        <Stack.Screen
          name="email"
          options={{
            title: 'Email Reset',
          }}
        />
        <Stack.Screen
          name="verify"
          options={{
            title: 'Verify Code',
          }}
        />
        <Stack.Screen
          name="reset"
          options={{
            title: 'New Password',
          }}
        />
      </Stack>
    </>
  );
} 