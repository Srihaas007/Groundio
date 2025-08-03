import { Link } from 'react-router-dom'

function Home() {
  const featuredVenues = [
    {
      id: 1,
      name: "City Sports Complex",
      description: "Full-size football field with modern facilities",
      price: "₹2,000/hour",
      image: "🏟️"
    },
    {
      id: 2,
      name: "Downtown Basketball Court", 
      description: "Indoor basketball court with air conditioning",
      price: "₹800/hour",
      image: "🏀"
    },
    {
      id: 3,
      name: "Olympic Swimming Pool",
      description: "50m pool with diving boards and changing rooms", 
      price: "₹1,500/hour",
      image: "🏊"
    },
    {
      id: 4,
      name: "Tennis Academy",
      description: "Professional tennis courts with coaching facilities",
      price: "₹1,200/hour", 
      image: "🎾"
    },
    {
      id: 5,
      name: "Badminton Club",
      description: "Multiple courts with premium flooring",
      price: "₹600/hour",
      image: "🏸"
    },
    {
      id: 6,
      name: "Cricket Ground",
      description: "Full-size cricket ground with pavilion",
      price: "₹3,000/hour",
      image: "🏏"
    }
  ]

  return (
    <div className="page">
      <section className="hero">
        <h1>Find Your Perfect Venue</h1>
        <p>Book stadiums, sports complexes, and venues across the city with ease</p>
        <Link to="/search">
          <button className="cta-button">
            Start Searching
          </button>
        </Link>
      </section>
      
      <section className="mt-2">
        <h2 className="text-center mb-2">Featured Venues</h2>
        <div className="venues-grid">
          {featuredVenues.map((venue) => (
            <div key={venue.id} className="card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{venue.image}</div>
              <h3>{venue.name}</h3>
              <p>{venue.description}</p>
              <p><strong>{venue.price}</strong></p>
              <button className="btn-secondary mt-1" style={{ width: '100%' }}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mt-2" style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2>Why Choose Groundio?</h2>
        <div className="venues-grid mt-2">
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <h3>Quick Booking</h3>
            <p>Book your venue in just a few clicks with our streamlined process</p>
          </div>
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
            <h3>Secure Payments</h3>
            <p>Safe and secure payment processing with multiple payment options</p>
          </div>
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
            <h3>Mobile Friendly</h3>  
            <p>Access and book venues from any device, anywhere, anytime</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
