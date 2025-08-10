import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function UpdateProfileImageScreen() {
  const router = useRouter();
  const { user, updateUser, refreshUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select an image.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    if (!user) {
      Alert.alert('Not Logged In', 'Please log in to update your profile image.');
      return;
    }

    setUploading(true);
    try {
      console.log('Starting image upload...');
      console.log('Selected image URI:', selectedImage);
      console.log('Current user:', user);
      
      // Handle the image URL
      let imageUrl = selectedImage;
      
      // If it's a local file URI, convert to base64
      if (selectedImage.startsWith('file://')) {
        try {
          console.log('Converting local image to base64...');
          
          // Check file size first
          const fileInfo = await FileSystem.getInfoAsync(selectedImage);
          if (fileInfo.exists && fileInfo.size) {
            const fileSizeMB = fileInfo.size / (1024 * 1024);
            console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);
            
            if (fileSizeMB > 10) {
              Alert.alert('File Too Large', 'Please select an image smaller than 10MB.');
              return;
            }
          }
          
          const base64 = await FileSystem.readAsStringAsync(selectedImage, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Get file extension from URI
          const extension = selectedImage.split('.').pop()?.toLowerCase() || 'jpeg';
          const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
          
          // Create data URL
          imageUrl = `data:${mimeType};base64,${base64}`;
          console.log('Image converted to base64 successfully');
        } catch (error) {
          console.error('Error converting image to base64:', error);
          Alert.alert('Error', 'Failed to process the selected image. Please try again.');
          return;
        }
      }
      
      console.log('Updating user with image URL:', imageUrl.substring(0, 100) + '...');
      
      // Update user profile with new image URL
      await updateUser({
        avatarUrl: imageUrl
      });

      // Refresh user data to ensure UI updates
      await refreshUser();

      console.log('User updated successfully!');
      Alert.alert('Success', 'Profile image updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      console.error('Error details:', error.message);
      
      if (error.message.includes('Invalid token')) {
        Alert.alert('Authentication Error', 'Please log in again to update your profile.');
      } else if (error.message.includes('avatarUrl')) {
        Alert.alert('Invalid Image URL', 'Please select a valid image.');
      } else {
        Alert.alert('Error', `Failed to upload image: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Profile Image',
      'Are you sure you want to remove your profile image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
                    await updateUser({
        avatarUrl: undefined
      });
              // Refresh user data to ensure UI updates
              await refreshUser();
              Alert.alert('Success', 'Profile image removed successfully!', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              console.error('Error removing image:', error);
              Alert.alert('Error', 'Failed to remove image. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Authentication Status */}
        {!user && (
          <View style={styles.authWarning}>
            <Ionicons name="warning" size={24} color="#f59e0b" />
            <Text style={styles.authWarningText}>Please log in to update your profile image</Text>
          </View>
        )}

        {/* Current Profile Image */}
        <View style={styles.currentImageSection}>
          <View style={styles.currentImageContainer}>
            <Image
              source={{ 
                uri: user?.avatarUrl || 'https://via.placeholder.com/300x300/EA580C/FFFFFF?text=Profile+Image' 
              }}
              style={styles.currentImage}
            />
          </View>
        </View>

        {/* New Image Preview */}
        {selectedImage && (
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>New Image Preview</Text>
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={24} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Image Selection Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Choose New Image</Text>
          
          <TouchableOpacity style={styles.optionCard} onPress={pickImage}>
            <View style={styles.optionIcon}>
              <Ionicons name="images-outline" size={32} color="#38bdf8" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Choose from Gallery</Text>
              <Text style={styles.optionSubtitle}>Select an existing photo from your device</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={takePhoto}>
            <View style={styles.optionIcon}>
              <Ionicons name="camera-outline" size={32} color="#10b981" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Take a Photo</Text>
              <Text style={styles.optionSubtitle}>Use your camera to take a new photo</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {selectedImage && (
            <TouchableOpacity 
              style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]} 
              onPress={uploadImage}
              disabled={uploading}
            >
              <Ionicons 
                name={uploading ? "hourglass-outline" : "cloud-upload-outline"} 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.uploadButtonText}>
                {uploading ? 'Uploading...' : 'Upload New Image'}
              </Text>
            </TouchableOpacity>
          )}

          {user?.avatarUrl && (
            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
              <Ionicons name="trash-outline" size={20} color="#dc2626" />
              <Text style={styles.removeImageButtonText}>Remove Current Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips for the best profile image:</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>Use a square image for best results</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>Ensure good lighting and clear visibility</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>Keep file size under 10MB for faster upload</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  currentImageSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'Tanker',
  },
  currentImageContainer: {
    alignItems: 'center',
  },
  currentImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#EA580C',
  },
  previewSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  previewContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#10b981',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: 40,
    backgroundColor: '#191919',
    borderRadius: 12,
  },
  optionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'Tanker',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'SpaceMono-Regular',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  uploadButtonDisabled: {
    backgroundColor: '#666',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Tanker',
  },
  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 16,
  },
  removeImageButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Tanker',
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'Tanker',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
    fontFamily: 'SpaceMono-Regular',
  },
  authWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  authWarningText: {
    fontSize: 14,
    color: '#f59e0b',
    marginLeft: 12,
    fontFamily: 'SpaceMono-Regular',
  },

}); 