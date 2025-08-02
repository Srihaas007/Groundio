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

  return (
    <div className="page">
      <h1>Search Venues</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search venues..."
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location..."
            />
          </div>
          <div className="form-group">
            <label>Venue Type</label>
            <select
              value={venueType}
              onChange={(e) => setVenueType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #333',
                borderRadius: '4px',
                backgroundColor: '#2a2a2a',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="">All Types</option>
              <option value="football">Football Field</option>
              <option value="basketball">Basketball Court</option>
              <option value="tennis">Tennis Court</option>
              <option value="swimming">Swimming Pool</option>
              <option value="cricket">Cricket Ground</option>
            </select>
          </div>
        </div>
        <button type="submit" className="cta-button">Search</button>
      </form>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {/* Mock search results */}
        <div className="card">
          <h3>Central Sports Hub</h3>
          <p>Location: Downtown</p>
          <p>Type: Multi-purpose</p>
          <p><strong>₹1,200/hour</strong></p>
          <button style={{ marginTop: '1rem' }}>Book Now</button>
        </div>
        <div className="card">
          <h3>Elite Tennis Academy</h3>
          <p>Location: Uptown</p>
          <p>Type: Tennis Court</p>
          <p><strong>₹600/hour</strong></p>
          <button style={{ marginTop: '1rem' }}>Book Now</button>
        </div>
        <div className="card">
          <h3>Aqua Sports Center</h3>
          <p>Location: Westside</p>
          <p>Type: Swimming Pool</p>
          <p><strong>₹900/hour</strong></p>
          <button style={{ marginTop: '1rem' }}>Book Now</button>
        </div>
      </div>
    </div>
  )
}

export default Search
