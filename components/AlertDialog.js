import React, { useEffect, useRef, useState } from 'react';
import { Platform, View, Text, Modal, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

const UniversalAlert = ({ visible, onClose, message, success }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const [autoClose, setAutoClose] = useState(false);

  useEffect(() => {
    if (visible) {
      bounceAnim.setValue(0);  // Reset animation value
      Animated.sequence([
        Animated.spring(bounceAnim, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      if (success) {
        setAutoClose(true);
        setTimeout(() => {
          onClose();
          setAutoClose(false);
        }, 2400);
      }
    }
  }, [visible, success]);

  const renderAlertContent = () => (
    <Animated.View style={[styles.alertContainer, { transform: [{ scale: bounceAnim }] }]}>
      <View style={styles.lottieContainer}>
        <LottieView
          source={success ? require('../assets/animations/success.json') : require('../assets/animations/error.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      </View>
      <Text style={styles.messageText}>
        {message || (success ? "Success!" : "Something went wrong!")}
      </Text>
      { !autoClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>{success ? "Okay" : "Can Do!"}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  if (Platform.OS === 'web') {
    return visible ? (
      <div style={styles.webOverlay}>
        {renderAlertContent()}
      </div>
    ) : null;
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
    >
      <View style={styles.overlay}>
        {renderAlertContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  alertContainer: {
    width: '80%',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  lottieContainer: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});

export default UniversalAlert;
