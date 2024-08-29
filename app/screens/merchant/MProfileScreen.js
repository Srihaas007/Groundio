import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as api from '../../../API/MerchantProfileAPI'; // Adjust the import path as needed
import CustomLoadingSpinner from '../../../components/CustomLoadingSpinner';
import UniversalAlert from '../../../components/AlertDialog';
import DatePickerNative from '../../../components/DatePickerNative';
import DatePickerWeb from '../../../components/DatePickerWeb';
import CustomCheckbox from '../../../components/CustomCheckbox';
import { styles } from '../../../styles/MerchantProfileStyles';

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

  const [initialProfileState, setInitialProfileState] = useState(profile);
  const [permissions, setPermissions] = useState({
    camera: false,
    mediaLibrary: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const fetchedProfile = await api.fetchProfile();
      if (fetchedProfile) {
        setProfile(fetchedProfile);
        setInitialProfileState(fetchedProfile);
      }
      setLoading(false);
    };
    fetchUserProfile();
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

  const handleSendOtp = async () => {
    const result = await api.handleSendOtp(profile.mobile);
    if (!result.success) {
      showAlert(result.message, false);
    } else {
      setOtpSent(true);
    }
  };

  const handleSaveProfile = async () => {
    setUploading(true);
    const result = await api.saveProfile(profile);
    showAlert(result.message, result.success);
    setUploading(false);
  };

  const handleOptionSelect = async (option) => {
    try {
      let selectedImageUri = null;
      if (option === 'camera' && permissions.camera) {
          console.log("Opening camera...");
          selectedImageUri = await api.handleTakePicture();
      } else if (option === 'mediaLibrary' && permissions.mediaLibrary) {
          console.log("Opening image library...");
          selectedImageUri = await api.handleSelectFromLibrary();
      }

      if (selectedImageUri) {
          console.log("Image selected:", selectedImageUri);
          setProfile((prev) => ({ ...prev, profilePicture: selectedImageUri })); // Store the selected image URI in profile
      } else {
          console.log("No image URI returned or operation canceled.");
      }
    } catch (error) {
      console.error("Error during image selection:", error);
      showAlert("Error", "An error occurred during image selection.");
    }
  };

  useEffect(() => {
    const requestUserPermissions = async () => {
        console.log("Requesting permissions...");
        const grantedPermissions = await api.requestPermissions();
        console.log("Permissions granted:", grantedPermissions);
        setPermissions(grantedPermissions);
    };
    requestUserPermissions();
  }, []);

  const handleProfilePictureClick = () => {
    console.log("Profile picture click...");
    if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Take a Picture", "Choose from Library", "Cancel"],
                cancelButtonIndex: 2,
            },
            (buttonIndex) => {
                console.log("ActionSheet option selected:", buttonIndex);
                if (buttonIndex === 0) {
                    handleOptionSelect('camera');
                } else if (buttonIndex === 1) {
                    handleOptionSelect('mediaLibrary');
                }
            }
        );
    } else {
        Alert.alert(
            "Select Option",
            "Choose an option to update your profile picture",
            [
                { text: "Take a Picture", onPress: () => handleOptionSelect('camera') },
                { text: "Choose from Library", onPress: () => handleOptionSelect('mediaLibrary') },
                { text: "Cancel", onPress: () => {}, style: "cancel" }
            ],
            { cancelable: true }
        );
    }
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

  const handleDocumentTypeChange = (type) => {
    setDocumentType(type);
    setIsVerified(false);
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
      showAlert(`${documentType.toUpperCase()} number is valid.`, true);
    } else {
      setIsVerified(false);
      showAlert(`Invalid ${documentType.toUpperCase()} number.`, false);
    }
  };

  const showAlert = (message, success = false) => {
    setAlertMessage(message);
    setAlertSuccess(success);
    setAlertVisible(true);
  };

  const handleBackPress = () => {
    navigation.navigate('screens/merchant/MWelcomeScreen');
  };

  const handleAlertClose = (confirmed) => {
    setAlertVisible(false);
    if (confirmed) {
      navigation.navigate('screens/merchant/MWelcomeScreen');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading || uploading ? (
          <CustomLoadingSpinner />
        ) : (
          <View style={styles.inner}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleProfilePictureClick} style={styles.profileImageContainer}>
              <Image
                source={{ uri: profile.profilePicture || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.profileImage}
              />
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>

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

            <Text style={styles.label}>Same as Home Address</Text>
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
              style={[styles.input, styles.disabledInput, { marginTop: 15 }]}
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
                <TouchableOpacity style={styles.button} onPress={api.handleVerifyOtp}>
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
        )}
      </ScrollView>
      <UniversalAlert
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          message={alertMessage}
          success={alertSuccess}
          onConfirm={() => handleAlertClose(true)}
      />
    </View>
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

export default MerchantProfileScreen;
