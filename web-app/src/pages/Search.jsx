import React, { useState, useEffect } from 'react'
import { useVenues } from '../contexts/SimpleVenueContext'
import PageContainer from '../components/PageContainer'
import VenueCard from '../components/VenueCard'
import LocationService from '../services/locationService'

const Search = () => {
  const { venues, searchVenues } = useVenues()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('name')
  const [filteredVenues, setFilteredVenues] = useState([])
  const [locationLoading, setLocationLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  // Auto-detect user location on component mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    setLocationLoading(true);
    try {
      // First check if we have stored location
      const storedLocation = LocationService.getStoredLocation();
      if (storedLocation && storedLocation.city) {
        setLocationFilter(storedLocation.city);
        setUserLocation(storedLocation);
        setLocationLoading(false);
        return;
      }

      // Get fresh location
      const location = await LocationService.requestLocationPermission();
      if (location && location.city) {
        setLocationFilter(location.city);
        setUserLocation(location);
        LocationService.storeLocationData(location);
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      // Don't show error to user, just continue without auto-location
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    const performSearch = async () => {
      const results = await searchVenues({
        searchTerm,
        location: locationFilter,
        type: typeFilter,
        priceRange: priceRange.min || priceRange.max ? priceRange : null
      })
      
      // Sort results
      const sorted = [...results].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a.pricePerHour || 0) - (b.pricePerHour || 0)
          case 'price-high':
            return (b.pricePerHour || 0) - (a.pricePerHour || 0)
          case 'rating':
            return (b.rating || 0) - (a.rating || 0)
          case 'name':
          default:
            return a.name.localeCompare(b.name)
        }
      })
      
      setFilteredVenues(sorted)
    }

    performSearch()
  }, [searchTerm, locationFilter, typeFilter, priceRange, sortBy, searchVenues])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value)
  }

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value)
  }

  const handlePriceRangeChange = (field, value) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    setTypeFilter('')
    setPriceRange({ min: '', max: '' })
    setSortBy('name')
  }

  const venueTypes = [...new Set(venues.map(venue => venue.type).filter(Boolean))]
  const locations = [...new Set(venues.map(venue => venue.location?.city).filter(Boolean))]

  return (
    <PageContainer>
      <div className="search-page">
        <div className="search-header">
          <h1>Find Your Perfect Venue</h1>
          <p>Search through our collection of premium sports and event venues</p>
        </div>

        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search venues, sports, locations..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

            <div className="filter-row">
              <div className="location-input-wrapper">
                <select 
                  value={locationFilter} 
                  onChange={handleLocationChange}
                  className="filter-select"
                  disabled={locationLoading}
                >
                  <option value="">
                    {locationLoading ? 'Detecting location...' : 'All Locations'}
                  </option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {locationLoading && (
                  <div className="location-spinner">📍</div>
                )}
                {userLocation && !locationLoading && (
                  <button 
                    onClick={detectUserLocation}
                    className="refresh-location-btn"
                    title="Refresh location"
                  >
                    🔄
                  </button>
                )}
              </div>            <select 
              value={typeFilter} 
              onChange={handleTypeChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              {venueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <div className="price-filter">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                className="price-input"
              />
            </div>

            <select 
              value={sortBy} 
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>

            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="search-results">
          <div className="results-header">
            <h2>
              {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
            </h2>
          </div>

          <div className="venues-grid">
            {filteredVenues.length > 0 ? (
              filteredVenues.map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))
            ) : (
              <div className="no-results">
                <h3>No venues found</h3>
                <p>Try adjusting your search criteria or clearing filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .search-page {
          padding: 2rem 0;
          background: #ffffff;
          min-height: 100vh;
        }

        .search-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .search-header h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 1rem;
          color: #111827;
          font-weight: 800;
        }

        .search-header p {
          font-size: 1.125rem;
          color: #4b5563;
          max-width: 600px;
          margin: 0 auto;
          font-weight: 500;
        }

        .search-filters {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 3rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .search-bar {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1.5rem;
          border: 2px solid #d1d5db;
          border-radius: 12px;
          font-size: 1rem;
          background: #ffffff;
          color: #111827;
          transition: border-color 0.3s ease;
          font-weight: 500;
        }

        .search-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .filter-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .location-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #ffffff;
          color: #111827;
          font-size: 0.9rem;
          min-width: 150px;
          font-weight: 500;
        }

        .filter-select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }

        .filter-select:disabled {
          background: #f3f4f6;
          color: #6b7280;
          cursor: not-allowed;
        }

        .location-spinner {
          animation: pulse 2s infinite;
          font-size: 1rem;
        }

        .refresh-location-btn {
          background: transparent;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .refresh-location-btn:hover {
          background: #f3f4f6;
          border-color: #4f46e5;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .price-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-input {
          width: 100px;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--background);
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .clear-filters-btn {
          padding: 0.75rem 1.5rem;
          background: var(--surface);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-filters-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .search-results {
          margin-top: 2rem;
        }

        .results-header {
          margin-bottom: 2rem;
        }

        .results-header h2 {
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .venues-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          grid-column: 1 / -1;
        }

        .no-results h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .no-results p {
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .filter-row {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-select {
            min-width: unset;
          }

          .price-filter {
            justify-content: center;
          }

          .venues-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageContainer>
  )
}

export default Search
