import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import UniversalAlert from './AlertDialog';// Ensure this path is correct

const ProfileImageUploader = ({ onImageSelected }) => {
  const [hasPermissions, setHasPermissions] = useState({
    camera: null,
    mediaLibrary: null,
    fileSystem: true, // iOS doesn't require permissions, assuming granted on web.
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await requestCameraPermission();
      const mediaLibraryStatus = await requestMediaLibraryPermission();

      setHasPermissions({
        camera: cameraStatus === 'granted',
        mediaLibrary: mediaLibraryStatus === 'granted',
        fileSystem: true, // iOS doesn't need permissions, assuming granted on web.
      });
    };

    requestPermissions();
  }, []);

  const requestCameraPermission = async () => {
    let { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await ImagePicker.requestCameraPermissionsAsync();
      status = newStatus;
    }
    return status;
  };

  const requestMediaLibraryPermission = async () => {
    let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      status = newStatus;
    }
    return status;
  };

  const handleOptionSelect = async (option) => {
    switch (option) {
      case 'camera':
        if (hasPermissions.camera) {
          handleTakePicture();
        } else {
          showAlert("Permission required", "Camera access is required to take pictures.");
        }
        break;
      case 'mediaLibrary':
        if (hasPermissions.mediaLibrary) {
          handleSelectFromLibrary();
        } else {
          showAlert("Permission required", "Gallery access is required to select images.");
        }
        break;
      case 'fileSystem':
        handleSelectFromFiles();
        break;
      default:
        break;
    }
  };

  const handleTakePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const handleSelectFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const handleSelectFromFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
    });

    if (result.type !== 'cancel') {
      onImageSelected(result.uri);
    }
  };

  const showAlert = (title, message) => {
    setAlertMessage(message);
    setAlertSuccess(false);
    setAlertVisible(true);
  };

  const showOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Picture', 'Choose from Library', 'Upload from Files'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleOptionSelect('camera');
          if (buttonIndex === 2) handleOptionSelect('mediaLibrary');
          if (buttonIndex === 3) handleOptionSelect('fileSystem');
        }
      );
    } else if (Platform.OS === 'web') {
      // Web-specific logic to handle image picking
      handleSelectFromLibrary(); // Default to choosing from library on the web
    } else {
      showAlert(
        'Select Option',
        'Please choose an option for your profile image.',
        false
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Image" onPress={showOptions} />
      <UniversalAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
        success={alertSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ProfileImageUploader;
