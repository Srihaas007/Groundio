import React, { useState, useEffect } from 'react';
import { View, Button, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; // Import FileSystem for file operations
import UniversalAlert from './AlertDialog'; // Ensure this path is correct
import RNHeicConverter from 'react-native-heic-converter';

const ProfileImageUploader = ({ onImageSelected }) => {
  const [permissions, setPermissions] = useState({
    camera: null,
    mediaLibrary: null,
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
      const mediaLibraryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (cameraStatus.status !== 'granted') {
        const { status: newCameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        cameraStatus.status = newCameraStatus;
      }

      if (mediaLibraryStatus.status !== 'granted') {
        const { status: newMediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        mediaLibraryStatus.status = newMediaLibraryStatus;
      }

      setPermissions({
        camera: cameraStatus.status === 'granted',
        mediaLibrary: mediaLibraryStatus.status === 'granted',
      });
    };

    requestPermissions();
  }, []);

  const handleOptionSelect = async (option) => {
    if (option === 'camera' && permissions.camera) {
      handleTakePicture();
    } else if (option === 'mediaLibrary' && permissions.mediaLibrary) {
      handleSelectFromLibrary();
    } else if (option === 'fileSystem') {
      handleSelectFromFiles();
    } else {
      showAlert("Permission required", "You need to grant permission to access this feature.");
    }
  };

  const handleTakePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        // Convert to JPEG format if necessary
        const fileExtension = imageUri.split('.').pop().toLowerCase();
        if (fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
          const convertedUri = await convertImageToJpeg(imageUri);
          onImageSelected(convertedUri);
        } else {
          onImageSelected(imageUri);
        }
      } else {
        showAlert("Error", "Failed to capture image. Please try again.");
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      showAlert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const convertImageToJpeg = async (uri) => {
    try {
      // Check for HEIC extension
      const fileExtension = uri.split('.').pop().toLowerCase();
      let newUri = uri;
  
      if (fileExtension === 'heic' || fileExtension === 'heif') {
        // Use a library like react-native-heic-converter to convert to JPEG
  
        // Example usage assuming the library is installed and imported
        const convertedData = await RNHeicConverter.convert({ path: uri });
        if (convertedData.success) {
          newUri = convertedData.path;
        } else {
          console.error("Error converting HEIC to JPEG:", convertedData.error);
          showAlert("Error", "Failed to convert HEIC image. Please try again.");
          return uri; // Fallback to original URI on conversion error
        }
      }
  
      // Resize image if necessary to meet size limit
      const imageInfo = await FileSystem.infoAsync({ uri: newUri });
      if (imageInfo.size > MAX_IMAGE_SIZE) {
        const resizedUri = await resizeImage(newUri, MAX_IMAGE_SIZE);
        newUri = resizedUri;
      }
  
      return newUri;
    } catch (error) {
      console.error("Error converting image:", error);
      showAlert("Error", "Failed to convert image. Please try again.");
      return uri; // Fallback to original URI on error
    }
  };

  const handleSelectFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelected(result.assets[0].uri);
    } else {
      showAlert("Error", "Failed to select image from library. Please try again.");
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

  return (
    <View style={styles.container}>
      <Button title="Choose Image" onPress={() => handleOptionSelect('mediaLibrary')} />
      <Button title="Upload from Files" onPress={() => handleOptionSelect('fileSystem')} />
      <Button title="Take a Picture" onPress={() => handleOptionSelect('camera')} />
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
    // Add your styling here
  },
});

export default ProfileImageUploader;
