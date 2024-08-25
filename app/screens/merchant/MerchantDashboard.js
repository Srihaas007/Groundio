import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MerchantDashboard = () => {
  const navigation = useNavigation();

  const navigateToAddPlace = () => {
    navigation.navigate('screens/merchant/MAddPlace');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Merchant Dashboard</Text>
      
      {/* Example buttons for navigating to different parts of the dashboard */}
      <TouchableOpacity style={styles.button} onPress={navigateToAddPlace}>
        <Text style={styles.buttonText}>Add Place</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('screens/merchant/MViewOrders')}>
        <Text style={styles.buttonText}>View Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('screens/merchant/MProfileScreen')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MerchantDashboard;
