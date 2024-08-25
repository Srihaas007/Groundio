import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../../services/firebase';
import * as Location from 'expo-location';
import UniversalAlert from '../../../components/AlertDialog';

const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

const MerchantSignupScreen = () => {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [location, setLocation] = useState(null); // Location state
  const [locationPermission, setLocationPermission] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const navigation = useNavigation();
  const db = getFirestore();

  useEffect(() => {
    const checkLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    };

    checkLocationPermission();
  }, []);

  const fetchLocation = async () => {
    if (!locationPermission) {
        showMessage('Location permission is required to fetch your location.');
        return;
    }

    try {
        const locationData = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = locationData.coords;
        setLocation(`${latitude}, ${longitude}`);
        console.log('Location fetched:', `${latitude}, ${longitude}`);
    } catch (error) {
        console.error('Error fetching location:', error);
        showMessage('Unable to fetch location. Please try again.');
    }
};


  const showMessage = (message, success = false) => {
    setAlertMessage(message);
    setAlertSuccess(success);
    setAlertVisible(true);
  };

  const handleSignup = async () => {
    if (!businessName || !ownerName || !mobile || !email || !password || !retypePassword) {
        showMessage('Please fill in all fields.');
        return;
    }

    if (!validateEmail(email)) {
        showMessage('Invalid email format.');
        return;
    }

    if (!validateMobile(mobile)) {
        showMessage('Invalid mobile number. It should be 10 digits.');
        return;
    }

    if (password !== retypePassword) {
        showMessage('Passwords do not match.');
        return;
    }

    // Fetch location before signing up
    await fetchLocation();

    // Check if location was successfully fetched
    if (!location) {
        showMessage('Location is required. Please allow location access.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        
        await setDoc(doc(db, 'Merchants', userCredential.user.uid), {
            businessName,
            ownerName,
            mobile,
            email,
            location,  // Ensure location is saved here
            role: 'merchant'
        });

        showMessage('Merchant sign up successful! A verification email has been sent.', true);
        setTimeout(() => navigation.navigate('screens/merchant/MLoginScreen'), 5000);
    } catch (error) {
        showMessage(error.message);
    }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <Text style={styles.title}>Merchant Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          placeholderTextColor="#666"
          value={businessName}
          onChangeText={setBusinessName}
        />
        <TextInput
          style={styles.input}
          placeholder="Owner's Name"
          placeholderTextColor="#666" 
          value={ownerName}
          onChangeText={setOwnerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#666" 
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666" 
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Retype Password"
          placeholderTextColor="#666" 
          secureTextEntry={true}
          value={retypePassword}
          onChangeText={setRetypePassword}
        />
        
        <Pressable style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('screens/merchant/MLoginScreen')}>
          <Text style={styles.loginText}>Already registered? Login here</Text>
        </Pressable>
      </KeyboardAvoidingView>
      <UniversalAlert visible={alertVisible} onClose={() => setAlertVisible(false)} message={alertMessage} success={alertSuccess} />
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
  inner: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
    color: '#333',
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MerchantSignupScreen;
