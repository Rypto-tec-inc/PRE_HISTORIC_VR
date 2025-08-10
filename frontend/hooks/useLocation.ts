import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  heading?: number;
  speed?: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  errorMsg: string | null;
  isLoading: boolean;
  startLocationUpdates: () => Promise<void>;
  stopLocationUpdates: () => void;
  getCurrentLocation: () => Promise<LocationData | null>;
  isLocationEnabled: boolean;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const { updateUserLocation, isConnected } = useSocket();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setIsLocationEnabled(status === 'granted');
      
      if (status !== 'granted') {
        setErrorMsg('Location permission is required for this feature');
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      setErrorMsg('Failed to check location permission');
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setIsLocationEnabled(status === 'granted');
      
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setErrorMsg('Failed to request location permission');
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || 0,
        timestamp: currentLocation.timestamp,
        heading: currentLocation.coords.heading || undefined,
        speed: currentLocation.coords.speed || undefined,
      };

      setLocation(locationData);

      // Send location to Socket.IO if connected
      if (isConnected) {
        updateUserLocation(locationData.latitude, locationData.longitude, locationData.accuracy);
      }

      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      setErrorMsg('Failed to get current location');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startLocationUpdates = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      // Stop any existing subscription
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }

      // Start location updates
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          const locationData: LocationData = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy || 0,
            timestamp: newLocation.timestamp,
            heading: newLocation.coords.heading || undefined,
            speed: newLocation.coords.speed || undefined,
          };

          setLocation(locationData);

          // Send location to Socket.IO if connected
          if (isConnected) {
            updateUserLocation(locationData.latitude, locationData.longitude, locationData.accuracy);
          }
        }
      );

      console.log('Location updates started');
    } catch (error) {
      console.error('Error starting location updates:', error);
      setErrorMsg('Failed to start location updates');
    } finally {
      setIsLoading(false);
    }
  };

  const stopLocationUpdates = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      console.log('Location updates stopped');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  return {
    location,
    errorMsg,
    isLoading,
    startLocationUpdates,
    stopLocationUpdates,
    getCurrentLocation,
    isLocationEnabled,
  };
}; 