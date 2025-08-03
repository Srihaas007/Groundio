function Card({ children, className = "", onClick }) {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

function VenueCard({ venue, onBook }) {
  return (
    <Card className="venue-card">
      <div className="venue-image">
        <span className="venue-emoji">{venue.image}</span>
      </div>
      <div className="venue-info">
        <h3>{venue.name}</h3>
        {venue.location && (
          <p className="venue-location">
            <span className="location-icon">📍</span>
            {venue.location}
          </p>
        )}
        <p className="venue-description">{venue.description}</p>
        <div className="venue-meta">
          <span className="venue-price">{venue.price}</span>
          {venue.rating && (
            <span className="venue-rating">
              ⭐ {venue.rating}
            </span>
          )}
        </div>
        <button 
          className="btn btn-primary venue-book-btn"
          onClick={() => onBook && onBook(venue)}
        >
          Book Now
        </button>
      </div>
    </Card>
  )
}

export { Card, VenueCard }
