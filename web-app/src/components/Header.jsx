import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(4px)',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: 'white',
                fontWeight: '700',
                fontSize: '1.125rem'
              }}>G</span>
            </div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Groundio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem'
          }} className="desktop-nav">
            <Link to="/discover" style={{
              color: '#374151',
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}>
              Discover
            </Link>
            <Link to="/book" style={{
              color: '#374151',
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}>
              Book Now
            </Link>
            <Link to="/bookings" style={{
              color: '#374151',
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}>
              My Bookings
            </Link>
            <Link to="/list-venue" style={{
              color: '#374151',
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}>
              List Venue
            </Link>
          </nav>

          {/* User Menu & Mobile Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Link to="/signin" style={{
              display: 'none',
              background: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease'
            }} className="desktop-signin">
              Sign In
            </Link>
            <button 
              style={{
                display: 'block',
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{
            display: 'block',
            marginTop: '0.5rem',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }} className="mobile-menu">
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <Link to="/discover" style={{
                color: '#374151',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}>
                Discover
              </Link>
              <Link to="/book" style={{
                color: '#374151',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}>
                Book Now
              </Link>
              <Link to="/bookings" style={{
                color: '#374151',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}>
                My Bookings
              </Link>
              <Link to="/list-venue" style={{
                color: '#374151',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}>
                List Venue
              </Link>
              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <Link to="/signin" style={{
                color: '#374151',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}>
                Sign In
              </Link>
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-signin {
            display: inline-flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-menu {
            display: none !important;
          }
        }
        
        .desktop-nav a:hover,
        .mobile-menu a:hover {
          color: #2563eb !important;
        }
        
        .desktop-signin:hover {
          background-color: #1d4ed8 !important;
        }
      `}</style>
    </header>
  );
};

export default Header;
