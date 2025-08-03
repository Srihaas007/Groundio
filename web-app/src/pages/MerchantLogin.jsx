import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PageContainer from '../components/PageContainer'

function MerchantLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate('/merchant/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="section" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '80vh'
      }}>
        <div className="form-container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Merchant Login</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Sign in to manage your venues
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Business Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your business email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Don't have a merchant account?{' '}
              <Link 
                to="/merchant/signup" 
                style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
              >
                Register your business
              </Link>
            </p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              <Link 
                to="/login" 
                style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                ← Back to Customer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default MerchantLogin
