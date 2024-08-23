import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import UniversalAlert from '../../../components/AlertDialog';

export default function WelcomeScreen() {
  const [userName, setUserName] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userName}!</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8', // Light background color
  },
  title: {
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
