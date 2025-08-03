import { createContext, useContext, useState, useEffect } from 'react'
import { collection, addDoc, getDocs, query, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

const VenueContext = createContext()

export const useVenues = () => {
  const context = useContext(VenueContext)
  if (!context) {
    throw new Error('useVenues must be used within a VenueProvider')
  }
  return context
}

export const VenueProvider = ({ children }) => {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load venues from Firebase on component mount
  useEffect(() => {
    loadVenues()
  }, [])

  const getDefaultVenues = () => [
    {
      id: 'default-1',
      name: "City Sports Complex",
      description: "Full-size football field with modern facilities",
      pricePerHour: 2000,
      emoji: "🏟️",
      location: { city: "Downtown", address: "123 Sports Ave" },
      rating: 4.8,
      type: "Football",
      merchantId: "default-merchant-1",
      merchantName: "City Sports Ltd",
      featured: true,
      amenities: ["Parking", "Changing Rooms", "First Aid"],
      availability: "24/7",
      images: [],
      createdAt: new Date()
    },
    {
      id: 'default-2',
      name: "Downtown Basketball Court", 
      description: "Indoor basketball court with air conditioning",
      pricePerHour: 800,
      emoji: "🏀",
      location: { city: "City Center", address: "456 Court St" },
      rating: 4.5,
      type: "Basketball",
      merchantId: "default-merchant-2",
      merchantName: "Downtown Sports",
      featured: true,
      amenities: ["AC", "Sound System", "Parking"],
      availability: "6 AM - 11 PM",
      images: [],
      createdAt: new Date()
    },
    {
      id: 'default-3',
      name: "Olympic Swimming Pool",
      description: "50m pool with diving boards and changing rooms", 
      pricePerHour: 1500,
      emoji: "🏊",
      location: { city: "Sports District", address: "789 Pool Lane" },
      rating: 4.9,
      type: "Swimming",
      merchantId: "default-merchant-3",
      merchantName: "Aquatic Center",
      featured: true,
      amenities: ["Diving Boards", "Lockers", "Towel Service"],
      availability: "5 AM - 10 PM",
      images: [],
      createdAt: new Date()
    }
  ]

  const loadVenues = async () => {
    try {
      setLoading(true)
      const venuesRef = collection(db, 'venues')
      const q = query(venuesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const venuesData = []
      querySnapshot.forEach((doc) => {
        venuesData.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      // If no venues in Firebase, use default venues
      if (venuesData.length === 0) {
        setVenues(getDefaultVenues())
      } else {
        setVenues(venuesData)
      }
      setError(null)
    } catch (err) {
      console.error('Error loading venues:', err)
      setError('Failed to load venues from Firebase, showing default venues')
      // Fallback to mock data if Firebase fails
      setVenues(getDefaultVenues())
    } finally {
      setLoading(false)
    }
  }

  const addVenue = async (venueData) => {
    try {
      const venuesRef = collection(db, 'venues')
      const newVenue = {
        ...venueData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const docRef = await addDoc(venuesRef, newVenue)
      const addedVenue = {
        id: docRef.id,
        ...newVenue
      }
      
      setVenues(prev => [addedVenue, ...prev])
      return addedVenue
    } catch (err) {
      console.error('Error adding venue:', err)
      // If Firebase fails, add to local state
      const localVenue = {
        id: `local-${Date.now()}`,
        ...venueData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setVenues(prev => [localVenue, ...prev])
      return localVenue
    }
  }

  const updateVenue = async (venueId, updates) => {
    try {
      const venueRef = doc(db, 'venues', venueId)
      const updatedData = {
        ...updates,
        updatedAt: new Date()
      }
      
      await updateDoc(venueRef, updatedData)
      
      setVenues(prev => prev.map(venue => 
        venue.id === venueId 
          ? { ...venue, ...updatedData }
          : venue
      ))
    } catch (err) {
      console.error('Error updating venue:', err)
      // Update locally even if Firebase fails
      setVenues(prev => prev.map(venue => 
        venue.id === venueId 
          ? { ...venue, ...updates, updatedAt: new Date() }
          : venue
      ))
    }
  }

  const deleteVenue = async (venueId) => {
    try {
      await deleteDoc(doc(db, 'venues', venueId))
      setVenues(prev => prev.filter(venue => venue.id !== venueId))
    } catch (err) {
      console.error('Error deleting venue:', err)
      // Delete locally even if Firebase fails
      setVenues(prev => prev.filter(venue => venue.id !== venueId))
    }
  }

  const searchVenues = (searchTerm, filters = {}) => {
    let filtered = venues

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(searchLower) ||
        venue.type.toLowerCase().includes(searchLower)
      )
    }

    if (filters.type) {
      filtered = filtered.filter(venue => venue.type === filters.type)
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(venue => venue.pricePerHour >= filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(venue => venue.pricePerHour <= filters.maxPrice)
    }

    return filtered
  }

  const getFeaturedVenues = () => {
    return venues.filter(venue => venue.featured).slice(0, 6)
  }

  const getVenuesByMerchant = (merchantId) => {
    return venues.filter(venue => venue.merchantId === merchantId)
  }

  const getVenueTypes = () => {
    const types = [...new Set(venues.map(venue => venue.type))]
    return types.sort()
  }

  const value = {
    venues,
    loading,
    error,
    addVenue,
    updateVenue,
    deleteVenue,
    searchVenues,
    getFeaturedVenues,
    getVenuesByMerchant,
    getVenueTypes,
    refreshVenues: loadVenues
  }

  return (
    <VenueContext.Provider value={value}>
      {children}
    </VenueContext.Provider>
  )
}

export default VenueContext
