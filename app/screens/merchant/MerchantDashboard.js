import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const MerchantDashboard = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Merchant Dashboard</Text>
        <TouchableOpacity onPress={() => navigateTo('screens/merchant/MProfileScreen')}>
          <Ionicons name="person-circle-outline" size={30} color="#1e90ff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Bookings This Week</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>$1,240</Text>
          <Text style={styles.statLabel}>Revenue This Week</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Manage Listings</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigateTo('screens/merchant/MAddPlace')}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add New Place</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigateTo('screens/merchant/MViewListings')}>
          <Ionicons name="list-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View My Listings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Bookings</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigateTo('screens/merchant/MViewBookings')}>
          <Ionicons name="calendar-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigateTo('screens/merchant/MManageAvailability')}>
          <Ionicons name="time-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Manage Availability</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Finances</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigateTo('screens/merchant/MViewEarnings')}>
          <Ionicons name="cash-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigateTo('screens/merchant/MPayoutSettings')}>
          <Ionicons name="card-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Payout Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.supportButton} onPress={() => navigateTo('screens/merchant/MSupport')}>
        <Ionicons name="help-circle-outline" size={24} color="#1e90ff" style={styles.buttonIcon} />
        <Text style={styles.supportButtonText}>Get Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1e90ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginBottom: 20,
  },
  supportButtonText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MerchantDashboard;