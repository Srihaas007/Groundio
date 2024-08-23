import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import UniversalAlert from '../components/AlertDialog';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const navigation = useNavigation();
  const auth = getAuth();

  const showMessage = (message, success = false) => {
    setAlertMessage(message);
    setAlertSuccess(success);
    setAlertVisible(true);

    if (success) {
      setEmail('');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      showMessage('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showMessage('Password reset email sent.', true);
      setTimeout(() => navigation.navigate('Login'), 3000); // Navigate after 3 seconds
    } catch (error) {
      showMessage(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Pressable style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Send Reset Email</Text>
        </Pressable>
        <Pressable
          style={styles.link}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>Back to Login</Text>
        </Pressable>
      </View>
      <UniversalAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
        success={alertSuccess}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8', // Light background color
    padding: 20,
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignSelf: 'center',
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
    color: '#333', // Darker color for the title
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#1e90ff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
