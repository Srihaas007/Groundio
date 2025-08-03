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

  const navLinks = [
    { to: '/', label: 'Home', exact: true },
    { to: '/search', label: 'Browse Venues' },
  ]

  const isActiveLink = (to, exact = false) => {
    if (exact) {
      return location.pathname === to
    }
    return location.pathname.startsWith(to)
  }

  return (
    <>
      <header className="header-modern">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo-link">
              <div className="logo-icon">🏟️</div>
              <span className="logo-text">Groundio</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav-desktop">
              {navLinks.map(({ to, label, exact }) => (
                <Link
                  key={to}
                  to={to}
                  className={`nav-link ${isActiveLink(to, exact) ? 'nav-link-active' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth */}
            <div className="auth-desktop">
              {currentUser ? (
                <div className="user-menu">
                  <div className="user-avatar">
                    {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                  </div>
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-name">{currentUser.displayName || 'User'}</div>
                      <div className="user-email">{currentUser.email}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                    <Link to="/bookings" className="dropdown-item">
                      My Bookings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item dropdown-item-danger">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-ghost btn-sm">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-primary btn-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={`mobile-menu-btn ${isMobileMenuOpen ? 'mobile-menu-btn-open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="mobile-menu-content">
            <nav className="mobile-nav">
              {navLinks.map(({ to, label, exact }) => (
                <Link
                  key={to}
                  to={to}
                  className={`mobile-nav-link ${isActiveLink(to, exact) ? 'mobile-nav-link-active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {label}
                </Link>
              ))}
            </nav>
            
            <div className="mobile-auth">
              {currentUser ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <div className="user-avatar-large">
                      {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="mobile-user-name">{currentUser.displayName || 'User'}</div>
                      <div className="mobile-user-email">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="mobile-user-actions">
                    <Link to="/profile" className="btn btn-secondary btn-sm w-full mb-3" onClick={closeMobileMenu}>
                      Profile
                    </Link>
                    <Link to="/bookings" className="btn btn-secondary btn-sm w-full mb-3" onClick={closeMobileMenu}>
                      My Bookings
                    </Link>
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="btn btn-ghost btn-sm w-full mb-3" onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-primary btn-sm w-full" onClick={closeMobileMenu}>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .header-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--gray-200);
          position: sticky;
          top: 0;
          z-index: 50;
          padding: var(--space-4) 0;
          transition: all 0.3s ease;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          color: var(--gray-900);
          font-weight: 800;
          font-size: 1.5rem;
          transition: transform 0.2s ease;
        }

        .logo-link:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-desktop {
          display: none;
          align-items: center;
          gap: var(--space-8);
        }

        @media (min-width: 768px) {
          .nav-desktop {
            display: flex;
          }
        }

        .nav-link {
          text-decoration: none;
          color: var(--gray-600);
          font-weight: 500;
          font-size: 0.95rem;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-lg);
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link:hover {
          color: var(--primary-600);
          background: var(--primary-50);
        }

        .nav-link-active {
          color: var(--primary-600);
          background: var(--primary-50);
        }

        .auth-desktop {
          display: none;
          align-items: center;
          gap: var(--space-3);
        }

        @media (min-width: 768px) {
          .auth-desktop {
            display: flex;
          }
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .user-menu {
          position: relative;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .user-avatar:hover {
          transform: scale(1.1);
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--gray-200);
          min-width: 200px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
          z-index: 100;
        }

        .user-menu:hover .user-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .user-info {
          padding: var(--space-4);
        }

        .user-name {
          font-weight: 600;
          color: var(--gray-900);
          margin-bottom: var(--space-1);
        }

        .user-email {
          font-size: 0.875rem;
          color: var(--gray-600);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--gray-200);
          margin: var(--space-2) var(--space-4);
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: var(--space-3) var(--space-4);
          text-decoration: none;
          color: var(--gray-700);
          font-size: 0.875rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: var(--gray-50);
          color: var(--gray-900);
        }

        .dropdown-item-danger {
          color: var(--error-600);
        }

        .dropdown-item-danger:hover {
          background: var(--error-50);
          color: var(--error-700);
        }

        .mobile-menu-btn {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 101;
        }

        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .mobile-menu-btn span {
          width: 100%;
          height: 2px;
          background: var(--gray-700);
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .mobile-menu-btn-open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-btn-open span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-btn-open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu-open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu-content {
          padding: var(--space-20) var(--space-6) var(--space-6);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .mobile-nav-link {
          display: block;
          padding: var(--space-4);
          text-decoration: none;
          color: var(--gray-700);
          font-size: 1.125rem;
          font-weight: 500;
          border-radius: var(--radius-xl);
          transition: all 0.2s ease;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link-active {
          background: var(--primary-50);
          color: var(--primary-600);
        }

        .mobile-user-section {
          padding: var(--space-6);
          background: var(--gray-50);
          border-radius: var(--radius-2xl);
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .user-avatar-large {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.5rem;
        }

        .mobile-user-name {
          font-weight: 600;
          color: var(--gray-900);
          font-size: 1.125rem;
        }

        .mobile-user-email {
          color: var(--gray-600);
          font-size: 0.875rem;
        }

        .mobile-auth-buttons {
          padding: var(--space-6);
        }
      `}</style>
    </>
  )
}

export default Header
