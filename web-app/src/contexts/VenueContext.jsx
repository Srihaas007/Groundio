import { createContext, useContext, useState, useEffect } from 'react'
// Temporarily disable Firebase imports for testing
// import { collection, addDoc, getDocs, query, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore'
// import { db } from '../firebase/config'

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
  const [searchIndex, setSearchIndex] = useState([])

  // Load venues from Firebase on component mount
  useEffect(() => {
    loadVenues()
  }, [])

  // Update search index whenever venues change
  useEffect(() => {
    const index = venues.map(venue => ({
      id: venue.id,
      name: venue.name,
      location: venue.location,
      type: venue.type,
      keywords: [
        venue.name.toLowerCase(),
        typeof venue.location === 'string' ? venue.location.toLowerCase() : 
          `${venue.location?.city || ''} ${venue.location?.address || ''}`.toLowerCase(),
        venue.type.toLowerCase(),
        ...(venue.amenities || []).map(a => a.toLowerCase())
      ].join(' ')
    }))
    setSearchIndex(index)
  }, [venues])

  const loadVenues = async () => {
    try {
      setLoading(true)
      
      // Temporarily use only default venues
      setVenues(getDefaultVenues())
      setError(null)
      
      // TODO: Re-enable Firebase loading
      // const venuesRef = collection(db, 'venues')
      // const q = query(venuesRef, orderBy('createdAt', 'desc'))
      // const querySnapshot = await getDocs(q)
      
      // const venuesData = []
      // querySnapshot.forEach((doc) => {
      //   venuesData.push({
      //     id: doc.id,
      //     ...doc.data()
      //   })
      // })
      
      // if (venuesData.length === 0) {
      //   setVenues(getDefaultVenues())
      // } else {
      //   setVenues(venuesData)
      // }
      
    } catch (err) {
      console.error('Error loading venues:', err)
      setError('Failed to load venues')
      setVenues(getDefaultVenues())
    } finally {
      setLoading(false)
    }
  }

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
    },
    {
      id: 'default-4',
      name: "Tennis Academy",
      description: "Professional tennis courts with coaching facilities",
      pricePerHour: 1200,
      emoji: "🎾",
      location: { city: "Uptown", address: "321 Tennis Blvd" },
      rating: 4.7,
      type: "Tennis",
      merchantId: "default-merchant-4",
      merchantName: "Elite Tennis Club",
      featured: true,
      amenities: ["Coaching", "Equipment Rental", "Refreshments"],
      availability: "6 AM - 9 PM",
      images: [],
      createdAt: new Date()
    },
    {
      id: 'default-5',
      name: "Badminton Arena",
      description: "Multiple badminton courts with professional lighting",
      pricePerHour: 600,
      emoji: "🏸",
      location: { city: "East Side", address: "654 Shuttle St" },
      rating: 4.6,
      type: "Badminton",
      merchantId: "default-merchant-5",
      merchantName: "Shuttle Sports",
      featured: true,
      amenities: ["Multiple Courts", "Equipment", "Parking"],
      availability: "7 AM - 11 PM",
      images: [],
      createdAt: new Date()
    },
    {
      id: 'default-6',
      name: "Cricket Ground",
      description: "Full-size cricket ground with pavilion and nets",
      pricePerHour: 3000,
      emoji: "🏏",
      location: { city: "South District", address: "987 Cricket Ave" },
      rating: 4.8,
      type: "Cricket",
      merchantId: "default-merchant-6",
      merchantName: "Cricket Central",
      featured: true,
      amenities: ["Pavilion", "Practice Nets", "Scoreboard"],
      availability: "6 AM - 8 PM",
      images: [],
      createdAt: new Date()
    }
  ]

  const addVenue = async (venueData) => {
    try {
      // Temporarily disable Firebase calls
      const localVenue = {
        id: `local-${Date.now()}`,
        ...venueData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setVenues(prev => [localVenue, ...prev])
      return localVenue
      
      // TODO: Re-enable Firebase
      // const venuesRef = collection(db, 'venues')
      // const newVenue = {
      //   ...venueData,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // }
      
      // const docRef = await addDoc(venuesRef, newVenue)
      // const addedVenue = {
      //   id: docRef.id,
      //   ...newVenue
      // }
      
      // setVenues(prev => [addedVenue, ...prev])
      // return addedVenue
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
      // Temporarily disable Firebase
      setVenues(prev => prev.map(venue => 
        venue.id === venueId 
          ? { ...venue, ...updates, updatedAt: new Date() }
          : venue
      ))
      
      // TODO: Re-enable Firebase
      // const venueRef = doc(db, 'venues', venueId)
      // const updatedData = {
      //   ...updates,
      //   updatedAt: new Date()
      // }
      
      // await updateDoc(venueRef, updatedData)
      
      // setVenues(prev => prev.map(venue => 
      //   venue.id === venueId 
      //     ? { ...venue, ...updatedData }
      //     : venue
      // ))
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
      // Temporarily disable Firebase
      setVenues(prev => prev.filter(venue => venue.id !== venueId))
      
      // TODO: Re-enable Firebase
      // await deleteDoc(doc(db, 'venues', venueId))
      // setVenues(prev => prev.filter(venue => venue.id !== venueId))
    } catch (err) {
      console.error('Error deleting venue:', err)
      // Delete locally even if Firebase fails
      setVenues(prev => prev.filter(venue => venue.id !== venueId))
    }
  }

  const searchVenues = (searchTerm, filters = {}) => {
    let filtered = venues

    // Text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(venue => {
        const venueIndex = searchIndex.find(index => index.id === venue.id)
        return venueIndex?.keywords.includes(searchLower) ||
               venue.name.toLowerCase().includes(searchLower) ||
               venue.type.toLowerCase().includes(searchLower)
      })
    }

    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase()
      filtered = filtered.filter(venue => {
        const location = typeof venue.location === 'string' 
          ? venue.location 
          : `${venue.location?.city || ''} ${venue.location?.address || ''}`
        return location.toLowerCase().includes(locationLower)
      })
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(venue => venue.type === filters.type)
    }

    // Price range filter
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
