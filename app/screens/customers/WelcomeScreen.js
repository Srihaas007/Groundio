import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import UniversalAlert from '../../../components/AlertDialog';
import { Ionicons } from '@expo/vector-icons'; // Import icons

export default function WelcomeScreen() {
  const [userName, setUserName] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [location, setLocation] = useState('');
  const navigation = useNavigation();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.fullName);
          } else {
            showMessage('User data not found.', false);
          }
        } else {
          showMessage('No user is currently logged in.', false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        showMessage(error.message, false);
      }
    };

    fetchUserName();
  }, []);

  const showMessage = (message, success) => {
    setAlertMessage(message);
    setAlertSuccess(success);
    setAlertVisible(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('LoginScreen');
    } catch (error) {
      showMessage('Failed to log out.', false);
    }
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  // Mock profile picture URL
  const profilePicUrl = 'https://randomuser.me/api/portraits/men/1.jpg';

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TextInput
          style={styles.locationInput}
          placeholder="Enter your location"
          value={location}
          onChangeText={setLocation}
        />
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleNavigate('screens/customers/Notification')}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigate('screens/customers/ProfileScreen')}>
            <Ionicons name="person-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      <Text style={styles.message}>You have successfully logged in.</Text>
      <Button title="Logout" onPress={handleLogout} color="#1e90ff" />
      <UniversalAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
        success={alertSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8', // Light background color
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  locationInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Darker color for the title
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666', // Medium gray color for the message
  },
});
