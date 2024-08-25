import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Platform,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db ,auth } from '../../../services/firebase';
import UniversalAlert from '../../../components/AlertDialog';
import { doc, getDoc } from 'firebase/firestore';

export default function MerchantLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const showMessage = (message, success = false) => {
    setAlertMessage(message);
    setAlertSuccess(success); 
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage('Please enter both email and password.', false);
      return;
    }

    setLoading(true);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'Merchants', user.uid));
        const userData = userDoc.data();

        if (!userData) {
            showMessage('User data not found.');
            return;
        }

        // Check if the role is 'merchant'
        if (userData.role !== 'merchant') {
            showMessage('You do not have access to this role.', false);
            setLoading(false);
            return;
        }

        if (user.emailVerified) {
            navigation.navigate('screens/merchant/MWelcomeScreen');
        } else {
            showMessage('Please verify your email before logging in.', false);
        }
    } catch (error) {
        showMessage(error.message, false);
    } finally {
        setLoading(false);
    }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <Text style={styles.title}>Merchant Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <Text style={styles.buttonText}>Logging in...</Text> : <Text style={styles.buttonText}>Login</Text>}
        </Pressable>
      </KeyboardAvoidingView>
      <UniversalAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
        success={alertSuccess}
      />
    </ScrollView>
  );
}

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
    maxWidth: 500,
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