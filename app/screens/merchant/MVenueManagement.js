import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function MVenueManagement({ navigation }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchMerchantVenues();
    }
  }, [currentUser]);

  const fetchMerchantVenues = () => {
    if (!currentUser) return;

    try {
      const venueQuery = query(
        collection(db, 'venues'),
        where('merchantId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(venueQuery, (snapshot) => {
        const venueData = [];
        snapshot.forEach((doc) => {
          venueData.push({ id: doc.id, ...doc.data() });
        });
        setVenues(venueData);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching merchant venues:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMerchantVenues();
  };

  const toggleVenueStatus = async (venueId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'venues', venueId), {
        isActive: !currentStatus
      });
      Alert.alert('Success', `Venue ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating venue status:', error);
      Alert.alert('Error', 'Failed to update venue status');
    }
  };

  const deleteVenue = async (venueId, venueName) => {
    Alert.alert(
      'Delete Venue',
      `Are you sure you want to delete "${venueName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'venues', venueId));
              Alert.alert('Success', 'Venue deleted successfully');
            } catch (error) {
              console.error('Error deleting venue:', error);
              Alert.alert('Error', 'Failed to delete venue');
            }
          }
        }
      ]
    );
  };

  const renderVenueCard = (venue) => (
    <View key={venue.id} style={styles.venueCard}>
      <Image
        source={{ uri: venue.images?.[0] || 'https://via.placeholder.com/200x120' }}
        style={styles.venueImage}
        resizeMode="cover"
      />
      <View style={styles.venueContent}>
        <View style={styles.venueHeader}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <View style={[styles.statusBadge, venue.isActive ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={[styles.statusText, venue.isActive ? styles.activeText : styles.inactiveText]}>
              {venue.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        <Text style={styles.venueLocation}>
          <Ionicons name="location-outline" size={14} color="#666" />
          {' '}{venue.location}
        </Text>

        <Text style={styles.venueCategory}>{venue.category}</Text>

        <View style={styles.venueStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{venue.pricePerHour}</Text>
            <Text style={styles.statLabel}>per hour</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{venue.bookings || 0}</Text>
            <Text style={styles.statLabel}>bookings</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{venue.rating || '4.5'}</Text>
            <Text style={styles.statLabel}>rating</Text>
          </View>
        </View>

        <View style={styles.venueActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditVenue', { venue })}
          >
            <Ionicons name="pencil-outline" size={16} color="#4A90E2" />
            <Text style={[styles.actionButtonText, { color: '#4A90E2' }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleVenueStatus(venue.id, venue.isActive)}
          >
            <Ionicons 
              name={venue.isActive ? 'pause-outline' : 'play-outline'} 
              size={16} 
              color={venue.isActive ? '#f39c12' : '#27ae60'} 
            />
            <Text style={[styles.actionButtonText, { color: venue.isActive ? '#f39c12' : '#27ae60' }]}>
              {venue.isActive ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteVenue(venue.id, venue.name)}
          >
            <Ionicons name="trash-outline" size={16} color="#e74c3c" />
            <Text style={[styles.actionButtonText, { color: '#e74c3c' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="business-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Venues Yet</Text>
      <Text style={styles.emptyStateText}>
        Start by adding your first venue to begin receiving bookings
      </Text>
      <TouchableOpacity
        style={styles.addFirstVenueButton}
        onPress={() => navigation.navigate('screens/merchant/MAddPlace')}
      >
        <Text style={styles.addFirstVenueButtonText}>Add Your First Venue</Text>
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
        <Text style={styles.headerTitle}>My Venues</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('screens/merchant/MAddPlace')}
        >
          <Ionicons name="add" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>{venues.length}</Text>
            <Text style={styles.statCardLabel}>Total Venues</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>{venues.filter(v => v.isActive).length}</Text>
            <Text style={styles.statCardLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>{venues.reduce((sum, v) => sum + (v.bookings || 0), 0)}</Text>
            <Text style={styles.statCardLabel}>Total Bookings</Text>
          </View>
        </View>

        {/* Venues List */}
        {venues.length > 0 ? (
          <View style={styles.venuesList}>
            {venues.map(renderVenueCard)}
          </View>
        ) : (
          <EmptyState />
        )}
      </ScrollView>
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
  addButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  venuesList: {
    marginBottom: 20,
  },
  venueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  venueImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  venueContent: {
    padding: 15,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeBadge: {
    backgroundColor: '#d4edda',
  },
  inactiveBadge: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#155724',
  },
  inactiveText: {
    color: '#721c24',
  },
  venueLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  venueCategory: {
    fontSize: 12,
    color: '#4A90E2',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  venueStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  venueActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
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
    paddingHorizontal: 20,
  },
  addFirstVenueButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  addFirstVenueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
