import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';

const useFileUploadPermissions = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'web') {
        // On web, assume permission is granted if file input is available
        setHasPermission(true);
      } else if (Platform.OS === 'android') {
        const { status } = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);
        if (status !== 'granted') {
          const { status: newStatus } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
          setHasPermission(newStatus === 'granted');
          if (newStatus !== 'granted') {
            Alert.alert("Permission required", "This app needs access to your file storage to upload files.");
          }
        } else {
          setHasPermission(true);
        }
      } else {
        // iOS does not require additional permissions for file picking
        setHasPermission(true);
      }
    };

    requestPermission();
  }, []);

  return hasPermission;
};

export default useFileUploadPermissions;
