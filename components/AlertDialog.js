import React, { useEffect } from 'react';
import { Platform, View, Text, Modal, Button, StyleSheet } from 'react-native';

const UniversalAlert = ({ visible, onClose, message, success }) => {
  useEffect(() => {
    if (Platform.OS === 'web' && visible) {
      alert(message); // Display browser alert
      onClose(); // Close the alert after displaying
    }
  }, [visible]);

  if (Platform.OS === 'web') {
    return null; // Don't render anything on the web platform
  }

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{message}</Text>
          <Button title="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default UniversalAlert;
