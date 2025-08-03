import { useState } from "react";
import { Search, MapPin, Calendar, Users, Filter } from "lucide-react";

const Hero = () => {
  const [searchData, setSearchData] = useState({
    location: "",
    sport: "",
    date: "",
    players: ""
  });

  const handleSearch = () => {
    console.log("Search data:", searchData);
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, #ffffff 50%, rgba(16, 185, 129, 0.1) 100%)'
    }}>
      {/* Floating Elements */}
      <div style={{
        position: 'absolute',
        top: '5rem',
        left: '2.5rem',
        width: '5rem',
        height: '5rem',
        background: 'rgba(59, 130, 246, 0.2)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '8rem',
        right: '4rem',
        width: '8rem',
        height: '8rem',
        background: 'rgba(16, 185, 129, 0.2)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        animation: 'float 6s ease-in-out infinite'
      }} />

      <div className="container">
        <div className="text-center mb-8">
          {/* Main Heading */}
          <div className="mb-4">
            <h1 style={{
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              fontWeight: '700',
              lineHeight: '1.1',
              marginBottom: '1rem'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Book Your Perfect
              </span>
              <br />
              <span style={{ color: '#0f172a' }}>
                Sports Venue
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            maxWidth: '32rem',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6'
          }}>
            Discover and reserve premium sports facilities near you. From football pitches to tennis courts, 
            find the perfect venue for your game.
          </p>

          {/* Search Section */}
          <div className="card" style={{
            maxWidth: '64rem',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {/* Location Input */}
              <div style={{ position: 'relative' }}>
                <MapPin style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  width: '1rem',
                  height: '1rem'
                }} />
                <input
                  className="input"
                  placeholder="Location"
                  value={searchData.location}
                  onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                  style={{
                    paddingLeft: '2.5rem',
                    height: '3rem'
                  }}
                />
              </div>

              {/* Sport Type Input */}
              <div style={{ position: 'relative' }}>
                <Filter style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  width: '1rem',
                  height: '1rem'
                }} />
                <input
                  className="input"
                  placeholder="Sport Type"
                  value={searchData.sport}
                  onChange={(e) => setSearchData({...searchData, sport: e.target.value})}
                  style={{
                    paddingLeft: '2.5rem',
                    height: '3rem'
                  }}
                />
              </div>

              {/* Date Input */}
              <div style={{ position: 'relative' }}>
                <Calendar style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  width: '1rem',
                  height: '1rem'
                }} />
                <input
                  className="input"
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                  style={{
                    paddingLeft: '2.5rem',
                    height: '3rem'
                  }}
                />
              </div>

              {/* Players Input */}
              <div style={{ position: 'relative' }}>
                <Users style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  width: '1rem',
                  height: '1rem'
                }} />
                <input
                  className="input"
                  placeholder="Players"
                  value={searchData.players}
                  onChange={(e) => setSearchData({...searchData, players: e.target.value})}
                  style={{
                    paddingLeft: '2.5rem',
                    height: '3rem'
                  }}
                />
              </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '3rem',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Search style={{ width: '1.25rem', height: '1.25rem' }} />
              Search Venues
            </button>
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1.5rem',
            marginTop: '4rem',
            maxWidth: '32rem',
            margin: '4rem auto 0'
          }}>
            <div className="text-center">
              <div style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: '#3b82f6',
                marginBottom: '0.25rem'
              }}>500+</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#64748b'
              }}>Sports Venues</div>
            </div>
            <div className="text-center">
              <div style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: '#3b82f6',
                marginBottom: '0.25rem'
              }}>50+</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#64748b'
              }}>Cities</div>
            </div>
            <div className="text-center">
              <div style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: '#3b82f6',
                marginBottom: '0.25rem'
              }}>10k+</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#64748b'
              }}>Happy Users</div>
            </div>
            <div className="text-center">
              <div style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: '#3b82f6',
                marginBottom: '0.25rem'
              }}>24/7</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#64748b'
              }}>Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
