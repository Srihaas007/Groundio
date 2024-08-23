import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../services/firebase';
import UniversalAlert from '../components/AlertDialog';
import DatePickerNative from '../components/DatePickerNative';
import DatePickerWeb from '../components/DatePickerWeb';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;

const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [dob, setDob] = useState(new Date());
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const navigation = useNavigation();
  const db = getFirestore();

  const showMessage = (message, success = false) => {
    setAlertMessage(message);
    setAlertSuccess(success);
    setAlertVisible(true);

    // If the message is for a successful operation, reset all fields
    if (success) {
      setFullName('');
      setMobile('');
      setEmail('');
      setPassword('');
      setRetypePassword('');
      setDob(new Date());  // Resetting the date of birth to the current date or a default value
    }
  };

  const handleSignup = async () => {
    if (!fullName || !mobile || !email || !password || !retypePassword || !dob) {
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

    if (!passwordRegex.test(password)) {
      showMessage('Password must be at least 9 characters long, include uppercase letters, a number, and a special character.');
      return;
    }

    if (password !== retypePassword) {
      showMessage('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        mobile,
        email,
        dob: dob.toISOString().split('T')[0],
        role: 'customer',
      });

      showMessage('Sign up successful! A verification email has been sent to your email address. Please verify your email before logging in.', true);
      setTimeout(() => navigation.navigate('LoginScreen'), 5000);
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
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#666"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.dobContainer}>
          <Text style={styles.label}>Date of Birth:</Text>
          {Platform.OS === 'web' ? (
            <DatePickerWeb selectedDate={dob} onDateChange={setDob} />
          ) : (
            <DatePickerNative selectedDate={dob} onDateChange={setDob} />
          )}
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Text>{passwordVisible ? '🙈' : '👁️'}</Text>
          </Pressable>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Retype Password"
            placeholderTextColor="#666"
            value={retypePassword}
            onChangeText={setRetypePassword}
            secureTextEntry={!retypePasswordVisible}
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setRetypePasswordVisible(!retypePasswordVisible)}
          >
            <Text>{retypePasswordVisible ? '🙈' : '👁️'}</Text>
          </Pressable>
        </View>
        <Pressable style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        <Text style={styles.termsText}>
          By signing up, you have accepted our{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('TermsScreen')}
          >
            Terms and Conditions
          </Text>.
        </Text>

        <Pressable onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginText}>Already registered? Login here</Text>
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
    alignItems: 'center',
    padding: 20,
  },
  inner: {
    width: '100%',
    maxWidth: 550,
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
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
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
  dobContainer: {
    marginBottom: 5,
    zIndex:1000,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  termsText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
  loginText: {
    textAlign: 'center',
    color: '#1e90ff',
    marginTop: 10,
  },
});
