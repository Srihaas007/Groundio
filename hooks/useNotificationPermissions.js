// hooks/useNotificationPermissions.js
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const useNotificationPermissions = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android') {
        const permissionResult = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        setHasPermission(permissionResult === RESULTS.GRANTED);
      } else if (Platform.OS === 'ios') {
        const authorizationStatus = await messaging().requestPermission({
          alert: true,
          badge: true,
          sound: true,
          carPlay: true,
          criticalAlert: true,
          provisional: false,
          announcement: false,
        });
        // Set permission based on authorization status
        setHasPermission(
          authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
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
