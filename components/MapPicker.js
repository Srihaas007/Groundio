import React from 'react';
import { View, Text, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapPicker = ({ onLocationSelect }) => {
  const [location, setLocation] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const handleLocationChange = (e) => {
    const newLocation = e.nativeEvent.coordinate;
    setLocation(newLocation);
    onLocationSelect(newLocation);
  };

  return (
    <View style={{ height: 300, width: '100%', marginBottom: 20 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          ...location,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleLocationChange}
      >
        <Marker coordinate={location} />
      </MapView>
      <Text>Selected Location: {location.latitude}, {location.longitude}</Text>
    </View>
  );
};

export default MapPicker;
