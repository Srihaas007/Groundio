import { auth, db, storage } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; // Import expo-image-manipulator
import { Alert } from 'react-native';

// Fetch profile data from Firestore
export const fetchProfile = async () => {
    const user = auth.currentUser;
    if (user) {
        const profileDocRef = doc(db, 'Merchants', user.uid);
        const profileDoc = await getDoc(profileDocRef);
        if (profileDoc.exists()) {
            const fetchedProfile = profileDoc.data();
            return {
                ...fetchedProfile,
                dob: fetchedProfile.dob ? new Date(fetchedProfile.dob) : new Date(), // Convert dob to Date object
            };
        }
    }
    return null;
};

// Compress image before upload using expo-image-manipulator
const compressImage = async (uri) => {
    try {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [],
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress to 50% quality, change as needed
        );
        return manipResult.uri;
    } catch (error) {
        console.error('Error compressing image:', error);
        return uri; // Return original URI in case of an error
    }
};

// Save profile data to Firestore, including profile picture
export const saveProfile = async (profile) => {
    const user = auth.currentUser;
    if (user) {
        try {
            const uploadImage = async (imageUri, imageName) => {
                const compressedUri = await compressImage(imageUri); // Compress image before upload
                const response = await fetch(compressedUri);
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
            return { success: true, message: 'Profile updated successfully!' };
        } catch (error) {
            console.error("Error saving profile:", error);
            return { success: false, message: 'Failed to update profile.' };
        }
    }
    return { success: false, message: 'User not authenticated.' };
};

// Validate mobile number
export const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
};

// Handle sending OTP
export const handleSendOtp = async (mobile) => {
    if (!validateMobile(mobile)) {
        return { success: false, message: 'Invalid mobile number. It should be 10 digits.' };
    }
    // Implement OTP sending logic here
    return { success: true };
};

// Handle verifying OTP
export const handleVerifyOtp = () => {
    // Implement OTP verification logic here
};

// Request necessary permissions for camera and media library
export const requestPermissions = async () => {
    console.log("Requesting camera permissions...");
    const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
    console.log("Camera permission status:", cameraStatus.status);

    console.log("Requesting media library permissions...");
    const mediaLibraryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log("Media library permission status:", mediaLibraryStatus.status);

    if (cameraStatus.status !== 'granted') {
        console.log("Camera permission not granted, requesting...");
        const { status: newCameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        console.log("New camera permission status:", newCameraStatus);
        if (newCameraStatus !== 'granted') {
            Alert.alert('Camera permission is required to take photos.');
            return { camera: false, mediaLibrary: mediaLibraryStatus.status === 'granted' };
        }
    }

    if (mediaLibraryStatus.status !== 'granted') {
        console.log("Media library permission not granted, requesting...");
        const { status: newMediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("New media library permission status:", newMediaLibraryStatus);
        if (newMediaLibraryStatus !== 'granted') {
            Alert.alert('Media Library permission is required to select photos.');
            return { camera: cameraStatus.status === 'granted', mediaLibrary: false };
        }
    }

    return {
        camera: true,
        mediaLibrary: true,
    };
};

// Handle taking a picture
export const handleTakePicture = async () => {
    console.log("Launching camera...");
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
    });

    console.log("Camera result:", result);
    if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log("Captured image URI:", imageUri);
        return imageUri;
    }
    console.log("Camera action was canceled or no image was captured.");
    return null;
};

// Handle selecting an image from the library
export const handleSelectFromLibrary = async () => {
    console.log("Launching image library...");
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        exif: false, // Disable EXIF metadata if you don't need it
    });

    console.log("Library result:", result);
    if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log("Selected image URI:", imageUri);
        return imageUri;
    }
    console.log("Library action was canceled or no image was selected.");
    return null;
};

// Upload the image to Firebase Storage without resizing
export const uploadImageToFirebase = async (uri, userId) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `profilePictures/${userId}.jpg`);
        await uploadBytes(imageRef, blob);
        const downloadUrl = await getDownloadURL(imageRef);
        return downloadUrl;
    } catch (error) {
        console.error("Error uploading image to Firebase:", error);
        Alert.alert("Error", "Failed to upload image.");
        return null;
    }
};

// Save the image URL to Firestore
export const saveImageUrlToFirestore = async (url, userId, firestore) => {
    try {
        await firestore.collection('users').doc(userId).update({
            profilePicture: url,
        });
        console.log("Profile picture URL saved to Firestore");
    } catch (error) {
        console.error("Error saving image URL to Firestore:", error);
        Alert.alert("Error", "Failed to save profile picture URL.");
    }
};
