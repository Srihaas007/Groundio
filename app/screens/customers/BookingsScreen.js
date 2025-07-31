import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../context/AuthContext';

export default function BookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser, selectedTab]);

  const fetchBookings = () => {
    if (!currentUser) return;

    try {
      let bookingQuery;
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      if (selectedTab === 'upcoming') {
        bookingQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', currentUser.uid),
          where('status', 'in', ['confirmed', 'pending']),
          where('date', '>=', today),
          orderBy('date', 'asc')
        );
      } else {
        bookingQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
      }

      const unsubscribe = onSnapshot(bookingQuery, (snapshot) => {
        const bookingData = [];
        snapshot.forEach((doc) => {
          bookingData.push({ id: doc.id, ...doc.data() });
        });
        setBookings(bookingData);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const cancelBooking = async (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'bookings', bookingId), {
                status: 'cancelled'
              });
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Error', 'Failed to cancel booking');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      case 'completed': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return 'checkmark-circle';
      case 'pending': return 'time-outline';
      case 'cancelled': return 'close-circle';
      case 'completed': return 'checkmark-done-circle';
      default: return 'help-circle';
    }
  };

  const renderBookingCard = ({ item }) => {
    const bookingDate = new Date(item.date);
    const isPast = bookingDate < new Date();
    const canCancel = item.status === 'pending' || item.status === 'confirmed';

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Image
            source={{ uri: item.venueImage || 'https://via.placeholder.com/80x80' }}
            style={styles.venueImage}
            resizeMode="cover"
          />
          <View style={styles.bookingInfo}>
            <Text style={styles.venueName}>{item.venueName}</Text>
            <Text style={styles.venueLocation}>
              <Ionicons name="location-outline" size={14} color="#666" />
              {' '}{item.venueLocation}
            </Text>
            <View style={styles.statusContainer}>
              <Ionicons 
                name={getStatusIcon(item.status)} 
                size={16} 
                color={getStatusColor(item.status)} 
              />
              <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{bookingDate.toDateString()}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.timeSlot}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="card-outline" size={16} color="#666" />
              <Text style={styles.detailText}>₹{item.totalAmount}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.detailText}>ID: {item.id.slice(-6)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bookingActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('BookingDetails', { booking: item })}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
          
          {canCancel && !isPast && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => cancelBooking(item.id)}
            >
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Bookings Found</Text>
      <Text style={styles.emptyStateText}>
        {selectedTab === 'upcoming' 
          ? "You don't have any upcoming bookings" 
          : "You don't have any booking history"}
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('screens/customers/HomeScreen')}
      >
        <Text style={styles.browseButtonText}>Browse Venues</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        style={styles.bookingsList}
        contentContainerStyle={styles.bookingsListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  bookingsList: {
    flex: 1,
  },
  bookingsListContent: {
    padding: 20,
    flexGrow: 1,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  venueImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  bookingInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  venueLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e74c3c',
    marginRight: 0,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButtonText: {
    color: '#e74c3c',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
