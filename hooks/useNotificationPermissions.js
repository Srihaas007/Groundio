// hooks/useNotificationPermissions.js
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

const useNotificationPermissions = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        setHasPermission(status === 'granted');
      } else {
        // Assume permissions are granted on web
        setHasPermission(true);
      }
    };

    requestNotificationPermission();
  }, []);

  return hasPermission;
};

export default useNotificationPermissions;
