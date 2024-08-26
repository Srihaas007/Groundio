import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const usePermissions = () => {
    const [cameraPermission, setCameraPermission] = useState(null);
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);

    useEffect(() => {
        const requestPermissions = async () => {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (cameraStatus !== 'granted') {
                Alert.alert(
                    "Permission Request",
                    "This app needs camera access to take pictures.",
                    [
                        {
                            text: "Cancel",
                            onPress: () => setCameraPermission(false),
                            style: "cancel"
                        },
                        {
                            text: "OK",
                            onPress: async () => {
                                const { status: newCameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
                                setCameraPermission(newCameraStatus === 'granted');
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                setCameraPermission(true);
            }

            if (libraryStatus !== 'granted') {
                Alert.alert(
                    "Permission Request",
                    "This app needs access to your photo library to upload images.",
                    [
                        {
                            text: "Cancel",
                            onPress: () => setMediaLibraryPermission(false),
                            style: "cancel"
                        },
                        {
                            text: "OK",
                            onPress: async () => {
                                const { status: newLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                                setMediaLibraryPermission(newLibraryStatus === 'granted');
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                setMediaLibraryPermission(true);
            }
        };

        requestPermissions();
    }, []);

    return { cameraPermission, mediaLibraryPermission };
};

export default usePermissions;
