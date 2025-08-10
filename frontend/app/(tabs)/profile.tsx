import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, updateUser, loading } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Edit form state
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    tribe: user?.tribe || '',
    county: user?.county || '',
    gender: user?.gender || '',
    ageGroup: user?.ageGroup || '',
    educationLevel: user?.educationLevel || '',
    language: user?.language || 'English'
  });

  useEffect(() => {
    if (user) {
      setEditData({
        fullName: user.fullName || '',
        tribe: user.tribe || '',
        county: user.county || '',
        gender: user.gender || '',
        ageGroup: user.ageGroup || '',
        educationLevel: user.educationLevel || '',
        language: user.language || 'English'
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const success = await updateUser(editData);
      
      if (success) {
        Alert.alert('Success', 'Profile updated successfully');
        setEditModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const getProgressPercentage = () => {
    if (!user) return 0;
    const totalFields = 7;
    const filledFields = [
      user.fullName,
      user.tribe,
      user.county,
      user.gender,
      user.ageGroup,
      user.educationLevel,
      user.language
    ].filter(field => field && field.trim() !== '').length;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={{ color: '#fff', marginTop: 16 }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Please sign in to view your profile</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#d4af37', padding: 15, borderRadius: 10, marginTop: 20 }}
          onPress={() => router.push('/login')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const progressPercentage = getProgressPercentage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#333' }}>
          <View style={{ 
            width: 100, 
            height: 100, 
            borderRadius: 50, 
            backgroundColor: '#d4af37', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 16
          }}>
            <Text style={{ color: '#fff', fontSize: 36, fontWeight: 'bold' }}>
              {user.fullName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>{user.fullName}</Text>
          <Text style={{ color: '#999', fontSize: 16 }}>{user.email}</Text>
          
          {/* Profile Completion */}
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: '#d4af37', fontSize: 14, marginBottom: 8 }}>
              Profile Completion: {progressPercentage}%
            </Text>
            <View style={{ 
              width: 200, 
              height: 8, 
              backgroundColor: '#333', 
              borderRadius: 4, 
              overflow: 'hidden' 
            }}>
              <View style={{ 
                width: `${progressPercentage}%`, 
                height: '100%', 
                backgroundColor: '#d4af37' 
              }} />
            </View>
          </View>
        </View>

        {/* Profile Information */}
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: '#d4af37', fontSize: 18, fontWeight: 'bold' }}>Profile Information</Text>
            <TouchableOpacity 
              onPress={() => setEditModalVisible(true)}
              style={{ backgroundColor: '#d4af37', padding: 10, borderRadius: 8 }}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Info Items */}
          <InfoItem icon="person" label="Full Name" value={user.fullName || 'Not set'} />
          <InfoItem icon="flag" label="Tribe" value={user.tribe || 'Not set'} />
          <InfoItem icon="location" label="County" value={user.county || 'Not set'} />
          <InfoItem icon="male-female" label="Gender" value={user.gender || 'Not set'} />
          <InfoItem icon="calendar" label="Age Group" value={user.ageGroup || 'Not set'} />
          <InfoItem icon="school" label="Education Level" value={user.educationLevel || 'Not set'} />
          <InfoItem icon="language" label="Language" value={user.language || 'English'} />
        </View>

        {/* Statistics */}
        <View style={{ padding: 20 }}>
          <Text style={{ color: '#d4af37', fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Your Journey</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <StatCard 
              icon="trophy" 
              label="Achievements" 
              value={user.achievements?.length.toString() || '0'} 
            />
            <StatCard 
              icon="time" 
              label="Learning Time" 
              value={`${Math.floor((user.totalLearningTime || 0) / 60)}h`} 
            />
            <StatCard 
              icon="eye" 
              label="Artifacts Viewed" 
              value={user.artifactsViewed?.length.toString() || '0'} 
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ padding: 20 }}>
          <Text style={{ color: '#d4af37', fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#2a2a2a', 
              padding: 16, 
              borderRadius: 10, 
              flexDirection: 'row', 
              alignItems: 'center',
              marginBottom: 12
            }}
            onPress={() => router.push('/(tabs)/languages')}
          >
            <Ionicons name="language" size={24} color="#d4af37" style={{ marginRight: 16 }} />
            <Text style={{ color: '#fff', fontSize: 16, flex: 1 }}>Explore Languages</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              backgroundColor: '#2a2a2a', 
              padding: 16, 
              borderRadius: 10, 
              flexDirection: 'row', 
              alignItems: 'center',
              marginBottom: 12
            }}
            onPress={() => router.push('/(tabs)/vr')}
          >
            <Ionicons name="headset" size={24} color="#d4af37" style={{ marginRight: 16 }} />
            <Text style={{ color: '#fff', fontSize: 16, flex: 1 }}>VR Experiences</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              backgroundColor: '#2a2a2a', 
              padding: 16, 
              borderRadius: 10, 
              flexDirection: 'row', 
              alignItems: 'center'
            }}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Ionicons name="settings" size={24} color="#d4af37" style={{ marginRight: 16 }} />
            <Text style={{ color: '#fff', fontSize: 16, flex: 1 }}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#333', flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginRight: 16 }}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', flex: 1 }}>Edit Profile</Text>
          </View>

          <ScrollView style={{ flex: 1, padding: 20 }}>
            <EditField 
              label="Full Name" 
              value={editData.fullName} 
              onChangeText={(text) => setEditData({...editData, fullName: text})} 
            />
            <EditField 
              label="Tribe" 
              value={editData.tribe} 
              onChangeText={(text) => setEditData({...editData, tribe: text})} 
            />
            <EditField 
              label="County" 
              value={editData.county} 
              onChangeText={(text) => setEditData({...editData, county: text})} 
            />
            <EditField 
              label="Gender" 
              value={editData.gender} 
              onChangeText={(text) => setEditData({...editData, gender: text})} 
            />
            <EditField 
              label="Age Group" 
              value={editData.ageGroup} 
              onChangeText={(text) => setEditData({...editData, ageGroup: text})} 
            />
            <EditField 
              label="Education Level" 
              value={editData.educationLevel} 
              onChangeText={(text) => setEditData({...editData, educationLevel: text})} 
            />
            <EditField 
              label="Language" 
              value={editData.language} 
              onChangeText={(text) => setEditData({...editData, language: text})} 
            />

            <TouchableOpacity
              style={{
                backgroundColor: updating ? '#555' : '#d4af37',
                borderRadius: 10,
                padding: 15,
                alignItems: 'center',
                marginTop: 20
              }}
              onPress={handleUpdateProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                  Update Profile
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const InfoItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <View style={{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#2a2a2a', 
    padding: 16, 
    borderRadius: 10, 
    marginBottom: 12 
  }}>
    <Ionicons name={icon as any} size={20} color="#d4af37" style={{ marginRight: 16 }} />
    <View style={{ flex: 1 }}>
      <Text style={{ color: '#999', fontSize: 12 }}>{label}</Text>
      <Text style={{ color: '#fff', fontSize: 16 }}>{value}</Text>
    </View>
  </View>
);

const StatCard = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <View style={{ 
    backgroundColor: '#2a2a2a', 
    padding: 16, 
    borderRadius: 10, 
    alignItems: 'center', 
    flex: 1, 
    marginHorizontal: 4 
  }}>
    <Ionicons name={icon as any} size={24} color="#d4af37" style={{ marginBottom: 8 }} />
    <Text style={{ color: '#d4af37', fontSize: 18, fontWeight: 'bold' }}>{value}</Text>
    <Text style={{ color: '#999', fontSize: 12, textAlign: 'center' }}>{label}</Text>
  </View>
);

const EditField = ({ label, value, onChangeText }: { label: string, value: string, onChangeText: (text: string) => void }) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ color: '#fff', marginBottom: 8, fontSize: 16 }}>{label}</Text>
    <TextInput
      style={{
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#555'
      }}
      placeholder={`Enter ${label.toLowerCase()}`}
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="words"
    />
  </View>
); 