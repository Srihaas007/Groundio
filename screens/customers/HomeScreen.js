import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  RefreshControl,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { mockVenues } from '../../data/mockVenues';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { currentUser } = useAuth();

  const categories = ['All', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Swimming'];

  useEffect(() => {
    fetchVenues();
  }, [selectedCategory]);

  const fetchVenues = () => {
    try {
      // Use mock data temporarily to avoid Firebase index issues
      let venueData = [...mockVenues];
      
      if (selectedCategory !== 'All') {
        venueData = venueData.filter(venue => venue.category === selectedCategory);
      }
      
      // Sort by creation date (newest first)
      venueData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setVenues(venueData);
      setLoading(false);
      setRefreshing(false);
      
      // Also try to fetch from Firebase as backup
      let venueQuery;
      if (selectedCategory === 'All') {
        venueQuery = query(
          collection(db, 'venues'),
          where('isActive', '==', true)
        );
      } else {
        venueQuery = query(
          collection(db, 'venues'),
          where('isActive', '==', true),
          where('category', '==', selectedCategory)
        );
      }

      const unsubscribe = onSnapshot(venueQuery, (snapshot) => {
        const firebaseVenueData = [];
        snapshot.forEach((doc) => {
          firebaseVenueData.push({ id: doc.id, ...doc.data() });
        });
        
        // If we have Firebase data, use it instead of mock data
        if (firebaseVenueData.length > 0) {
          firebaseVenueData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          setVenues(firebaseVenueData);
        }
      }, (error) => {
        console.warn('Firebase query failed, using mock data:', error);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Fallback to mock data on error
      setVenues(mockVenues);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVenues();
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = searchText === '' || 
      venue.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      venue.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      venue.category?.toLowerCase().includes(searchText.toLowerCase()) ||
      (typeof venue.location === 'string' && venue.location?.toLowerCase().includes(searchText.toLowerCase())) ||
      (typeof venue.location === 'object' && (
        venue.location?.address?.toLowerCase().includes(searchText.toLowerCase()) ||
        venue.location?.city?.toLowerCase().includes(searchText.toLowerCase())
      ));
    
    return matchesSearch;
  });

  const renderVenueCard = ({ item }) => (
    <TouchableOpacity
      style={styles.venueCard}
      onPress={() => {
        if (navigation && navigation.navigate) {
          navigation.navigate('VenueDetails', { venue: item });
        }
      }}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x200' }}
        style={styles.venueImage}
        resizeMode="cover"
      />
      <View style={styles.venueOverlay}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.venueInfo}>
        <Text style={styles.venueName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.venueLocation} numberOfLines={1}>
            {typeof item.location === 'string' ? item.location : item.location?.address || item.location?.city || 'Location not available'}
          </Text>
        </View>
        <View style={styles.venueFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating || '4.5'}</Text>
          </View>
          <Text style={styles.price}>₹{item.pricePerHour || '500'}/hr</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.selectedCategoryText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Modern Welcome Header */}
      <View style={styles.welcomeHeader}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>Good morning</Text>
            <Text style={styles.userName}>{currentUser?.displayName || 'Athlete'}!</Text>
          </View>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={24} color="#6366F1" />
          </View>
        </View>
      </View>

      {/* Enhanced Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find your perfect sports venue..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modern Category Pills */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Sports Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryPill,
                selectedCategory === category && styles.categoryPillActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modern Venues List */}
      <ScrollView
        style={styles.venuesContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.venuesHeader}>
          <Text style={styles.venuesTitle}>
            {selectedCategory === 'All' ? 'Featured Venues' : `${selectedCategory} Courts`}
          </Text>
          <Text style={styles.venueCount}>
            {filteredVenues.length} available
          </Text>
        </View>

        {filteredVenues.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="basketball" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No venues found</Text>
            <Text style={styles.emptyStateText}>Try adjusting your search or category filter</Text>
          </View>
        ) : (
          <View style={styles.venuesList}>
            {filteredVenues.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.venueCard}
                onPress={() => {
                  if (navigation && navigation.navigate) {
                    navigation.navigate('VenueDetails', { venue: item });
                  }
                }}
                activeOpacity={0.9}
              >
                <View style={styles.venueImageContainer}>
                  <Image 
                    source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x200' }}
                    style={styles.venueImage}
                    resizeMode="cover"
                  />
                  <View style={styles.venueImageOverlay}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{item.category}</Text>
                    </View>
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Ionicons name="heart-outline" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.venueContent}>
                  <View style={styles.venueHeader}>
                    <Text style={styles.venueName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#FBBF24" />
                      <Text style={styles.ratingText}>{item.rating || '4.8'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="#6B7280" />
                    <Text style={styles.venueLocation} numberOfLines={1}>
                      {typeof item.location === 'string' ? item.location : item.location?.address || item.location?.city || 'Location not available'}
                    </Text>
                  </View>
                  
                  <View style={styles.venueFooter}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Starting from</Text>
                      <Text style={styles.price}>₹{item.pricePerHour || '500'}/hr</Text>
                    </View>
                    <TouchableOpacity style={styles.bookButton}>
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  welcomeHeader: {
    backgroundColor: '#6366F1',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: -20,
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 56,
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.15)',
    elevation: 10,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  categorySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 24,
  },
  categoryPill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryPillActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  venuesContainer: {
    flex: 1,
  },
  venuesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  venuesTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  venueCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  venuesList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(31, 41, 55, 0.1)',
    elevation: 8,
  },
  venueImageContainer: {
    position: 'relative',
  },
  venueImage: {
    width: '100%',
    height: 200,
  },
  venueImageOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  venueContent: {
    padding: 20,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  venueLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
    fontWeight: '500',
  },
  venueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366F1',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    boxShadow: '0 4px 8px rgba(99, 102, 241, 0.3)',
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
