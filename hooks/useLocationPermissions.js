// hooks/useLocationPermissions.js
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

const useLocationPermissions = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'web') {
        // Web location request using navigator.geolocation
        navigator.geolocation.getCurrentPosition(
          () => setHasPermission(true),  // Success handler
          () => setHasPermission(false), // Error handler
          { enableHighAccuracy: true }   // Options
        );
      } else {
        // Request location permission for mobile platforms
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    };

    requestPermission();
  }, []);

  return hasPermission;
};

export default useLocationPermissions;
