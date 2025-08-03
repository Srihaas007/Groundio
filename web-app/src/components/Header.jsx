import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
      setIsMobileMenuOpen(false)
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--gray-200)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onClick={closeMobileMenu}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--gradient-primary)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🏟️
          </div>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--gray-900)'
          }}>
            Groundio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <Link 
              to="/search" 
              style={{
                textDecoration: 'none',
                color: location.pathname === '/search' ? 'var(--primary-600)' : 'var(--gray-700)',
                fontWeight: '500',
                fontSize: '0.95rem',
                transition: 'color 0.2s ease'
              }}
            >
              Browse Venues
            </Link>

            {currentUser ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                {/* User Avatar & Name */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 1rem',
                  background: 'var(--gray-100)',
                  borderRadius: '2rem',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {(currentUser.displayName || currentUser.email)?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--gray-700)'
                  }}>
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </div>

                {/* Dashboard Link for Merchants */}
                {currentUser.userType === 'merchant' && (
                  <Link 
                    to="/merchant/dashboard" 
                    style={{
                      textDecoration: 'none',
                      color: location.pathname === '/merchant/dashboard' ? 'var(--primary-600)' : 'var(--gray-700)',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}
                  >
                    Dashboard
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Link 
                  to="/login" 
                  className="btn btn-secondary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.375rem'
          }}
          className="mobile-menu-toggle"
        >
          <div style={{
            width: '24px',
            height: '18px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <span style={{
              width: '100%',
              height: '2px',
              background: 'var(--gray-700)',
              borderRadius: '1px',
              transition: 'all 0.3s ease',
              transformOrigin: 'center',
              ...(isMobileMenuOpen && {
                transform: 'rotate(45deg) translate(6px, 6px)'
              })
            }}></span>
            <span style={{
              width: '100%',
              height: '2px',
              background: 'var(--gray-700)',
              borderRadius: '1px',
              transition: 'all 0.3s ease',
              ...(isMobileMenuOpen && {
                opacity: 0
              })
            }}></span>
            <span style={{
              width: '100%',
              height: '2px',
              background: 'var(--gray-700)',
              borderRadius: '1px',
              transition: 'all 0.3s ease',
              transformOrigin: 'center',
              ...(isMobileMenuOpen && {
                transform: 'rotate(-45deg) translate(6px, -6px)'
              })
            }}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          borderBottom: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)',
          padding: '1rem 0'
        }}>
          <div className="container">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <Link
                to="/search"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: 'none',
                  color: 'var(--gray-700)',
                  fontWeight: '500',
                  padding: '0.75rem 0'
                }}
              >
                Browse Venues
              </Link>

              {currentUser ? (
                <>
                  <div style={{
                    padding: '0.75rem 0',
                    borderTop: '1px solid var(--gray-200)',
                    borderBottom: '1px solid var(--gray-200)'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      color: 'var(--gray-600)',
                      marginBottom: '0.25rem'
                    }}>
                      Signed in as
                    </div>
                    <div style={{
                      fontWeight: '500',
                      color: 'var(--gray-900)'
                    }}>
                      {currentUser.displayName || currentUser.email}
                    </div>
                  </div>

                  {currentUser.userType === 'merchant' && (
                    <Link
                      to="/merchant/dashboard"
                      onClick={closeMobileMenu}
                      style={{
                        textDecoration: 'none',
                        color: 'var(--gray-700)',
                        fontWeight: '500',
                        padding: '0.75rem 0'
                      }}
                    >
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--error-500)',
                      fontWeight: '500',
                      padding: '0.75rem 0',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  borderTop: '1px solid var(--gray-200)',
                  paddingTop: '1rem'
                }}>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  )
}

export default Header
