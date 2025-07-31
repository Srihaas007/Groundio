import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/ui/Header';

const { width } = Dimensions.get('window');

export default function VenueDetailsScreen({ route, navigation }) {
  const { venue } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  useEffect(() => {
    loadAvailableSlots();
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    // In a real app, you would fetch booked slots from Firestore
    // For now, we'll simulate some booked slots
    const bookedSlots = ['10:00 AM', '02:00 PM', '06:00 PM'];
    const available = timeSlots.filter(slot => !bookedSlots.includes(slot));
    setAvailableSlots(available);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleBooking = async () => {
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'Please login to book a venue');
      return;
    }

    setLoading(true);
    try {
      // Create booking document
      const bookingData = {
        venueId: venue.id,
        venueName: venue.name,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || 'User',
        date: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedTimeSlot,
        pricePerHour: venue.pricePerHour,
        totalAmount: venue.pricePerHour, // Assuming 1 hour booking
        status: 'pending',
        createdAt: serverTimestamp(),
        venueLocation: venue.location,
        venueImage: venue.images?.[0] || null
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      Alert.alert(
        'Success',
        'Your booking request has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('screens/customers/BookingsScreen')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.venueImage} resizeMode="cover" />
  );

  const renderTimeSlot = ({ item }) => {
    const isSelected = selectedTimeSlot === item;
    const isAvailable = availableSlots.includes(item);

    return (
      <TouchableOpacity
        style={[
          styles.timeSlot,
          isSelected && styles.selectedTimeSlot,
          !isAvailable && styles.unavailableTimeSlot
        ]}
        onPress={() => isAvailable && setSelectedTimeSlot(item)}
        disabled={!isAvailable}
      >
        <Text style={[
          styles.timeSlotText,
          isSelected && styles.selectedTimeSlotText,
          !isAvailable && styles.unavailableTimeSlotText
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={venue.name}
        showBackButton 
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content}>

      {/* Images */}
      <View style={styles.imageContainer}>
        {venue.images && venue.images.length > 0 ? (
          <FlatList
            data={venue.images}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Image
            source={{ uri: 'https://via.placeholder.com/400x250' }}
            style={styles.venueImage}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Venue Info */}
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{venue.name}</Text>
        <Text style={styles.venueLocation}>
          <Ionicons name="location-outline" size={16} color="#666" />
          {' '}{venue.location}
        </Text>
        <View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{venue.rating || '4.5'}</Text>
            <Text style={styles.reviewCount}>({venue.reviewCount || '150'} reviews)</Text>
          </View>
          <Text style={styles.category}>{venue.category}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {venue.description || 'A premium sports venue with state-of-the-art facilities and equipment. Perfect for professional and recreational activities.'}
        </Text>
      </View>

      {/* Facilities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Facilities</Text>
        <View style={styles.facilitiesContainer}>
          {(venue.facilities || ['Parking', 'Restrooms', 'Equipment', 'Changing Room']).map((facility, index) => (
            <View key={index} style={styles.facilityItem}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
              <Text style={styles.facilityText}>{facility}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Booking Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Book This Venue</Text>
        
        {/* Date Selection */}
        <View style={styles.bookingRow}>
          <Text style={styles.bookingLabel}>Select Date:</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {selectedDate.toDateString()}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Time Slot Selection */}
        <View style={styles.bookingRow}>
          <Text style={styles.bookingLabel}>Available Time Slots:</Text>
        </View>
        <FlatList
          data={timeSlots}
          renderItem={renderTimeSlot}
          keyExtractor={(item) => item}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.timeSlotsContainer}
        />
      </View>

      {/* Price and Book Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price per hour</Text>
          <Text style={styles.price}>₹{venue.pricePerHour}</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleBooking}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? 'Booking...' : 'Book Now'}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#e9ecef',
  },
  venueImage: {
    width: width,
    height: 250,
  },
  venueInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  venueLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  category: {
    fontSize: 12,
    color: '#4A90E2',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  facilityText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  bookingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  timeSlotsContainer: {
    marginTop: 10,
  },
  timeSlot: {
    flex: 1,
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  unavailableTimeSlot: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  timeSlotText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  unavailableTimeSlotText: {
    color: '#999',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    marginTop: 10,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginLeft: 20,
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
