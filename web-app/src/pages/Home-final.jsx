import { Link } from 'react-router-dom'
import { useVenues } from '../contexts/VenueContext'
import Hero from '../components/Hero'
import PageContainer from '../components/PageContainer'
import { VenueCard } from '../components/Card'

function Home() {
  const { getFeaturedVenues } = useVenues()
  const featuredVenues = getFeaturedVenues()

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
    alert(`Booking ${venue.name}...\nPrice: ${venue.price}\nContact: ${venue.merchantName}`)
  }

  return (
    <>
      <Hero 
        title="Find Your Perfect Venue"
        subtitle="Book stadiums, sports complexes, and venues across the city with ease"
      >
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          marginTop: '1rem'
        }}>
          <Link to="/search" className="btn btn-primary">
            Browse Venues
          </Link>
          <Link to="/merchant/signup" className="btn btn-secondary">
            List Your Venue
          </Link>
        </div>
      </Hero>

      <PageContainer>
        {/* Merchant Call-to-Action */}
        <section className="section" style={{ 
          background: 'var(--background-secondary)', 
          margin: '0 -2rem',
          padding: '3rem 2rem'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
              marginBottom: '1rem' 
            }}>
              Own a Sports Facility?
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '2rem',
              fontSize: 'clamp(1rem, 3vw, 1.125rem)'
            }}>
              Join hundreds of venue owners who are earning more by listing their facilities on Groundio
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link to="/merchant/signup" className="btn btn-primary">
                Register Your Business
              </Link>
              <Link to="/merchant/login" className="btn btn-secondary">
                Merchant Login
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Venues */}
        <section className="section">
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '3rem', 
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' 
          }}>
            Featured Venues
          </h2>
          
          {featuredVenues.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>No featured venues yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Check back soon for amazing venues in your area
              </p>
              <Link to="/search" className="btn btn-primary">
                Browse All Venues
              </Link>
            </div>
          ) : (
            <div className="cards-grid">
              {featuredVenues.slice(0, 6).map(venue => (
                <VenueCard 
                  key={venue.id} 
                  venue={venue} 
                  onBook={handleBookVenue}
                />
              ))}
            </div>
          )}

          {featuredVenues.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/search" className="btn btn-primary">
                View All {featuredVenues.length} Venues
              </Link>
            </div>
          )}
        </section>

        {/* Why Choose Groundio */}
        <section className="section" style={{ 
          background: 'var(--background-secondary)',
          margin: '0 -2rem',
          padding: '3rem 2rem'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '3rem', 
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' 
          }}>
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

        {/* How It Works */}
        <section className="section">
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '3rem', 
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' 
          }}>
            How It Works
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--primary-gradient)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                color: 'white'
              }}>
                1
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Search & Discover</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Browse through hundreds of venues in your area with detailed information
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--primary-gradient)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                color: 'white'
              }}>
                2
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Book Instantly</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Select your preferred time slot and book your venue with just a few clicks
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--primary-gradient)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                color: 'white'
              }}>
                3
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Play & Enjoy</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Show up and enjoy your game at the venue. It's that simple!
              </p>
            </div>
          </div>
        </section>
      </PageContainer>
    </>
  )
}

export default Home
