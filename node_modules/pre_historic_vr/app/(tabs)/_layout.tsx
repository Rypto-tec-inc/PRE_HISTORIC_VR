import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [spinningTab, setSpinningTab] = useState<string | null>(null);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const { user } = useAuth();

  const handleSpin = (routeName: string) => {
    setSpinningTab(routeName);
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => setSpinningTab(null));
  };

  return (
    <View style={{ backgroundColor: '#202020' }}>
      {/* Tab Bar Only - No More Button */}
      <View style={{ width: '100%', backgroundColor: '#202020' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: '100%',
            paddingBottom: 0,
            paddingTop: 20,
            backgroundColor: '#202020',
          }}
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const onPress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
              if (route.name === 'settings') {
                handleSpin(route.name);
              }
            };
            let icon = null;
            if (route.name === 'index') {
              icon = <MaterialIcons name="home" size={22} color={isFocused ? '#EA580C' : '#fff'} />;
            }
            if (route.name === 'explore') {
              icon = <MaterialIcons name="explore" size={22} color={isFocused ? '#EA580C' : '#fff'} />;
            }
            if (route.name === 'languages') {
              icon = <MaterialIcons name="menu-book" size={22} color={isFocused ? '#EA580C' : '#fff'} />;
            }
            if (route.name === 'vr') {
              icon = <MaterialCommunityIcons name="vr-headset" size={22} color={isFocused ? '#EA580C' : '#fff'} />;
            }
            if (route.name === 'profile') {
              // Use user's actual profile image or fallback to default
              const profileImageUrl = user?.avatarUrl || 'https://randomuser.me/api/portraits/men/1.jpg';
              console.log('Profile tab - User:', user?.fullName || 'No User', 'Avatar URL:', profileImageUrl);
              icon = (
                <Image
                  source={{ uri: profileImageUrl }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    borderWidth: isFocused ? 2 : 1,
                    borderColor: isFocused ? '#EA580C' : '#fff',
                  }}
                />
              );
            }
            return (
              <View key={route.key} style={{ minWidth: 60, maxWidth: 100, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ alignItems: 'center', width: '100%', paddingBottom: 24 }}>
                  <View style={{ height: 28, justifyContent: 'center' }}>{icon}</View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        {/* Long orange line under all icons */}
        <View style={{ 
          height: 3, 
          backgroundColor: '#EA580C', 
          width: '20%',
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
        }} />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { user } = useAuth();
  
  console.log('TabLayout - User:', user?.fullName || 'No User', 'Avatar URL:', user?.avatarUrl || 'No Avatar');

  // If no user, show a loading or redirect screen
  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#202020' }} edges={['bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Redirecting to login...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#202020' }} edges={['bottom']}>
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
      <Tabs.Screen
        name="languages"
        options={{
          title: 'Languages',
        }}
      />
      <Tabs.Screen
        name="vr"
        options={{
          title: 'VR Experience',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
} 