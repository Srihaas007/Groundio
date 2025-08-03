import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PageContainer from '../components/PageContainer'

function MerchantSignUp() {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match')
        return
      }

      // Use Firebase Auth to create merchant account
      await signup(formData.email, formData.password, {
        displayName: formData.businessName,
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        businessType: formData.businessType,
        address: formData.address,
        userType: 'merchant',
        verified: false
      })
      
      navigate('/merchant/dashboard')
    } catch (error) {
      alert('Registration failed: ' + error.message)
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
        minHeight: '100vh',
        padding: '2rem 0'
      }}>
        <div className="form-container" style={{ maxWidth: '500px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Register Your Business</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Join Groundio and start listing your venues
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="businessName" className="form-label">Business Name *</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                className="form-input"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ownerName" className="form-label">Owner Name *</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                className="form-input"
                placeholder="Enter owner's full name"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Business Email *</label>
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
              <label htmlFor="phone" className="form-label">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="businessType" className="form-label">Business Type</label>
              <select
                id="businessType"
                name="businessType"
                className="form-input"
                value={formData.businessType}
                onChange={handleChange}
              >
                <option value="">Select business type</option>
                <option value="Sports Complex">Sports Complex</option>
                <option value="Gym/Fitness">Gym/Fitness Center</option>
                <option value="Stadium">Stadium</option>
                <option value="Court Rentals">Court Rentals</option>
                <option value="Swimming Pool">Swimming Pool</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Business Address</label>
              <textarea
                id="address"
                name="address"
                className="form-input"
                placeholder="Enter your business address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Creating Account...' : 'Register Business'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Already have a merchant account?{' '}
              <Link 
                to="/merchant/login" 
                style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
              >
                Sign in here
              </Link>
            </p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              <Link 
                to="/signup" 
                style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                ← Back to Customer Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default MerchantSignUp
