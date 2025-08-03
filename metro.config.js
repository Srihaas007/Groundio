const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable support for React Native Web
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Ensure React Native Web modules are properly resolved
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

module.exports = config;
