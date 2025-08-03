import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

// Home Screen Component
function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🏟️ Groundio</Text>
        <Text style={styles.tagline}>Find Your Perfect Venue</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Book stadiums, sports complexes, and venues across the city with ease</Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.buttonText}>Start Searching</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Why Choose Groundio?</Text>
        
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureTitle}>Instant Booking</Text>
            <Text style={styles.featureDescription}>Book your perfect venue in seconds</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureTitle}>Secure & Safe</Text>
            <Text style={styles.featureDescription}>Your payments and data are protected</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🌟</Text>
            <Text style={styles.featureTitle}>Premium Venues</Text>
            <Text style={styles.featureDescription}>Access to the best venues in your city</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureTitle}>Mobile First</Text>
            <Text style={styles.featureDescription}>Seamlessly book on any device</Text>
          </View>
        </View>
      </View>

      {/* Featured Venues */}
      <View style={styles.venuesContainer}>
        <Text style={styles.sectionTitle}>Featured Venues</Text>
        
        <View style={styles.venueCard}>
          <Text style={styles.venueIcon}>🏟️</Text>
          <View style={styles.venueInfo}>
            <Text style={styles.venueName}>City Sports Complex</Text>
            <Text style={styles.venueLocation}>📍 Downtown</Text>
            <Text style={styles.venuePrice}>₹2,000/hour</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.venueCard}>
          <Text style={styles.venueIcon}>🏀</Text>
          <View style={styles.venueInfo}>
            <Text style={styles.venueName}>Downtown Basketball Court</Text>
            <Text style={styles.venueLocation}>📍 Uptown</Text>
            <Text style={styles.venuePrice}>₹600/hour</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Search Screen Component
function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text style={styles.pageTitle}>🔍 Search Venues</Text>
        <Text style={styles.pageSubtitle}>Find the perfect venue for your next game or event</Text>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchPlaceholder}>Search functionality coming soon...</Text>
        </View>

        <View style={styles.categoryGrid}>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>⚽</Text>
            <Text style={styles.categoryName}>Football</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>🏀</Text>
            <Text style={styles.categoryName}>Basketball</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>🏸</Text>
            <Text style={styles.categoryName}>Badminton</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>🎾</Text>
            <Text style={styles.categoryName}>Tennis</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Main Mobile App Component
export default function MobileApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '🏟️ Groundio' }}
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ title: 'Search Venues' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#667eea',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  hero: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#374151',
    marginBottom: 25,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f2937',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1f2937',
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 18,
  },
  venuesContainer: {
    padding: 20,
  },
  venueCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  venueIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  venueLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  venuePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  bookButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  pageSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 30,
    lineHeight: 22,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchPlaceholder: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
