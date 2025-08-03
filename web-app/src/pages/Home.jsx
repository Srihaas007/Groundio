import { Link } from 'react-router-dom'
import { useVenues } from '../contexts/SimpleVenueContext'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const { getFeaturedVenues } = useVenues()
  const { currentUser } = useAuth()
  const featuredVenues = getFeaturedVenues()

  const features = [
    {
      icon: "⚡",
      title: "Instant Booking",
      description: "Book your perfect venue in seconds with our lightning-fast platform"
    },
    {
      icon: "🔒",
      title: "Secure & Safe",
      description: "Your payments and data are protected with enterprise-grade security"
    },
    {
      icon: "🌟",
      title: "Premium Venues",
      description: "Access to the best stadiums and sports complexes in your city"
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Seamlessly book on any device - phone, tablet, or desktop"
    }
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.2)'
        }}></div>
        
        <div className="container" style={{ 
          position: 'relative', 
          zIndex: 1,
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Find Your Perfect<br />
            <span style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Venue
            </span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            opacity: 0.95,
            lineHeight: '1.6'
          }}>
            Book premium stadiums, sports complexes, and event venues across the city. 
            From corporate events to tournaments - we've got you covered.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/search" 
              className="btn btn-primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}
            >
              🔍 Browse Venues
            </Link>
            {!currentUser && (
              <Link 
                to="/signup" 
                className="btn btn-secondary"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  color: 'white'
                }}
              >
                Join Groundio
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: 'var(--gray-900)',
              marginBottom: '1rem'
            }}>
              Why Choose Groundio?
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--gray-600)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Experience the future of venue booking with our cutting-edge platform
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card"
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid var(--gray-200)'
                }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--gray-900)',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'var(--gray-600)',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section style={{ 
        padding: '4rem 0', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' 
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: 'var(--gray-900)',
              marginBottom: '1rem'
            }}>
              Featured Venues
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--gray-600)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover our most popular and highly-rated venues
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {featuredVenues.slice(0, 6).map(venue => (
              <div 
                key={venue.id}
                className="card"
                style={{
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  height: '200px',
                  background: `linear-gradient(135deg, ${venue.image === '🏟️' ? '#667eea' : '#f093fb'} 0%, ${venue.image === '🏟️' ? '#764ba2' : '#f5576c'} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'white'
                }}>
                  {venue.image}
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--gray-900)',
                    marginBottom: '0.5rem'
                  }}>
                    {venue.name}
                  </h3>
                  <p style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {venue.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: 'var(--primary-600)'
                    }}>
                      {venue.price}
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'var(--gray-500)',
                      background: 'var(--gray-100)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.5rem'
                    }}>
                      {venue.type}
                    </span>
                  </div>
                  
                  <Link
                    to={`/venue/${venue.id}`}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link 
              to="/search" 
              className="btn btn-primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem'
              }}
            >
              View All Venues →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        color: 'white'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Join thousands of satisfied customers and venue owners who trust Groundio 
            for their booking needs.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {!currentUser ? (
              <>
                <Link 
                  to="/signup" 
                  className="btn btn-primary"
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.1rem'
                  }}
                >
                  Sign Up Now
                </Link>
                <Link 
                  to="/merchant/signup" 
                  className="btn btn-secondary"
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    background: 'transparent',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    color: 'white'
                  }}
                >
                  List Your Venue
                </Link>
              </>
            ) : (
              <Link 
                to="/search" 
                className="btn btn-primary"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem'
                }}
              >
                Start Booking
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
