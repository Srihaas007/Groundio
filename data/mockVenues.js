// Mock venue data for development and testing
export const mockVenues = [
  {
    id: 'venue1',
    name: 'The Grand Ballroom',
    category: 'Wedding',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'
    ],
    description: 'Elegant ballroom perfect for weddings and special occasions. Features crystal chandeliers, marble floors, and accommodates up to 300 guests.',
    capacity: 300,
    pricePerHour: 150,
    rating: 4.8,
    reviewCount: 127,
    amenities: ['Parking', 'WiFi', 'Sound System', 'Kitchen', 'Air Conditioning'],
    location: {
      address: '123 Elegant Street, Downtown',
      city: 'Mumbai',
      coordinates: { latitude: 19.0760, longitude: 72.8777 }
    },
    availability: {
      monday: { open: true, slots: ['10:00-14:00', '18:00-23:00'] },
      tuesday: { open: true, slots: ['10:00-14:00', '18:00-23:00'] },
      wednesday: { open: true, slots: ['10:00-14:00', '18:00-23:00'] },
      thursday: { open: true, slots: ['10:00-14:00', '18:00-23:00'] },
      friday: { open: true, slots: ['10:00-14:00', '16:00-23:00'] },
      saturday: { open: true, slots: ['09:00-23:00'] },
      sunday: { open: true, slots: ['09:00-23:00'] }
    },
    contactInfo: {
      phone: '+91 98765 43210',
      email: 'bookings@grandballroom.com',
      website: 'www.grandballroom.com'
    },
    isActive: true,
    createdAt: { seconds: Date.now() / 1000 },
    merchantId: 'merchant1'
  },
  {
    id: 'venue2',
    name: 'Corporate Hub Conference Center',
    category: 'Corporate',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
    ],
    description: 'Modern conference center with state-of-the-art technology. Perfect for corporate meetings, seminars, and business events.',
    capacity: 150,
    pricePerHour: 100,
    rating: 4.6,
    reviewCount: 89,
    amenities: ['Projector', 'WiFi', 'Whiteboard', 'Coffee Service', 'Parking'],
    location: {
      address: '456 Business Plaza, IT Park',
      city: 'Bangalore',
      coordinates: { latitude: 12.9716, longitude: 77.5946 }
    },
    availability: {
      monday: { open: true, slots: ['08:00-18:00'] },
      tuesday: { open: true, slots: ['08:00-18:00'] },
      wednesday: { open: true, slots: ['08:00-18:00'] },
      thursday: { open: true, slots: ['08:00-18:00'] },
      friday: { open: true, slots: ['08:00-18:00'] },
      saturday: { open: false, slots: [] },
      sunday: { open: false, slots: [] }
    },
    contactInfo: {
      phone: '+91 87654 32109',
      email: 'events@corporatehub.com',
      website: 'www.corporatehub.com'
    },
    isActive: true,
    createdAt: { seconds: Date.now() / 1000 - 86400 },
    merchantId: 'merchant2'
  },
  {
    id: 'venue3',
    name: 'Rooftop Sky Lounge',
    category: 'Party',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800'
    ],
    description: 'Stunning rooftop venue with panoramic city views. Perfect for parties, celebrations, and social gatherings under the stars.',
    capacity: 80,
    pricePerHour: 120,
    rating: 4.9,
    reviewCount: 203,
    amenities: ['Bar', 'DJ Setup', 'Outdoor Seating', 'City View', 'Valet Parking'],
    location: {
      address: '789 Skyline Tower, Bandra',
      city: 'Mumbai',
      coordinates: { latitude: 19.0596, longitude: 72.8205 }
    },
    availability: {
      monday: { open: false, slots: [] },
      tuesday: { open: false, slots: [] },
      wednesday: { open: true, slots: ['19:00-02:00'] },
      thursday: { open: true, slots: ['19:00-02:00'] },
      friday: { open: true, slots: ['18:00-03:00'] },
      saturday: { open: true, slots: ['16:00-03:00'] },
      sunday: { open: true, slots: ['16:00-01:00'] }
    },
    contactInfo: {
      phone: '+91 76543 21098',
      email: 'party@skyloungemumbai.com',
      website: 'www.skyloungemumbai.com'
    },
    isActive: true,
    createdAt: { seconds: Date.now() / 1000 - 172800 },
    merchantId: 'merchant3'
  },
  {
    id: 'venue4',
    name: 'Garden Paradise Resort',
    category: 'Wedding',
    images: [
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
    ],
    description: 'Beautiful garden resort with lush landscapes and natural beauty. Ideal for outdoor weddings and romantic celebrations.',
    capacity: 500,
    pricePerHour: 200,
    rating: 4.7,
    reviewCount: 156,
    amenities: ['Garden', 'Catering', 'Photography', 'Decoration', 'Guest Rooms'],
    location: {
      address: '321 Garden Lane, Lonavala',
      city: 'Pune',
      coordinates: { latitude: 18.5204, longitude: 73.8567 }
    },
    availability: {
      monday: { open: true, slots: ['10:00-22:00'] },
      tuesday: { open: true, slots: ['10:00-22:00'] },
      wednesday: { open: true, slots: ['10:00-22:00'] },
      thursday: { open: true, slots: ['10:00-22:00'] },
      friday: { open: true, slots: ['10:00-23:00'] },
      saturday: { open: true, slots: ['08:00-23:00'] },
      sunday: { open: true, slots: ['08:00-23:00'] }
    },
    contactInfo: {
      phone: '+91 65432 10987',
      email: 'events@gardenparadise.com',
      website: 'www.gardenparadise.com'
    },
    isActive: true,
    createdAt: { seconds: Date.now() / 1000 - 259200 },
    merchantId: 'merchant4'
  },
  {
    id: 'venue5',
    name: 'Sports Arena Complex',
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'
    ],
    description: 'Modern sports complex with multiple courts and facilities. Perfect for tournaments, sports events, and fitness activities.',
    capacity: 200,
    pricePerHour: 80,
    rating: 4.5,
    reviewCount: 78,
    amenities: ['Multiple Courts', 'Changing Rooms', 'Equipment', 'Scoreboard', 'Seating'],
    location: {
      address: '654 Sports Street, Andheri',
      city: 'Mumbai',
      coordinates: { latitude: 19.1136, longitude: 72.8697 }
    },
    availability: {
      monday: { open: true, slots: ['06:00-22:00'] },
      tuesday: { open: true, slots: ['06:00-22:00'] },
      wednesday: { open: true, slots: ['06:00-22:00'] },
      thursday: { open: true, slots: ['06:00-22:00'] },
      friday: { open: true, slots: ['06:00-22:00'] },
      saturday: { open: true, slots: ['06:00-23:00'] },
      sunday: { open: true, slots: ['06:00-23:00'] }
    },
    contactInfo: {
      phone: '+91 54321 09876',
      email: 'bookings@sportsarena.com',
      website: 'www.sportsarena.com'
    },
    isActive: true,
    createdAt: { seconds: Date.now() / 1000 - 345600 },
    merchantId: 'merchant5'
  }
];

// Function to add mock venues to Firestore (for development)
export const addMockVenuesToFirestore = async (db) => {
  const { collection, addDoc } = await import('firebase/firestore');
  
  try {
    for (const venue of mockVenues) {
      const { id, ...venueData } = venue;
      await addDoc(collection(db, 'venues'), venueData);
    }
    console.log('Mock venues added successfully!');
  } catch (error) {
    console.error('Error adding mock venues:', error);
  }
};
