import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db, storage } from '../../../services/firebase'; // Ensure this path is correct
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import CustomLoadingSpinner from '../../../components/CustomLoadingSpinner';
import UniversalAlert from '../../../components/AlertDialog';
import DatePickerNative from '../../../components/DatePickerNative';
import DatePickerWeb from '../../../components/DatePickerWeb';
import CustomCheckbox from '../../../components/CustomCheckbox';
import ProfileImageUploader from '../../../components/ProfileImageUploader';


const MerchantProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({
    ownerName: '',
    businessName: '',
    homeAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    aadharNumber: '',
    panNumber: '',
    profilePicture: null,
    email: '', 
    dob: new Date(),
    mobile: '',
    otp: '',
  });  
  const [otpSent, setOtpSent] = useState(false);
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
  const [documentType, setDocumentType] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!validateMobile(profile.mobile)) {
      setAlertMessage('Invalid mobile number. It should be 10 digits.');
      setAlertVisible(true);
      return;
    }
    // Implement OTP sending logic here
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    // Implement OTP verification logic here
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const profileDocRef = doc(db, 'Merchants', user.uid);
        const profileDoc = await getDoc(profileDocRef);
        if (profileDoc.exists()) {
          const fetchedProfile = profileDoc.data();
          setProfile({
            ...fetchedProfile,
            dob: fetchedProfile.dob ? new Date(fetchedProfile.dob) : new Date(),  // Convert dob to Date object
          });
        }
      }
      setLoading(false);
    };    
    fetchProfile();
  }, []);

  useEffect(() => {
    const calculateProgress = () => {
      const filledFields = Object.values(profile).filter(
        (value) => value && (typeof value === 'string' ? value.trim() !== '' : true)
      ).length;
      const totalFields = Object.keys(profile).length;
      setProgress((filledFields / totalFields) * 100);
    };
    calculateProgress();
  }, [profile]);

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const uploadImage = async (imageUri, imageName) => {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const imageRef = ref(storage, `profiles/${user.uid}/${imageName}`);
          await uploadBytes(imageRef, blob);
          return getDownloadURL(imageRef);
        };

        const profilePictureUrl = profile.profilePicture
          ? await uploadImage(profile.profilePicture, 'profilePicture.jpg')
          : null;

        const profileDocRef = doc(db, 'Merchants', user.uid);
        await setDoc(profileDocRef, {
          ...profile,
          dob: profile.dob.toISOString().split('T')[0],
          profilePicture: profilePictureUrl,
        });

        setAlertMessage('Profile updated successfully!');
        setAlertSuccess(true);
        setAlertVisible(true);
      } catch (error) {
        setAlertMessage('Failed to update profile.');
        setAlertSuccess(false);
        setAlertVisible(true);
      }
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfile((prev) => ({ ...prev, profilePicture: result.assets[0].uri }));
    }
  };

  const handleVerifyDocument = () => {
    let regex = null;
    let document = '';

    if (documentType === 'aadhar') {
      regex = /^\d{12}$/;
      document = profile.aadharNumber;
    } else if (documentType === 'pan') {
      regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      document = profile.panNumber;
    }

    if (regex && regex.test(document)) {
      setIsVerified(true);
      setAlertMessage(`${documentType.toUpperCase()} number is valid.`);
      setAlertSuccess(true);
      setAlertVisible(true);
    } else {
      setIsVerified(false);
      setAlertMessage(`Invalid ${documentType.toUpperCase()} number.`);
      setAlertSuccess(false);
      setAlertVisible(true);
    }
  };

  const handleDocumentTypeChange = (type) => {
    setDocumentType(type);
    setIsVerified(false);
  };

  const onDateChange = (date) => {
    setProfile((prev) => ({ ...prev, dob: date }));
  };

  const handleAddressChange = (type, field, value) => {
    if (type === 'home') {
      setProfile((prev) => ({ ...prev, homeAddress: { ...prev.homeAddress, [field]: value } }));
      if (sameAddress) {
        setProfile((prev) => ({ ...prev, businessAddress: { ...prev.homeAddress, [field]: value } }));
      }
    } else {
      setProfile((prev) => ({ ...prev, businessAddress: { ...prev.businessAddress, [field]: value } }));
    }
  };

  const toggleSameAddress = () => {
    setSameAddress(!sameAddress);
    if (!sameAddress) {
      setProfile((prev) => ({ ...prev, businessAddress: prev.homeAddress }));
    } else {
      setProfile((prev) => ({ ...prev, businessAddress: {} }));
    }
  };

  const handleBackPress = () => {
    navigation.navigate('screens/merchant/MWelcomeScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <CustomLoadingSpinner />}
      <View style={styles.inner}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.profileImageContainer}>
          <ProfileImageUploader onImageSelected={(uri) => setProfile((prev) => ({ ...prev, profilePicture: uri }))} />
          <Image
            source={{ uri: profile.profilePicture || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.editIcon}>✎</Text>
        </View>


        <Text style={styles.title}>Profile</Text>
        <Text style={styles.progress}>Profile Completion: {Math.round(progress)}%</Text>

        {progress < 100 && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              Your profile is incomplete. Please fill out all fields to reach 100% completion.
            </Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          placeholderTextColor="#666"
          value={profile.ownerName}
          onChangeText={(text) => setProfile((prev) => ({ ...prev, ownerName: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          placeholderTextColor="#666"
          value={profile.businessName}
          onChangeText={(text) => setProfile((prev) => ({ ...prev, businessName: text }))}
        />

        <Text style={styles.label}>Home Address</Text>
        <AddressInputs
          address={profile.homeAddress}
          onAddressChange={(field, value) => handleAddressChange('home', field, value)}
        />

        <Text>Same as Home Address</Text>
        <CustomCheckbox value={sameAddress} onValueChange={toggleSameAddress} />
    
        {!sameAddress && (
          <>
            <Text style={styles.label}>Business Address</Text>
            <AddressInputs
              address={profile.businessAddress}
              onAddressChange={(field, value) => handleAddressChange('business', field, value)}
            />
          </>
        )}

        <View style={styles.documentSection}>
          <Text style={styles.label}>Select Document Type:</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              onPress={() => handleDocumentTypeChange('aadhar')}
              style={[styles.dropdownButton, documentType === 'aadhar' && styles.dropdownSelected]}
            >
              <Text style={styles.dropdownText}>Aadhar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDocumentTypeChange('pan')}
              style={[styles.dropdownButton, documentType === 'pan' && styles.dropdownSelected]}
            >
              <Text style={styles.dropdownText}>PAN</Text>
            </TouchableOpacity>
          </View>
          {documentType === 'aadhar' && (
            <TextInput
              style={styles.input}
              placeholder="Aadhar Number"
              placeholderTextColor="#666"
              value={profile.aadharNumber}
              keyboardType="numeric"
              onChangeText={(text) => {
                setProfile((prev) => ({ ...prev, aadharNumber: text }));
                setIsVerified(/^\d{12}$/.test(text));
              }}
            />
          )}
          {documentType === 'pan' && (
            <TextInput
              style={styles.input}
              placeholder="PAN Number"
              placeholderTextColor="#666"
              value={profile.panNumber}
              onChangeText={(text) => {
                setProfile((prev) => ({ ...prev, panNumber: text }));
                setIsVerified(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(text));
              }}
            />
          )}
          <TouchableOpacity
            style={[styles.verifyButton, isVerified ? styles.verifyButtonActive : styles.verifyButtonDisabled]}
            onPress={handleVerifyDocument}
            disabled={!isVerified}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={profile.email}
          editable={false}
        />
        <View style={styles.dobContainer}>
          <Text style={styles.label}>Date of Birth:</Text>
          {Platform.OS === 'web' ? (
            <DatePickerWeb selectedDate={profile.dob} onDateChange={(date) => setProfile((prev) => ({ ...prev, dob: date }))} />
          ) : (
            <DatePickerNative selectedDate={profile.dob} onDateChange={(date) => setProfile((prev) => ({ ...prev, dob: date }))} />
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          value={profile.mobile}
          onChangeText={(text) => setProfile((prev) => ({ ...prev, mobile: text }))}
        />
      
        {otpSent ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#666"
              value={profile.otp}
              onChangeText={(text) => setProfile((prev) => ({ ...prev, otp: text }))}
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
      <UniversalAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
        success={alertSuccess}
      />
    </ScrollView>
  );
};

const AddressInputs = ({ address = {}, onAddressChange }) => {
  return (
    <View style={styles.addressContainer}>
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        placeholderTextColor="#666"
        value={address.street || ''}
        onChangeText={(text) => onAddressChange('street', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor="#666"
        value={address.city || ''}
        onChangeText={(text) => onAddressChange('city', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        placeholderTextColor="#666"
        value={address.state || ''}
        onChangeText={(text) => onAddressChange('state', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Zip Code"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={address.zip || ''}
        onChangeText={(text) => onAddressChange('zip', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        placeholderTextColor="#666"
        value={address.country || ''}
        onChangeText={(text) => onAddressChange('country', text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  progress: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  warningContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  addressContainer: {
    marginBottom: 20,
    width: '90%',
  },
  documentSection: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dropdownButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  dropdownSelected: {
    backgroundColor: '#dcdcdc',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  verifyButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  verifyButtonActive: {
    backgroundColor: '#32cd32',
  },
  verifyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#32cd32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MerchantProfileScreen;
