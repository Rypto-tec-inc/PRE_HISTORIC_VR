import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';

interface MapMarker {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: 'tribe' | 'artifact' | 'historical' | 'cultural';
  image?: string;
  visited?: boolean;
  isFavorite?: boolean;
}

export default function MapScreen() {
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { user, loading } = useAuth();

  const loadData = async () => {
    try {
      // Load sample map data (in a real app, this would come from your backend)
      const sampleMarkers: MapMarker[] = [
        {
          id: 1,
          name: "Bassa Cultural Center",
          description: "Traditional Bassa village reconstruction with authentic artifacts and cultural performances.",
          latitude: 6.3156,
          longitude: -10.8074,
          category: 'tribe',
          image: 'bassa-center.jpg'
        },
        {
          id: 2,
          name: "Kpelle Heritage Site",
          description: "Ancient Kpelle settlement with traditional architecture and storytelling traditions.",
          latitude: 6.8291,
          longitude: -9.7295,
          category: 'tribe',
          image: 'kpelle-site.jpg'
        },
        {
          id: 3,
          name: "Grebo Fishing Village",
          description: "Coastal Grebo community showcasing traditional fishing techniques and boat building.",
          latitude: 4.7394,
          longitude: -7.7312,
          category: 'tribe',
          image: 'grebo-village.jpg'
        },
        {
          id: 4,
          name: "Stone Tool Discovery Site",
          description: "Archaeological site where prehistoric stone tools were discovered.",
          latitude: 6.4238,
          longitude: -9.4294,
          category: 'artifact',
          image: 'stone-tools.jpg'
        },
        {
          id: 5,
          name: "Ancient Pottery Workshop",
          description: "Site of traditional pottery making with examples of ancient techniques.",
          latitude: 6.5000,
          longitude: -10.0000,
          category: 'artifact',
          image: 'pottery-site.jpg'
        }
      ];

      setMarkers(sampleMarkers);
      
      // Load user favorites if logged in
      if (user) {
        // In a real app, you'd fetch this from the backend
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading map data:', error);
      // Set default markers even if API fails
      setMarkers([
        {
          id: 1,
          name: "Monrovia",
          description: "Capital city of Liberia",
          latitude: 6.3106,
          longitude: -10.8047,
          category: 'cultural'
        }
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleMarkerPress = (marker: MapMarker) => {
    setSelected(marker);
  };

  const toggleFavorite = async (markerId: number) => {
    try {
      if (favorites.includes(markerId)) {
        setFavorites(favorites.filter(id => id !== markerId));
        // In a real app: await apiClient.removeFromFavorites(markerId);
      } else {
        setFavorites([...favorites, markerId]);
        // In a real app: await apiClient.addToFavorites(markerId);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const markAsVisited = async (markerId: number) => {
    try {
      // In a real app: await apiClient.markLocationVisited(markerId);
      setMarkers(markers.map(marker => 
        marker.id === markerId ? { ...marker, visited: true } : marker
      ));
      Alert.alert('Success', 'Location marked as visited!');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark location as visited');
    }
  };

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'tribe': return '#d4af37';
      case 'artifact': return '#8b4513';
      case 'historical': return '#4169e1';
      case 'cultural': return '#32cd32';
      default: return '#ff6347';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 6.4281,
          longitude: -9.4295,
          latitudeDelta: 3.0,
          longitudeDelta: 3.0,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleMarkerPress(marker)}
            pinColor={getMarkerColor(marker.category)}
          />
        ))}
      </MapView>

      {/* Legend */}
      <View style={{
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        padding: 15,
        borderRadius: 10,
      }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', marginBottom: 10 }}>Legend</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <View style={{ width: 12, height: 12, backgroundColor: '#d4af37', borderRadius: 6, marginRight: 8 }} />
          <Text style={{ color: '#fff', fontSize: 12 }}>Tribal Sites</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <View style={{ width: 12, height: 12, backgroundColor: '#8b4513', borderRadius: 6, marginRight: 8 }} />
          <Text style={{ color: '#fff', fontSize: 12 }}>Artifacts</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <View style={{ width: 12, height: 12, backgroundColor: '#4169e1', borderRadius: 6, marginRight: 8 }} />
          <Text style={{ color: '#fff', fontSize: 12 }}>Historical</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, backgroundColor: '#32cd32', borderRadius: 6, marginRight: 8 }} />
          <Text style={{ color: '#fff', fontSize: 12 }}>Cultural</Text>
        </View>
      </View>

      {/* Location Details Modal */}
      <Modal
        visible={!!selected}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#333'
            }}>
              <TouchableOpacity onPress={() => setSelected(null)} style={{ marginRight: 16 }}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', flex: 1 }}>
                {selected.name}
              </Text>
              <TouchableOpacity onPress={() => toggleFavorite(selected.id)}>
                <Ionicons 
                  name={favorites.includes(selected.id) ? "heart" : "heart-outline"} 
                  size={24} 
                  color={favorites.includes(selected.id) ? "#d4af37" : "#666"} 
                />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={{ flex: 1, padding: 20 }}>
              <View style={{
                backgroundColor: '#2a2a2a',
                borderRadius: 10,
                padding: 15,
                marginBottom: 20
              }}>
                                 <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                   <MaterialCommunityIcons 
                     name={selected.category === 'tribe' ? 'account-group' : 
                           selected.category === 'artifact' ? 'pot' : 
                           selected.category === 'historical' ? 'castle' : 'earth'} 
                     size={20} 
                     color="#d4af37" 
                     style={{ marginRight: 8 }} 
                   />
                   <Text style={{ color: '#d4af37', fontSize: 14, textTransform: 'capitalize' }}>
                     {selected.category}
                   </Text>
                 </View>
                <Text style={{ color: '#fff', fontSize: 16, lineHeight: 24 }}>
                  {selected.description}
                </Text>
              </View>

              {/* Coordinates */}
              <View style={{
                backgroundColor: '#2a2a2a',
                borderRadius: 10,
                padding: 15,
                marginBottom: 20
              }}>
                <Text style={{ color: '#d4af37', fontSize: 14, marginBottom: 8 }}>Location</Text>
                <Text style={{ color: '#fff', fontSize: 14 }}>
                  Latitude: {selected.latitude.toFixed(4)}°
                </Text>
                <Text style={{ color: '#fff', fontSize: 14 }}>
                  Longitude: {selected.longitude.toFixed(4)}°
                </Text>
              </View>

              {/* Actions */}
              <View style={{ marginTop: 'auto' }}>
                {!selected.visited && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#d4af37',
                      borderRadius: 10,
                      padding: 15,
                      alignItems: 'center',
                      marginBottom: 10
                    }}
                    onPress={() => markAsVisited(selected.id)}
                  >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                      Mark as Visited
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={{
                    backgroundColor: '#333',
                    borderRadius: 10,
                    padding: 15,
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    // In a real app, this would navigate to VR experience
                    Alert.alert('VR Experience', 'VR experience for this location coming soon!');
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                    Launch VR Experience
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
} 