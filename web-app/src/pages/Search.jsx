import { useState } from 'react'

function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [venueType, setVenueType] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Searching for:', { searchTerm, location, venueType })
  }

  const mockResults = [
    {
      id: 1,
      name: "Central Sports Hub",
      location: "Downtown",
      type: "Multi-purpose",
      price: "₹1,200/hour",
      image: "🏟️",
      rating: 4.5
    },
    {
      id: 2,
      name: "Elite Tennis Academy", 
      location: "Uptown",
      type: "Tennis Court",
      price: "₹600/hour",
      image: "🎾",
      rating: 4.8
    },
    {
      id: 3,
      name: "Aqua Sports Center",
      location: "Westside", 
      type: "Swimming Pool",
      price: "₹900/hour",
      image: "🏊",
      rating: 4.3
    },
    {
      id: 4,
      name: "Champions Cricket Ground",
      location: "Eastside",
      type: "Cricket Ground", 
      price: "₹2,500/hour",
      image: "🏏",
      rating: 4.6
    },
    {
      id: 5,
      name: "Urban Basketball Arena",
      location: "Central",
      type: "Basketball Court",
      price: "₹800/hour", 
      image: "🏀",
      rating: 4.4
    },
    {
      id: 6,
      name: "Premier Badminton Club",
      location: "Northside",
      type: "Badminton Court",
      price: "₹500/hour",
      image: "🏸", 
      rating: 4.7
    }
  ]

  return (
    <div className="page-container">
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <h1 className="section-title">Search Venues</h1>
            <p className="section-subtitle">Find the perfect venue for your next game or event</p>
          </div>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-form-grid">
              <div className="form-group">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search venues..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Venue Type</label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Types</option>
                  <option value="football">Football Field</option>
                  <option value="basketball">Basketball Court</option>
                  <option value="tennis">Tennis Court</option>
                  <option value="swimming">Swimming Pool</option>
                  <option value="cricket">Cricket Ground</option>
                  <option value="badminton">Badminton Court</option>
                </select>
              </div>
            </div>
            <div className="text-center mt-3">
              <button type="submit" className="btn-primary btn-large">
                🔍 Search Venues
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="search-results-header">
            <p className="results-count">Found {mockResults.length} venues</p>
          </div>

          <div className="venues-grid">
            {mockResults.map((venue) => (
              <div key={venue.id} className="venue-card">
                <div className="venue-image">{venue.image}</div>
                <div className="venue-info">
                  <h3 className="venue-name">{venue.name}</h3>
                  <p className="venue-location">📍 {venue.location}</p>
                  <p className="venue-type">{venue.type}</p>
                  <div className="venue-details">
                    <span className="venue-price">{venue.price}</span>
                    <span className="venue-rating">⭐ {venue.rating}</span>
                  </div>
                  <button className="btn-secondary btn-full-width">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Search
