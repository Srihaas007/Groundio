import { useState, useEffect } from 'react'
import { useVenues } from '../contexts/SimpleVenueContext'
import { useAuth } from '../contexts/AuthContext'
import PageContainer from '../components/PageContainer'
import { VenueCard } from '../components/Card'

function MerchantDashboard() {
  const { currentUser } = useAuth()
  const { 
    getVenuesByMerchant, 
    addVenue, 
    updateVenue, 
    deleteVenue,
    getVenueTypes,
    getLocations 
  } = useVenues()
  
  const [myVenues, setMyVenues] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVenue, setEditingVenue] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '🏟️',
    location: '',
    type: '',
    amenities: '',
    availability: ''
  })

  useEffect(() => {
    if (currentUser?.uid) {
      const venues = getVenuesByMerchant(currentUser.uid)
      setMyVenues(venues)
    }
  }, [currentUser, getVenuesByMerchant])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const venueData = {
      ...formData,
      merchantId: currentUser.uid,
      merchantName: currentUser.displayName || currentUser.email,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      price: formData.price.includes('₹') ? formData.price : `₹${formData.price}/hour`
    }

    if (editingVenue) {
      updateVenue(editingVenue.id, venueData)
      setEditingVenue(null)
    } else {
      addVenue(venueData)
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '🏟️',
      location: '',
      type: '',
      amenities: '',
      availability: ''
    })
    setShowAddForm(false)
    
    // Refresh venues
    const updatedVenues = getVenuesByMerchant(user.id.toString())
    setMyVenues(updatedVenues)
  }

  const handleEdit = (venue) => {
    setEditingVenue(venue)
    setFormData({
      name: venue.name,
      description: venue.description,
      price: venue.price.replace('₹', '').replace('/hour', ''),
      image: venue.image,
      location: venue.location,
      type: venue.type,
      amenities: venue.amenities.join(', '),
      availability: venue.availability
    })
    setShowAddForm(true)
  }

  const handleDelete = (venueId) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      deleteVenue(venueId)
      const updatedVenues = getVenuesByMerchant(user.id.toString())
      setMyVenues(updatedVenues)
    }
  }

  const emojiOptions = ['🏟️', '🏀', '🎾', '🏸', '🏊', '🏏', '⚽', '🏈', '🏒', '🥅', '🏐', '🎯']

  if (!user || user.type !== 'merchant') {
    return (
      <PageContainer>
        <div className="section" style={{ textAlign: 'center' }}>
          <h1>Access Denied</h1>
          <p>This page is only accessible to registered merchants.</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="section">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>
              Welcome, {user.businessName}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage your venues and bookings
            </p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setShowAddForm(!showAddForm)
              setEditingVenue(null)
              setFormData({
                name: '',
                description: '',
                price: '',
                image: '🏟️',
                location: '',
                type: '',
                amenities: '',
                availability: ''
              })
            }}
          >
            {showAddForm ? 'Cancel' : '+ Add New Venue'}
          </button>
        </div>

        {!user.verified && (
          <div style={{
            background: 'var(--warning-color)',
            color: 'var(--background-primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <strong>Account Verification Pending</strong><br />
            Your business account is under review. You can add venues, but they won't be visible to customers until verified.
          </div>
        )}

        {showAddForm && (
          <div className="card" style={{ marginBottom: '3rem' }}>
            <h3>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h3>
            <form onSubmit={handleSubmit} className="form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Venue Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select
                    name="type"
                    className="form-input"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Multi-purpose">Multi-purpose</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price per Hour *</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    placeholder="Enter amount in rupees"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <select
                    name="image"
                    className="form-input"
                    value={formData.image}
                    onChange={handleInputChange}
                  >
                    {emojiOptions.map(emoji => (
                      <option key={emoji} value={emoji}>{emoji}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <input
                    type="text"
                    name="availability"
                    className="form-input"
                    placeholder="e.g., 6 AM - 11 PM"
                    value={formData.availability}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  className="form-input"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amenities (comma-separated)</label>
                <input
                  type="text"
                  name="amenities"
                  className="form-input"
                  placeholder="e.g., Parking, Changing Rooms, First Aid"
                  value={formData.amenities}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingVenue ? 'Update Venue' : 'Add Venue'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingVenue(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h2 style={{ marginBottom: '2rem' }}>
            Your Venues ({myVenues.length})
          </h2>
          
          {myVenues.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>No venues yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Start by adding your first venue to attract customers
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Add Your First Venue
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {myVenues.map(venue => (
                <div key={venue.id} className="venue-card" style={{ position: 'relative' }}>
                  <VenueCard venue={venue} />
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    marginTop: '1rem',
                    padding: '0 1.5rem 1.5rem'
                  }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ flex: 1 }}
                      onClick={() => handleEdit(venue)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn" 
                      style={{ 
                        flex: 1, 
                        background: 'var(--error-color)',
                        color: 'white'
                      }}
                      onClick={() => handleDelete(venue.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default MerchantDashboard
