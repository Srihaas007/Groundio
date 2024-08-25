// hooks/useFileUploadPermissions.js
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const useFileUploadPermissions = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'web') {
        // On web, assume permission is granted if file input is available
        setHasPermission(true);
      } else {
        // Request permission for Android or iOS
        const permissionType = Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY;

        const permissionResult = await request(permissionType);
        setHasPermission(permissionResult === RESULTS.GRANTED);
      }
    };

    requestPermission();
  }, []);

  return hasPermission;
};

export default useFileUploadPermissions;
