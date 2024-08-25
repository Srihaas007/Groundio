import React, { useState } from 'react';
import { View, Text, Button, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import firebase from 'firebase'; // Adjust based on your Firebase import method

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  
  const handleFileSelectNative = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: true
      });
      if (result.type !== 'cancel') {
        setFiles(result.files ? result.files.map(file => ({ uri: file.uri, name: file.name })) : [{ uri: result.uri, name: result.name }]);
        console.log('Files selected:', result.files ? result.files.map(file => file.name) : [result.name]);
      }
    } catch (error) {
      console.error('Error selecting files:', error);
      Alert.alert('Error', 'An error occurred while picking the files.');
    }
  };

  const handlePhotoCapture = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    };

    let result = await ImagePicker.launchCameraAsync(options);
    if (!result.cancelled) {
      setFiles(prevFiles => [...prevFiles, { uri: result.uri, name: 'CapturedImage.jpg' }]);
      console.log('Photo captured:', result.uri);
    }
  };

  const handleFileUpload = async () => {
    if (!firebase.auth().currentUser) {
      Alert.alert('Error', 'You need to be logged in to upload files.');
      return;
    }

    try {
      for (let file of files) {
        const filename = `${firebase.auth().currentUser.uid}/${Date.now()}_${file.name}`;
        const storageRef = firebase.storage().ref().child(filename);

        const response = await fetch(file.uri);
        const blob = await response.blob();
        await storageRef.put(blob);

        const downloadURL = await storageRef.getDownloadURL();
        console.log('File available at:', downloadURL);
        // Store the download URL in your database (e.g., Firestore)
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      {Platform.OS === 'web' ? (
        <View>
          <input type="file" onChange={handleFileSelectWeb} multiple style={{ margin: 10, padding: 5 }} />
        </View>
      ) : (
        <View>
          <Button title="Select Files to Upload" onPress={handleFileSelectNative} />
          <Button title="Capture Photo" onPress={handlePhotoCapture} />
        </View>
      )}
      {files.length > 0 && <Text>Files ready to upload: {files.map(file => file.name).join(', ')}</Text>}
      <Button title="Upload Files" onPress={handleFileUpload} disabled={files.length === 0} />
    </View>
  );
};

export default FileUploader;
