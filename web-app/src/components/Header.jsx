import { Link } from 'react-router-dom'

function Header({ user, setUser }) {
  const handleLogout = () => {
    setUser(null)
  }

  return (
    <header className="header">
      <h1>Groundio</h1>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
