import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../../services/firebase';

const { width } = Dimensions.get('window');

export default function SearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const categories = ['All', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Swimming'];
  const priceRanges = ['All', '₹0-500', '₹500-1000', '₹1000-2000', '₹2000+'];

  useEffect(() => {
    fetchVenues();
    loadRecentSearches();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [searchText, selectedCategory, priceRange, venues]);

  const fetchVenues = () => {
    try {
      const venueQuery = query(
        collection(db, 'venues'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(venueQuery, (snapshot) => {
        const venueData = [];
        snapshot.forEach((doc) => {
          venueData.push({ id: doc.id, ...doc.data() });
        });
        setVenues(venueData);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching venues:', error);
      setLoading(false);
    }
  };

  const loadRecentSearches = () => {
    // In a real app, you would load from AsyncStorage
    setRecentSearches(['Football ground', 'Cricket pitch', 'Basketball court']);
  };

  const filterVenues = () => {
    let filtered = venues;

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter(venue =>
        venue.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        venue.location?.toLowerCase().includes(searchText.toLowerCase()) ||
        venue.category?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(venue => venue.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange !== 'All') {
      const [min, max] = getPriceRange(priceRange);
      filtered = filtered.filter(venue => {
        const price = venue.pricePerHour || 0;
        return price >= min && (max === Infinity || price <= max);
      });
    }

    setFilteredVenues(filtered);
  };

  const getPriceRange = (range) => {
    switch (range) {
      case '₹0-500': return [0, 500];
      case '₹500-1000': return [500, 1000];
      case '₹1000-2000': return [1000, 2000];
      case '₹2000+': return [2000, Infinity];
      default: return [0, Infinity];
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() && !recentSearches.includes(text.trim())) {
      setRecentSearches(prev => [text.trim(), ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setSelectedCategory('All');
    setPriceRange('All');
  };

  const renderVenueCard = ({ item }) => (
    <TouchableOpacity
      style={styles.venueCard}
      onPress={() => navigation.navigate('VenueDetailsScreen', { venue: item })}
    >
      <Image 
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150x100' }}
        style={styles.venueImage}
        resizeMode="cover"
      />
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{item.name}</Text>
        <Text style={styles.venueLocation}>
          <Ionicons name="location-outline" size={12} color="#666" />
          {' '}{item.location}
        </Text>
        <Text style={styles.venueCategory}>{item.category}</Text>
        <View style={styles.priceRating}>
          <Text style={styles.venuePrice}>₹{item.pricePerHour}/hr</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.rating}>{item.rating || '4.5'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedCategory === item && styles.activeFilterChip
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.filterChipText,
        selectedCategory === item && styles.activeFilterChipText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderPriceFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        priceRange === item && styles.activeFilterChip
      ]}
      onPress={() => setPriceRange(item)}
    >
      <Text style={[
        styles.filterChipText,
        priceRange === item && styles.activeFilterChipText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => setSearchText(item)}
    >
      <Ionicons name="time-outline" size={16} color="#666" />
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Venues</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search venues, locations, sports..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recent Searches */}
        {searchText.length === 0 && recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <FlatList
              data={recentSearches}
              renderItem={renderRecentSearch}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryFilter}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <FlatList
            data={priceRanges}
            renderItem={renderPriceFilter}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          />
        </View>

        {/* Results */}
        <View style={styles.section}>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>
              {searchText ? `Results for "${searchText}"` : 'All Venues'}
            </Text>
            <Text style={styles.resultCount}>
              {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          {filteredVenues.length > 0 ? (
            <FlatList
              data={filteredVenues}
              renderItem={renderVenueCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No venues found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search criteria or browse all venues
              </Text>
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearSearch}>
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeFilterChip: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
  },
  venueCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
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
    width: 100,
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  venueInfo: {
    flex: 1,
    padding: 12,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  venueLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  venueCategory: {
    fontSize: 10,
    color: '#4A90E2',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  priceRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venuePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  clearFiltersButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
