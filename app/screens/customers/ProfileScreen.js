import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../services/firebase';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [userDetails, setUserDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.error('No user data found');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [navigation]);

  const handleInputChange = (name, value) => {
    setUserDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, userDetails);
        setEditMode(false);
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile.');
      }
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const userRef = doc(db, 'users', auth.currentUser.uid);
              await deleteDoc(userRef);
              // Add more cleanup tasks here if needed
              await auth.currentUser.delete();
              navigation.replace('screens/customers/LoginScreen'); // Navigate to login or initial screen after account deletion
            } catch (error) {
              console.error('Failed to delete account:', error);
              Alert.alert('Error', 'Failed to delete account.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Pressable style={styles.logoutButton} onPress={() => auth.signOut()}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: userDetails.profilePic || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profilePic}
          />
          <Text style={styles.title}>Profile</Text>
          {Object.entries(userDetails).map(([key, value]) => (
            <ProfileField
              key={key}
              label={key}
              value={value}
              editable={editMode && (key === 'mobile' || key === 'dob')}
              onChange={(text) => handleInputChange(key, text)}
            />
          ))}
          {editMode ? (
            <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.editButton} onPress={() => setEditMode(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
          )}
          <Pressable style={styles.settingsButton} onPress={() => navigation.navigate('screens/customers/SettingsScreen')}>
            <Text style={styles.buttonText}>Settings</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.buttonText}>Delete Account</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const ProfileField = ({ label, value, editable, onChange }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoLabel}>{label.charAt(0).toUpperCase() + label.slice(1)}:</Text>
    {editable ? (
      <TextInput
        style={styles.infoInput}
        value={value.toString()}
        onChangeText={onChange}
        autoCorrect={false}
      />
    ) : (
      <Text style={styles.info}>{value}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    minHeight: '100%',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  info: {
    fontSize: 16,
    color: '#333',
  },
  infoInput: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: 'center',
    width: '100%',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 25,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  settingsButton: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 25,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 25,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});
