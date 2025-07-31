// components/ui/ErrorToast.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ErrorToast = ({ visible, message, onDismiss, type = 'error' }) => {
  if (!visible) return null;

  const backgroundColor = type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#ffc107';
  const iconName = type === 'error' ? 'close-circle' : type === 'success' ? 'checkmark-circle' : 'warning';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Ionicons name={iconName} size={20} color="white" style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
        <Ionicons name="close" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default ErrorToast;
