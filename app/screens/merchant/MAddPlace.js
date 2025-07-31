import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MAddPlace = () => {
  const [placeName, setPlaceName] = useState('');
  const [placeAddress, setPlaceAddress] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    // Handle the submission logic here, e.g., saving the place to a database
    console.log('Place Name:', placeName);
    console.log('Place Address:', placeAddress);
    
    // Navigate back to the dashboard after submission
    navigation.navigate('screens/merchant/MerchantDashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Place</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter place name"
        value={placeName}
        onChangeText={setPlaceName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter place address"
        value={placeAddress}
        onChangeText={setPlaceAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.welcomeButton} onPress={() => navigation.navigate('screens/merchant/MWelcomeScreen')}>
        <Text style={styles.welcomeButtonText}>Go to Welcome Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#32cd32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  welcomeButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  welcomeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MAddPlace;
