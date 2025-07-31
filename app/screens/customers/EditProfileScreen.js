import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth } from '../../../services/firebase'; // Adjust import paths as necessary

const EditProfileScreen = ({ navigation }) => {
    const [userDetails, setUserDetails] = useState({
        fullName: '',
        email: '',
        mobile: '',
        dob: ''
    });

    const db = getFirestore();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserDetails(userDoc.data());
                }
            }
        };

        fetchUserDetails();
    }, []);

    const handleUpdate = async () => {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        try {
            await updateDoc(userDocRef, userDetails);
            alert('Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            alert('Error updating profile:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={userDetails.fullName}
                    onChangeText={(text) => setUserDetails({ ...userDetails, fullName: text })}
                    placeholder="Full Name"
                    placeholderTextColor="#ccc"
                />
                <TextInput
                    style={styles.input}
                    value={userDetails.email}
                    onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                />
                <TextInput
                    style={styles.input}
                    value={userDetails.mobile}
                    onChangeText={(text) => setUserDetails({ ...userDetails, mobile: text })}
                    placeholder="Mobile"
                    placeholderTextColor="#ccc"
                />
                <TextInput
                    style={styles.input}
                    value={userDetails.dob}
                    onChangeText={(text) => setUserDetails({ ...userDetails, dob: text })}
                    placeholder="Date of Birth"
                    placeholderTextColor="#ccc"
                />
            </View>
            <Pressable style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update Profile</Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212', // Dark background color
    },
    inputContainer: {
        marginBottom: 20
    },
    input: {
        height: 50,
        backgroundColor: '#333', // Dark input background
        borderColor: '#555', // Slightly lighter border for the input
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        color: '#fff', // White text for input
        paddingHorizontal: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4CAF50', // Green button for actions
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    }
});

export default EditProfileScreen;
