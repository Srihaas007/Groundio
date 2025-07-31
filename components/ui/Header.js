// components/ui/Header.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ 
  title, 
  showLogo = true, 
  showBackButton = false, 
  onBackPress,
  rightComponent,
  backgroundColor = '#2E7D32'
}) => {
  return (
    <SafeAreaView style={{ backgroundColor }}>
      <View style={[styles.container, { backgroundColor }]}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        <View style={styles.centerContent}>
          {showLogo && (
            <View style={styles.logoContainer}>
              <Ionicons name="football" size={24} color="white" style={styles.logoIcon} />
              <Text style={styles.appName}>Groundio</Text>
            </View>
          )}
          {title && <Text style={styles.title}>{title}</Text>}
        </View>
        
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  placeholder: {
    width: 32,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: 8,
  },
  appName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  rightContainer: {
    width: 32,
    alignItems: 'flex-end',
  },
});

export default Header;
