import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  const showTestNotification = () => {
    // This simulates showing a notification
    Alert.alert('New Notification', 'This is a test notification!', [{ text: 'OK' }]);
    
    // Add a test notification to the list
    setNotifications([
      ...notifications,
      { id: notifications.length + 1, message: 'This is a test notification!' }
    ]);
  };

  const handleNavigateToProfile = () => {
    navigation.navigate('ProfileScreen'); // Adjust based on your navigation setup
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Button title="Show Test Notification" onPress={showTestNotification} color="#1e90ff" />
      <View style={styles.notificationList}>
        {notifications.map(notification => (
          <View key={notification.id} style={styles.notificationItem}>
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
        ))}
      </View>
      <Button title="Go to Profile" onPress={handleNavigateToProfile} color="#1e90ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  notificationList: {
    marginTop: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  notificationText: {
    fontSize: 16,
  },
});
