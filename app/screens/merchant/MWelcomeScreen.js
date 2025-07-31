import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../services/firebase'; // Corrected import path
import { doc, getDoc } from 'firebase/firestore';

const MerchantWelcomeScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [merchantDetails, setMerchantDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const currentUser = auth.currentUser; // Get the authenticated user
      if (currentUser) {
        setUser({
          email: currentUser.email,
          displayName: currentUser.displayName || 'Valued Merchant'
        });

        // Fetch merchant details from Firestore
        const userDocRef = doc(db, 'Merchants', currentUser.uid); // Correct usage of `doc`
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setMerchantDetails(docSnap.data());
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('screens/merchant/MLoginScreen'); // Redirect to Login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const handleGoToDashboard = () => {
    navigation.navigate('screens/merchant/MerchantDashboard'); // Navigate to Dashboard
  };

  const handleAddPlace = () => {
    navigation.navigate('screens/merchant/MAddPlace'); // Navigate to Add Place Screen
  };

  const handleGoToProfile = () => {
    navigation.navigate('screens/merchant/MProfileScreen'); // Navigate to Profile Screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleGoToProfile} style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </Pressable>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>
      <View style={styles.inner}>
        <Image
          source={require('../../../assets/images/background.jpg')} // Replace with an appropriate image
          style={styles.welcomeImage}
        />
        <Text style={styles.title}>Welcome, {user ? user.displayName : 'Loading...'}</Text>
        <Text style={styles.description}>
          Manage your bookings, view your earnings, and update your availability all from one place.
        </Text>
        {merchantDetails && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>Business Name: {merchantDetails.businessName}</Text>
            <Text style={styles.detailsText}>Email: {user.email}</Text>
            <Text style={styles.detailsText}>Location: {merchantDetails.location || 'Not set'}</Text>
          </View>
        )}
        <Pressable style={styles.button} onPress={handleAddPlace}>
          <Text style={styles.buttonText}>Add a Place/Ground</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleGoToDashboard}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    elevation: 5,
  },
  profileButton: {
    padding: 10,
  },
  profileButtonText: {
    fontSize: 16,
    color: '#1e90ff',
  },
  logoutButton: {
    padding: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#ff6347',
  },
  inner: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MerchantWelcomeScreen;
