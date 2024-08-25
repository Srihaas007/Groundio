// hooks/useCameraPermissions.js
import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const useCameraPermissions = () => {
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        const requestCameraPermission = async () => {
            let permissionResult;

            if (Platform.OS === 'android') {
                // Show an alert or some form of UI to inform the user
                Alert.alert("Permission Request", "This app needs camera access to take pictures",
                    [
                        {
                            text: "Cancel",
                            onPress: () => setHasPermission(false),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => requestPermission(PERMISSIONS.ANDROID.CAMERA) }
                    ],
                    { cancelable: false }
                );
            } else if (Platform.OS === 'ios') {
                permissionResult = await request(PERMISSIONS.IOS.CAMERA);
                setHasPermission(permissionResult === RESULTS.GRANTED);
            }
        };

        const requestPermission = async (permissionType) => {
            try {
                let permissionResult = await request(permissionType);
                setHasPermission(permissionResult === RESULTS.GRANTED);
            } catch (error) {
                console.warn("Permission request error:", error);
                setHasPermission(false);
            }
        };

        requestCameraPermission();
    }, []);

    return hasPermission;
};

export default useCameraPermissions;
