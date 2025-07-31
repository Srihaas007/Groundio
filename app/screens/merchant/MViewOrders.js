import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  // Example function to fetch orders (replace with your actual data fetching logic)
  useEffect(() => {
    const fetchOrders = async () => {
      // This is just sample data. Replace this with a call to your backend.
      const fetchedOrders = [
        { id: '1', customerName: 'John Doe', status: 'Pending', total: '$100' },
        { id: '2', customerName: 'Jane Smith', status: 'Completed', total: '$150' },
        { id: '3', customerName: 'Mike Johnson', status: 'Shipped', total: '$200' },
      ];
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}>
      <Text style={styles.orderText}>Order ID: {item.id}</Text>
      <Text style={styles.orderText}>Customer: {item.customerName}</Text>
      <Text style={styles.orderText}>Status: {item.status}</Text>
      <Text style={styles.orderText}>Total: {item.total}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
      />
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.welcomeButton} onPress={() => navigation.navigate('screens/merchant/MWelcomeScreen')}>
        <Text style={styles.welcomeButtonText}>Go to Welcome Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  backButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  welcomeButton: {
    backgroundColor: '#32cd32',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MViewOrders;


