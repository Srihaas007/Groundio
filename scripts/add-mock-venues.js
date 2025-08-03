// Script to add mock venues to Firebase for testing
// Run this script using: node add-mock-venues.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyA3Zp_hJUaZ5H6zPzNXnmQT0T4k2qH3X5Y",
  authDomain: "groundio-79307.firebaseapp.com",
  projectId: "groundio-79307",
  storageBucket: "groundio-79307.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456789012"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mockVenues = [
  {
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
    createdAt: new Date(),
    merchantId: 'merchant1'
  },
  {
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
    createdAt: new Date(Date.now() - 86400000),
    merchantId: 'merchant2'
  },
  {
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
    createdAt: new Date(Date.now() - 172800000),
    merchantId: 'merchant3'
  }
];

async function addMockVenues() {
  try {
    console.log('Adding mock venues to Firebase...');
    
    for (const venue of mockVenues) {
      const docRef = await addDoc(collection(db, 'venues'), venue);
      console.log(`Added venue: ${venue.name} with ID: ${docRef.id}`);
    }
    
    console.log('All mock venues added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding mock venues:', error);
    process.exit(1);
  }
}

addMockVenues();
