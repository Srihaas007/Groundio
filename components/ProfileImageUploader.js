// components/ProfileImageUploader.js
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import useCameraPermissions from '../hooks/useCameraPermissions';

const ProfileImageUploader = () => {
  const hasCameraPermission = useCameraPermissions();

  const handleTakePicture = () => {
    if (hasCameraPermission === null) {
      Alert.alert("Requesting permission...");
    } else if (!hasCameraPermission) {
      Alert.alert("Camera permission is not granted. Please enable it from settings.");
    } else {
      // Code to open camera and take a picture
      Alert.alert("Camera is ready to use!");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Profile Image Uploader</Text>
      <Button title="Take Picture" onPress={handleTakePicture} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }
});

export default ProfileImageUploader;
