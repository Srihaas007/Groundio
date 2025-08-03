import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  StatusBar,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MerchantDashboard = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    activeListings: 5,
    bookingsThisWeek: 12,
    revenueThisWeek: 1240,
    totalViews: 2847,
    rating: 4.7,
    totalBookings: 156
  });

  const navigateTo = (screen) => {
    try {
      navigation.navigate(screen);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const StatCard = ({ icon, value, label, color, trend }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons name={trend > 0 ? 'trending-up' : 'trending-down'} size={16} color={trend > 0 ? '#10B981' : '#EF4444'} />
            <Text style={[styles.trendText, { color: trend > 0 ? '#10B981' : '#EF4444' }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const ActionButton = ({ icon, title, description, onPress, color }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.merchantName}>Your Business</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigateTo('MProfileScreen')}
          >
            <Ionicons name="person-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              icon="storefront" 
              value={stats.activeListings} 
              label="Active Listings" 
              color="#6366F1"
              trend={12}
            />
            <StatCard 
              icon="calendar" 
              value={stats.bookingsThisWeek} 
              label="This Week" 
              color="#10B981"
              trend={-5}
            />
            <StatCard 
              icon="cash" 
              value={`₹${stats.revenueThisWeek.toLocaleString()}`} 
              label="Revenue" 
              color="#F59E0B"
              trend={18}
            />
            <StatCard 
              icon="eye" 
              value={stats.totalViews.toLocaleString()} 
              label="Total Views" 
              color="#8B5CF6"
              trend={25}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <ActionButton
              icon="add-circle"
              title="Add New Venue"
              description="List a new property or space"
              onPress={() => navigateTo('MAddPlace')}
              color="#10B981"
            />
            <ActionButton
              icon="list"
              title="Manage Listings"
              description="View and edit your venues"
              onPress={() => navigateTo('MViewListings')}
              color="#6366F1"
            />
            <ActionButton
              icon="calendar-outline"
              title="View Bookings"
              description="Manage reservations and schedules"
              onPress={() => navigateTo('MBookings')}
              color="#F59E0B"
            />
            <ActionButton
              icon="analytics"
              title="Analytics"
              description="View detailed performance metrics"
              onPress={() => navigateTo('MAnalytics')}
              color="#8B5CF6"
            />
            <ActionButton
              icon="chatbubbles"
              title="Messages"
              description="Communicate with customers"
              onPress={() => navigateTo('MMessages')}
              color="#EF4444"
            />
            <ActionButton
              icon="settings"
              title="Settings"
              description="Account and business settings"
              onPress={() => navigateTo('MSettings')}
              color="#6B7280"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New booking confirmed</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="star" size={20} color="#F59E0B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New 5-star review received</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="eye" size={20} color="#6366F1" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Your venue got 15 new views</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#6366F1',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  merchantName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 8,
    width: (width - 56) / 2,
    borderLeftWidth: 4,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default MerchantDashboard;