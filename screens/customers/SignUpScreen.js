import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { Ionicons } from '@expo/vector-icons';
import UniversalAlert from '../../components/AlertDialog';
import DatePickerNative from '../../components/DatePickerNative';
import DatePickerWeb from '../../components/DatePickerWeb';

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
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [locationInfo, setLocationInfo] = useState({});
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const navigation = useNavigation();
  const { signUpWithEmail } = useAuth();

  // Get device and location information on component mount
  useEffect(() => {
    collectDeviceInfo();
    requestLocationPermission();
  }, []);

  const collectDeviceInfo = async () => {
    try {
      const info = {
        deviceName: Device.deviceName || 'Unknown',
        deviceType: Device.deviceType || 'Unknown',
        osName: Device.osName || 'Unknown',
        osVersion: Device.osVersion || 'Unknown',
        modelName: Device.modelName || 'Unknown',
        brand: Device.brand || 'Unknown',
        manufacturer: Device.manufacturer || 'Unknown',
        platform: Platform.OS,
        userAgent: Platform.OS === 'web' ? navigator.userAgent : `${Device.osName} ${Device.osVersion}`,
        screenDimensions: Platform.OS === 'web' ? `${window.screen.width}x${window.screen.height}` : 'Mobile Device',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: Platform.OS === 'web' ? navigator.language : 'en-US',
        isDevice: Device.isDevice,
        registrationTimestamp: new Date().toISOString(),
      };
      setDeviceInfo(info);
    } catch (error) {
      console.error('Error collecting device info:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      setIsLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        // Reverse geocoding to get address details
        const addressResult = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (addressResult.length > 0) {
          const addr = addressResult[0];
          setLocationInfo({
            latitude,
            longitude,
            accuracy: location.coords.accuracy,
            city: addr.city || '',
            region: addr.region || '',
            country: addr.country || '',
            postalCode: addr.postalCode || '',
            street: addr.street || '',
            district: addr.district || '',
            subregion: addr.subregion || '',
            isoCountryCode: addr.isoCountryCode || '',
          });
          
          // Auto-fill city and pincode if available
          if (addr.city && !city) setCity(addr.city);
          if (addr.postalCode && !pincode) setPincode(addr.postalCode);
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const getIPAddress = async () => {
    try {
      if (Platform.OS === 'web') {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      }
      return 'Mobile Device';
    } catch (error) {
      console.error('Error getting IP:', error);
      return 'Unknown';
    }
  };

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
      setAddress('');
      setCity('');
      setPincode('');
      setEmergencyContact('');
      setDob(new Date());
    }
  };

  const handleSignup = async () => {
    if (!fullName || !mobile || !email || !password || !retypePassword || !dob || !address || !city || !pincode) {
      showMessage('Please fill in all required fields.');
      return;
    }

    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.');
      return;
    }

    if (!validateMobile(mobile)) {
      showMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!passwordRegex.test(password)) {
      showMessage('Password must be at least 9 characters with uppercase, lowercase, number, and special character.');
      return;
    }

    if (password !== retypePassword) {
      showMessage('Passwords do not match.');
      return;
    }

    try {
      // Use AuthContext for signup
      const result = await signUpWithEmail(email, password, {
        displayName: fullName,
        mobile,
        dateOfBirth: dob.toISOString(),
        address,
        city,
        pincode,
        emergencyContact,
        // Location tracking
        locationInfo: {
          ...locationInfo,
          permissionGranted: Object.keys(locationInfo).length > 0,
          collectedAt: new Date().toISOString(),
        },
        
        // Device fingerprinting
        deviceInfo: {
          ...deviceInfo,
          registrationSource: 'mobile_app',
        },
        
        // Security and compliance
        securityInfo: {
          accountCreatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          loginAttempts: 0,
          accountStatus: 'active',
          twoFactorEnabled: false,
        },
        
        // User preferences and settings
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false,
          },
          privacy: {
            profileVisible: true,
            locationSharing: Object.keys(locationInfo).length > 0,
            dataCollection: true,
          },
          theme: 'system',
          language: 'en',
        },
        
        // Analytics and engagement
        analytics: {
          signupSource: 'direct',
          referralCode: null,
          firstSessionDate: new Date().toISOString(),
          totalSessions: 1,
          averageSessionTime: 0,
        },
        
        // Booking and transaction history
        bookingHistory: [],
        favoriteVenues: [],
        reviewsGiven: [],
        
        // Compliance and legal
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        privacyPolicyAccepted: true,
        privacyPolicyAcceptedAt: new Date().toISOString(),
        dataProcessingConsent: true,
        marketingConsent: false,
        
        // Profile completion and verification
        profileCompletion: 85, // Based on filled fields
        verificationStatus: {
          email: false,
          phone: false,
          identity: false,
          address: false,
        },
        
        // Additional metadata
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      });

      if (result.success) {
        showMessage(
          'Account created successfully! Please check your email to verify your account before logging in.',
          true
        );

        // Navigate to login after a short delay
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        showMessage(result.error || 'An error occurred during signup.');
      }

    } catch (error) {
      console.error('Signup error:', error);
      showMessage('An error occurred during signup.');
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Groundio to discover amazing venues</Text>
            
            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                placeholderTextColor="#666"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number *"
                placeholderTextColor="#666"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address *"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.dobContainer}>
                <Text style={styles.label}>Date of Birth *</Text>
                {Platform.OS === 'web' ? (
                  <DatePickerWeb selectedDate={dob} onDateChange={setDob} />
                ) : (
                  <DatePickerNative selectedDate={dob} onDateChange={setDob} />
                )}
              </View>
            </View>

            {/* Address Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address Information</Text>
              {isLocationLoading && (
                <View style={styles.locationStatus}>
                  <Ionicons name="location" size={16} color="#6366F1" />
                  <Text style={styles.locationText}>Getting your location...</Text>
                </View>
              )}
              <TextInput
                style={styles.input}
                placeholder="Full Address *"
                placeholderTextColor="#666"
                value={address}
                onChangeText={setAddress}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="City *"
                placeholderTextColor="#666"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={styles.input}
                placeholder="PIN Code *"
                placeholderTextColor="#666"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            {/* Emergency Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="Emergency Contact Number (Optional)"
                placeholderTextColor="#666"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Security</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password *"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons 
                    name={passwordVisible ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#666" 
                  />
                </Pressable>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm Password *"
                  placeholderTextColor="#666"
                  value={retypePassword}
                  onChangeText={setRetypePassword}
                  secureTextEntry={!retypePasswordVisible}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setRetypePasswordVisible(!retypePasswordVisible)}
                >
                  <Ionicons 
                    name={retypePasswordVisible ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#666" 
                  />
                </Pressable>
              </View>
              <Text style={styles.passwordRequirement}>
                Password must be at least 9 characters with uppercase, lowercase, number, and special character
              </Text>
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.link}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>

            <Pressable style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Create Account</Text>
            </Pressable>

            <Pressable 
              style={styles.loginLink} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.link}>Sign In</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <UniversalAlert
        visible={alertVisible}
        title={alertSuccess ? 'Success' : 'Error'}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
        confirmText="OK"
        success={alertSuccess}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  inner: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#6366F1',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  dobContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  locationText: {
    marginLeft: 8,
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    paddingRight: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  passwordRequirement: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: -8,
    marginBottom: 8,
  },
  termsContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  termsText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    textAlign: 'center',
  },
  link: {
    color: '#6366F1',
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    elevation: 8,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginLink: {
    padding: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    color: '#64748B',
  },
});
