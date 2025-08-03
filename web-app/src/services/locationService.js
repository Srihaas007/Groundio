// Location Service for getting user's current location
class LocationService {
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get city name from coordinates using reverse geocoding
            const cityName = await LocationService.getCityFromCoordinates(latitude, longitude);
            
            resolve({
              latitude,
              longitude,
              city: cityName,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            });
          } catch (error) {
            // Fallback: still return coordinates even if city lookup fails
            resolve({
              latitude,
              longitude,
              city: null,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            });
          }
        },
        (error) => {
          let errorMessage = 'Unknown location error';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static async getCityFromCoordinates(latitude, longitude) {
    try {
      // Using OpenStreetMap Nominatim API (free alternative to Google Maps)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Groundio-App/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding API request failed');
      }
      
      const data = await response.json();
      
      // Extract city name from the response
      const address = data.address || {};
      return address.city || address.town || address.village || address.suburb || 'Unknown City';
      
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      
      // Fallback: Try alternative geocoding service
      try {
        return await LocationService.getFallbackCity(latitude, longitude);
      } catch (fallbackError) {
        console.error('Fallback geocoding also failed:', fallbackError);
        return null;
      }
    }
  }

  static async getFallbackCity(latitude, longitude) {
    // Using ip-api.com as fallback (less accurate but works)
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.city;
    }
    
    throw new Error('Fallback geocoding failed');
  }

  static async requestLocationPermission() {
    try {
      // First check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported');
      }

      // Check current permission state
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
          throw new Error('Location permission denied. Please enable in browser settings.');
        }
      }

      // Try to get location (this will trigger permission request if needed)
      const location = await LocationService.getCurrentLocation();
      return location;
      
    } catch (error) {
      throw error;
    }
  }

  // Verify if merchant is at the venue location (within reasonable distance)
  static verifyMerchantLocation(userLocation, venueLocation, maxDistanceKm = 0.5) {
    const distance = LocationService.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      venueLocation.latitude,
      venueLocation.longitude
    );
    
    return {
      isAtVenue: distance <= maxDistanceKm,
      distance: distance,
      maxAllowed: maxDistanceKm
    };
  }

  // Calculate distance between two coordinates using Haversine formula
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = LocationService.toRadians(lat2 - lat1);
    const dLon = LocationService.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(LocationService.toRadians(lat1)) * Math.cos(LocationService.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Store location data securely
  static storeLocationData(locationData) {
    try {
      const encrypted = btoa(JSON.stringify({
        ...locationData,
        stored: Date.now()
      }));
      
      localStorage.setItem('user_location', encrypted);
      
      // Auto-expire after 1 hour
      setTimeout(() => {
        localStorage.removeItem('user_location');
      }, 3600000);
      
    } catch (error) {
      console.error('Failed to store location data:', error);
    }
  }

  static getStoredLocation() {
    try {
      const stored = localStorage.getItem('user_location');
      if (!stored) return null;
      
      const data = JSON.parse(atob(stored));
      
      // Check if data is less than 1 hour old
      if (Date.now() - data.stored > 3600000) {
        localStorage.removeItem('user_location');
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to retrieve stored location:', error);
      return null;
    }
  }
}

export default LocationService;
