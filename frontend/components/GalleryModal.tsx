import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface GalleryModalProps {
  visible: boolean;
  imageSource: any;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GalleryModal({
  visible,
  imageSource,
  onClose,
  title,
  subtitle,
}: GalleryModalProps) {
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          <View style={styles.placeholder} />
        </View>

        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.expandedImage}
            resizeMode="contain"
          />
          
          {/* Image Info */}
          {(title || subtitle) && (
            <View style={styles.imageInfo}>
              {title && <Text style={styles.imageTitle}>{title}</Text>}
              {subtitle && <Text style={styles.imageSubtitle}>{subtitle}</Text>}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Tanker',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  expandedImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.6,
    borderRadius: 12,
  },
  imageInfo: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 16,
  },
  imageTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 4,
  },
  imageSubtitle: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
  },
}); 