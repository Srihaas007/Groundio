import { useState } from 'react'
import { Link } from 'react-router-dom'
import GroundioLogo from './GroundioLogo'

function Header({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    setUser(null)
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="header">
      <Link to="/" style={{ textDecoration: 'none' }} onClick={closeMobileMenu}>
        <div className="logo-container">
          <GroundioLogo className="w-10 h-10" />
          <h1>Groundio</h1>
        </div>
      </Link>
      
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Navigation */}
      <nav className={`nav ${isMobileMenuOpen ? 'nav-mobile-open' : ''}`}>
        <Link to="/" onClick={closeMobileMenu}>Home</Link>
        <Link to="/search" onClick={closeMobileMenu}>Search</Link>
        {user ? (
          <>
            <span className="user-welcome">
              Welcome, {user.name}
            </span>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMobileMenu}>Login</Link>
            <Link to="/signup" onClick={closeMobileMenu}>Sign Up</Link>
          </>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  )
}

export default Header
