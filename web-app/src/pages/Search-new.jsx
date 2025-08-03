import { useState, useEffect } from 'react'
import { useVenues } from '../contexts/VenueContext'
import PageContainer from '../components/PageContainer'
import { VenueCard } from '../components/Card'

function Search() {
  const { searchVenues, getVenueTypes, getLocations } = useVenues()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [venueType, setVenueType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const venueTypes = getVenueTypes()
  const locations = getLocations()

  useEffect(() => {
    // Show all venues on initial load
    handleSearch()
  }, [])

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    
    // Simulate API delay
    setTimeout(() => {
      const filters = {
        location: location,
        type: venueType,
        maxPrice: maxPrice ? parseInt(maxPrice) : null
      }
      
      const searchResults = searchVenues(searchTerm, filters)
      setResults(searchResults)
      setSearched(true)
      setLoading(false)
    }, 500)
  }

  const handleBookVenue = (venue) => {
    alert(`Booking ${venue.name}...\nPrice: ${venue.price}\nContact: ${venue.merchantName}`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocation('')
    setVenueType('')
    setMaxPrice('')
    handleSearch()
  }

  return (
    <PageContainer>
      <div className="section">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>Search Venues</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Find the perfect venue for your next game or event
          </p>
        </div>

        {/* Search Form */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-container">
            <div className="search-bar">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search venues, amenities, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <select
                  className="form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ minWidth: '150px' }}
                >
                  <option value="">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Venue Type</label>
                <select
                  className="form-input"
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  style={{ minWidth: '150px' }}
                >
                  <option value="">All Types</option>
                  {venueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Max Price</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="₹ per hour"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ minWidth: '120px' }}
                />
              </div>

              <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Searching...' : '🔍 Search Venues'}
                </button>
              </div>
            </div>

            <div className="filters">
              <button 
                type="button" 
                className="filter-btn"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
              {(searchTerm || location || venueType || maxPrice) && (
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Active filters: {[
                    searchTerm && `"${searchTerm}"`,
                    location && location,
                    venueType && venueType,
                    maxPrice && `Under ₹${maxPrice}/hr`
                  ].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '2rem' 
              }}>
                <h2>
                  {searched ? `Found ${results.length} venues` : `All Venues (${results.length})`}
                </h2>
                
                {results.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Sort by:
                    </span>
                    <select 
                      className="form-input" 
                      style={{ width: 'auto', padding: '0.5rem' }}
                      onChange={(e) => {
                        const sortBy = e.target.value
                        let sorted = [...results]
                        switch(sortBy) {
                          case 'price-low':
                            sorted.sort((a, b) => {
                              const priceA = parseInt(a.price.replace(/[^\d]/g, ''))
                              const priceB = parseInt(b.price.replace(/[^\d]/g, ''))
                              return priceA - priceB
                            })
                            break
                          case 'price-high':
                            sorted.sort((a, b) => {
                              const priceA = parseInt(a.price.replace(/[^\d]/g, ''))
                              const priceB = parseInt(b.price.replace(/[^\d]/g, ''))
                              return priceB - priceA
                            })
                            break
                          case 'rating':
                            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
                            break
                          case 'name':
                            sorted.sort((a, b) => a.name.localeCompare(b.name))
                            break
                          default:
                            break
                        }
                        setResults(sorted)
                      }}
                    >
                      <option value="">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                )}
              </div>

              {results.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    No venues found
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Try adjusting your search criteria or browse all available venues
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={clearFilters}
                  >
                    Show All Venues
                  </button>
                </div>
              ) : (
                <div className="cards-grid">
                  {results.map(venue => (
                    <VenueCard 
                      key={venue.id} 
                      venue={venue} 
                      onBook={handleBookVenue}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default Search
