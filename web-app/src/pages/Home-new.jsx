import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import PageContainer from '../components/PageContainer'
import { VenueCard } from '../components/Card'

function Home() {
  const featuredVenues = [
    {
      id: 1,
      name: "City Sports Complex",
      description: "Full-size football field with modern facilities",
      price: "₹2,000/hour",
      image: "🏟️",
      location: "Downtown",
      rating: 4.8
    },
    {
      id: 2,
      name: "Downtown Basketball Court", 
      description: "Indoor basketball court with air conditioning",
      price: "₹800/hour",
      image: "🏀",
      location: "City Center",
      rating: 4.5
    },
    {
      id: 3,
      name: "Olympic Swimming Pool",
      description: "50m pool with diving boards and changing rooms", 
      price: "₹1,500/hour",
      image: "🏊",
      location: "Sports District",
      rating: 4.9
    },
    {
      id: 4,
      name: "Tennis Academy",
      description: "Professional tennis courts with coaching facilities",
      price: "₹1,200/hour", 
      image: "🎾",
      location: "Uptown",
      rating: 4.7
    },
    {
      id: 5,
      name: "Badminton Arena",
      description: "Multiple badminton courts with professional lighting",
      price: "₹600/hour",
      image: "🏸",
      location: "East Side",
      rating: 4.6
    },
    {
      id: 6,
      name: "Cricket Ground",
      description: "Full-size cricket ground with pavilion and nets",
      price: "₹3,000/hour",
      image: "🏏",
      location: "South District",
      rating: 4.8
    }
  ]

  const features = [
    {
      icon: "⚡",
      title: "Quick Booking",
      description: "Book your venue in just a few clicks with our streamlined process"
    },
    {
      icon: "💳",
      title: "Secure Payments",
      description: "Safe and secure payment processing with multiple payment options"
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Access and book venues from any device, anywhere, anytime"
    }
  ]

  const handleBookVenue = (venue) => {
    alert(`Booking ${venue.name}...`)
  }

  return (
    <>
      <Hero 
        title="Find Your Perfect Venue"
        subtitle="Book stadiums, sports complexes, and venues across the city with ease"
      >
        <Link to="/search" className="btn btn-primary">
          Start Searching
        </Link>
      </Hero>

      <PageContainer>
        <section className="section">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
            Featured Venues
          </h2>
          <div className="cards-grid">
            {featuredVenues.map(venue => (
              <VenueCard 
                key={venue.id} 
                venue={venue} 
                onBook={handleBookVenue}
              />
            ))}
          </div>
        </section>

        <section className="section" style={{ background: 'var(--background-secondary)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
            Why Choose Groundio?
          </h2>
          <div className="cards-grid">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '3rem', display: 'block' }}>{feature.icon}</span>
                </div>
                <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </PageContainer>
    </>
  )
}

export default Home
