import React from 'react'

const VenueCard = ({ venue }) => {
  if (!venue) return null

  const {
    id,
    name,
    description,
    type,
    location,
    pricePerHour,
    rating,
    images,
    amenities,
    emoji
  } = venue

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Contact for pricing'
    return `$${price}/hour`
  }

  const formatRating = (rating) => {
    if (!rating || rating === 0) return 'No rating'
    return `${rating.toFixed(1)} ⭐`
  }

  const getLocationString = (location) => {
    if (!location) return 'Location TBD'
    if (typeof location === 'string') return location
    
    const parts = []
    if (location.address) parts.push(location.address)
    if (location.city) parts.push(location.city)
    if (location.state) parts.push(location.state)
    
    return parts.length > 0 ? parts.join(', ') : 'Location TBD'
  }

  const handleCardClick = () => {
    // In a real app, this would navigate to venue details
    console.log('Navigate to venue:', id)
  }

  return (
    <div className="venue-card" onClick={handleCardClick}>
      <div className="venue-image">
        {images && images.length > 0 ? (
          <img src={images[0]} alt={name} />
        ) : (
          <div className="venue-placeholder">
            <span className="venue-emoji">{emoji || '🏟️'}</span>
          </div>
        )}
        <div className="venue-type-badge">
          {type || 'Sports Venue'}
        </div>
      </div>

      <div className="venue-content">
        <div className="venue-header">
          <h3 className="venue-name">{name}</h3>
          <div className="venue-rating">
            {formatRating(rating)}
          </div>
        </div>

        <div className="venue-location">
          📍 {getLocationString(location)}
        </div>

        {description && (
          <p className="venue-description">
            {description.length > 100 
              ? `${description.substring(0, 100)}...` 
              : description
            }
          </p>
        )}

        {amenities && amenities.length > 0 && (
          <div className="venue-amenities">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="amenity-tag">
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="amenity-tag">+{amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="venue-footer">
          <div className="venue-price">
            {formatPrice(pricePerHour)}
          </div>
          <button className="book-btn">
            View Details
          </button>
        </div>
      </div>

      <style jsx>{`
        .venue-card {
          background: var(--surface);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid var(--border-color);
        }

        .venue-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .venue-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .venue-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .venue-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .venue-emoji {
          font-size: 3rem;
        }

        .venue-type-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .venue-content {
          padding: 1.5rem;
        }

        .venue-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .venue-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          flex: 1;
        }

        .venue-rating {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-left: 1rem;
        }

        .venue-location {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .venue-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .venue-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .amenity-tag {
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .venue-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .venue-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary);
        }

        .book-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .book-btn:hover {
          background: var(--primary-dark);
        }

        @media (max-width: 768px) {
          .venue-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .venue-rating {
            margin-left: 0;
            margin-top: 0.5rem;
          }

          .venue-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .book-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default VenueCard
