import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UniversalAlert = ({ visible, onClose, message, success }) => {
  useEffect(() => {
    if (visible && success) {
      // Auto-close success alerts after 2 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, success, onClose]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={success ? "checkmark-circle" : "close-circle"} 
              size={48} 
              color={success ? "#28a745" : "#dc3545"} 
            />
          </View>
          
          <Text style={styles.messageText}>
            {message || (success ? "Success!" : "Something went wrong!")}
          </Text>
          
          <TouchableOpacity style={[
            styles.closeButton, 
            { backgroundColor: success ? "#28a745" : "#dc3545" }
          ]} onPress={onClose}>
            <Text style={styles.closeButtonText}>
              {success ? "Great!" : "Got it"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: '80%',
    maxWidth: 320,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 24,
    fontWeight: '500',
    lineHeight: 22,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UniversalAlert;
