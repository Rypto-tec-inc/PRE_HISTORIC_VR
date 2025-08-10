import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      console.log('🔄 OnboardingWrapper: Still loading...');
      return;
    }

    const inAuthGroup = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === 'onboarding';
    const inAuthScreens = ['welcome', 'login', 'signup', 'forgot-password', 'splash'].includes(segments[0] || '');

    console.log('🔍 OnboardingWrapper: Checking navigation...', {
      user: !!user,
      inAuthGroup,
      inOnboarding,
      inAuthScreens,
      hasCompletedOnboarding: hasCompletedOnboarding(),
      currentSegment: segments[0]
    });

    if (!user && inAuthGroup) {
      // User is not logged in but is in the tabs section - redirect to login
      console.log('🚨 No user found in tabs - redirecting to /login');
      router.replace('/auth/login');
    } else if (user && inAuthGroup && !hasCompletedOnboarding() && !inOnboarding) {
      // User is logged in but hasn't completed onboarding
      console.log('🚨 User needs to complete onboarding - redirecting to /onboarding');
      router.replace('/onboarding');
    } else if (user && inOnboarding && hasCompletedOnboarding()) {
      // User has completed onboarding but is on onboarding screen
      console.log('✅ User has completed onboarding - redirecting to main app');
      router.replace('/(tabs)');
    } else if (user && hasCompletedOnboarding()) {
      console.log('✅ User has completed onboarding and is in correct location');
    } else if (user && !hasCompletedOnboarding()) {
      console.log('❌ User has NOT completed onboarding');
    }
  }, [user, loading, segments]); // Removed hasCompletedOnboarding from dependencies

  return <>{children}</>;
} 