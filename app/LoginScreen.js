import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import UniversalAlert from '../components/AlertDialog';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const navigation = useNavigation();

  const showMessage = (message, success = false) => {
    setAlertMessage(message);
    setAlertSuccess(success);
    setAlertVisible(true);

    if (success) {
      setEmail('');
      setPassword('');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage('Please enter both email and password.', false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        navigation.navigate('screens/customers/WelcomeScreen');
      } else {
        showMessage('Please verify your email before logging in.', false);
      }
    } catch (error) {
      showMessage(error.message, false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')} // Ensure this path is correct
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>Login</Text>
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
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable
            style={styles.forgotPasswordLink}
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
          >
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignUpScreen')}
          >
            Don't have an account? Sign up
          </Text>
        </View>
        <UniversalAlert
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          message={alertMessage}
          success={alertSuccess}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the background image covers the entire screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundImage: "url('../assets/images/background.jpg')",
  },
  inner: {
    width: '100%',  
    maxWidth: 500,
    backgroundColor: 'rgba(255, 255, 255, 1)', // Semi-transparent white background for the inner content
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
    color: '#333', // Ensure input text color is visible
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
  link: {
    textAlign: 'center',
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
  forgotPasswordLink: {
    marginVertical: 10,
  },
});
