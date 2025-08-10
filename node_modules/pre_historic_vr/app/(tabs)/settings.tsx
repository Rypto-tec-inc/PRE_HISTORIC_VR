import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Switch,
  Modal,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true,
  rightElement 
}) => (
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#2a2a2a',
      marginBottom: 1,
    }}
    onPress={onPress}
    disabled={!onPress}
  >
    <Ionicons name={icon as any} size={24} color="#d4af37" style={{ marginRight: 16 }} />
    <View style={{ flex: 1 }}>
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{title}</Text>
      {subtitle && (
        <Text style={{ color: '#999', fontSize: 14, marginTop: 2 }}>{subtitle}</Text>
      )}
    </View>
    {rightElement || (showArrow && (
      <Ionicons name="chevron-forward" size={20} color="#666" />
    ))}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { user, signOut, changePassword, updateUser, deleteAccount } = useAuth();
  const [notifications, setNotifications] = useState(user?.notifications ?? true);
  const [loading, setLoading] = useState(false);

  // Password Change Modal State
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Account Deletion Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user?.notifications !== undefined) {
      setNotifications(user.notifications);
    }
  }, [user]);

  const handleNotificationToggle = async (value: boolean) => {
    try {
      setLoading(true);
      setNotifications(value);
      
      const success = await updateUser({ notifications: value });
      if (!success) {
        // Revert on failure
        setNotifications(!value);
        Alert.alert('Error', 'Failed to update notification settings');
      }
    } catch (error) {
      setNotifications(!value);
      Alert.alert('Error', 'Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert('Error', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    try {
      setPasswordLoading(true);
      const success = await changePassword(currentPassword, newPassword, confirmPassword);
      
      if (success) {
        Alert.alert('Success', 'Password changed successfully');
        setPasswordModalVisible(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', 'Failed to change password. Please check your current password.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while changing password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      Alert.alert('Error', 'Please enter your password to confirm deletion');
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleteLoading(true);
              const success = await deleteAccount(deletePassword);
              
              if (success) {
                Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
                router.replace('/welcome');
              } else {
                Alert.alert('Error', 'Failed to delete account. Please check your password.');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while deleting account');
            } finally {
              setDeleteLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await signOut();
              router.replace('/welcome');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Settings</Text>
        <Text style={{ color: '#999', fontSize: 16, marginTop: 4 }}>
          Manage your account and preferences
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Account Section */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: '#d4af37', fontSize: 14, fontWeight: '600', marginBottom: 8, marginHorizontal: 16 }}>
            ACCOUNT
          </Text>
          
          <SettingsItem
            icon="person-outline"
            title="Update Profile"
            subtitle="Edit your personal information"
            onPress={() => router.push('/update-profile-image')}
          />
          
          <SettingsItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => setPasswordModalVisible(true)}
          />
          
          <SettingsItem
            icon="download-outline"
            title="Export Data"
            subtitle="Download your account data"
            onPress={() => router.push('/export-data')}
          />
        </View>

        {/* Preferences Section */}
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: '#d4af37', fontSize: 14, fontWeight: '600', marginBottom: 8, marginHorizontal: 16 }}>
            PREFERENCES
          </Text>
          
          <SettingsItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Receive updates and reminders"
            showArrow={false}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#555', true: '#d4af37' }}
                thumbColor={Platform.OS === 'android' ? '#fff' : ''}
                disabled={loading}
              />
            }
          />
          
          <SettingsItem
            icon="language-outline"
            title="Languages"
            subtitle="Explore tribal languages"
            onPress={() => router.push('/languages')}
          />
          
          <SettingsItem
            icon="information-circle-outline"
            title="Device Info"
            subtitle="View device compatibility"
            onPress={() => router.push('/device-info')}
          />
        </View>

        {/* Support Section */}
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: '#d4af37', fontSize: 14, fontWeight: '600', marginBottom: 8, marginHorizontal: 16 }}>
            SUPPORT
          </Text>
          
          <SettingsItem
            icon="help-circle-outline"
            title="About"
            subtitle="Learn about this app"
            onPress={() => router.push('/about')}
          />
          
          <SettingsItem
            icon="document-text-outline"
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => router.push('/privacy-policy')}
          />
          
          <SettingsItem
            icon="document-outline"
            title="Terms of Service"
            subtitle="App usage terms"
            onPress={() => router.push('/terms')}
          />
        </View>

        {/* Danger Zone */}
        <View style={{ marginTop: 30, marginBottom: 50 }}>
          <Text style={{ color: '#ff4444', fontSize: 14, fontWeight: '600', marginBottom: 8, marginHorizontal: 16 }}>
            DANGER ZONE
          </Text>
          
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#2a2a2a',
              marginBottom: 8,
            }}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff4444" style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#ff4444', fontSize: 16, fontWeight: '500' }}>Sign Out</Text>
              <Text style={{ color: '#999', fontSize: 14, marginTop: 2 }}>Sign out of your account</Text>
            </View>
            {loading && <ActivityIndicator color="#ff4444" />}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#2a2a2a',
            }}
            onPress={() => setDeleteModalVisible(true)}
          >
            <Ionicons name="trash-outline" size={24} color="#ff4444" style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#ff4444', fontSize: 16, fontWeight: '500' }}>Delete Account</Text>
              <Text style={{ color: '#999', fontSize: 14, marginTop: 2 }}>Permanently delete your account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#333', flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setPasswordModalVisible(false)} style={{ marginRight: 16 }}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', flex: 1 }}>Change Password</Text>
          </View>

          <ScrollView style={{ flex: 1, padding: 20 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#fff', marginBottom: 8, fontSize: 16 }}>Current Password</Text>
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
                placeholder="Enter current password"
                placeholderTextColor="#888"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!passwordLoading}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#fff', marginBottom: 8, fontSize: 16 }}>New Password</Text>
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
                placeholder="Enter new password"
                placeholderTextColor="#888"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!passwordLoading}
              />
              <Text style={{ color: '#888', fontSize: 12, marginTop: 5 }}>
                Must be 8+ characters with uppercase, lowercase, and number
              </Text>
            </View>

            <View style={{ marginBottom: 30 }}>
              <Text style={{ color: '#fff', marginBottom: 8, fontSize: 16 }}>Confirm New Password</Text>
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
                placeholder="Confirm new password"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!passwordLoading}
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: passwordLoading ? '#555' : '#d4af37',
                borderRadius: 10,
                padding: 15,
                alignItems: 'center',
              }}
              onPress={handleChangePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                  Change Password
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#333', flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={{ marginRight: 16 }}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', flex: 1 }}>Delete Account</Text>
          </View>

          <ScrollView style={{ flex: 1, padding: 20 }}>
            <View style={{ backgroundColor: '#ff4444', borderRadius: 10, padding: 15, marginBottom: 20 }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                ⚠️ This action cannot be undone
              </Text>
              <Text style={{ color: '#fff', fontSize: 14 }}>
                Deleting your account will permanently remove all your data, including:
              </Text>
              <Text style={{ color: '#fff', fontSize: 14, marginTop: 8 }}>
                • Profile information{'\n'}
                • VR experience progress{'\n'}
                • Learning achievements{'\n'}
                • AI conversation history
              </Text>
            </View>

            <View style={{ marginBottom: 30 }}>
              <Text style={{ color: '#fff', marginBottom: 8, fontSize: 16 }}>
                Enter your password to confirm deletion
              </Text>
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
                placeholder="Enter your password"
                placeholderTextColor="#888"
                value={deletePassword}
                onChangeText={setDeletePassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!deleteLoading}
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: deleteLoading ? '#555' : '#ff4444',
                borderRadius: 10,
                padding: 15,
                alignItems: 'center',
              }}
              onPress={handleDeleteAccount}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                  DELETE ACCOUNT
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 