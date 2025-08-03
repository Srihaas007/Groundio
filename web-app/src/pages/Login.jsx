import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TODO: Implement Firebase authentication
      // For now, simulate login
      if (email && password) {
        setUser({ name: email.split('@')[0], email })
        navigate('/')
      } else {
        setError('Please fill in all fields')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <section className="section auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-header">
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Sign in to your Groundio account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                />
              </div>
              
              {error && <div className="form-error">{error}</div>}
              
              <button 
                type="submit" 
                disabled={loading}
                className={`btn-primary btn-full-width ${loading ? 'btn-loading' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="auth-footer">
              <p className="auth-link-text">
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
