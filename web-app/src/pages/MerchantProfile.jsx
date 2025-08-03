import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MerchantVerification from '../components/MerchantVerification';

const MerchantProfile = () => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Verification
  const [venueData, setVenueData] = useState({
    name: '',
    description: '',
    category: '',
    amenities: [],
    capacity: '',
    pricePerHour: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      latitude: null,
      longitude: null
    },
    images: [],
    contactInfo: {
      phone: '',
      email: currentUser?.email || '',
      website: ''
    },
    operatingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '22:00', closed: false },
      sunday: { open: '09:00', close: '22:00', closed: false }
    }
  });
  
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const venueCategories = [
    'Sports Complex',
    'Wedding Hall',
    'Conference Center',
    'Restaurant',
    'Banquet Hall',
    'Garden/Outdoor',
    'Hotel',
    'Community Center',
    'Corporate Office',
    'Entertainment Venue',
    'Other'
  ];

  const amenitiesList = [
    'Parking',
    'Wi-Fi',
    'Air Conditioning',
    'Sound System',
    'Projector/Screen',
    'Catering',
    'Bar/Alcohol Service',
    'Dance Floor',
    'Stage',
    'Security',
    'Wheelchair Accessible',
    'Photography/Videography',
    'Decoration Services',
    'Valet Parking'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setVenueData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setVenueData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setVenueData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setVenueData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const validateBasicInfo = () => {
    const required = ['name', 'description', 'category', 'capacity', 'pricePerHour'];
    const missing = required.filter(field => !venueData[field]);
    
    if (missing.length > 0) {
      setError(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }
    
    if (!venueData.location.address || !venueData.location.city) {
      setError('Please provide complete venue address');
      return false;
    }
    
    if (venueData.amenities.length === 0) {
      setError('Please select at least one amenity');
      return false;
    }
    
    return true;
  };

  const saveBasicInfo = async () => {
    if (!validateBasicInfo()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Here you would save to Firebase
      // await saveVenueBasicInfo(currentUser.uid, venueData);
      console.log('Saving venue data:', venueData);
      
      setSuccess('Basic information saved successfully!');
      setTimeout(() => {
        setStep(2);
        setSuccess('');
      }, 1500);
      
    } catch (error) {
      setError('Failed to save venue information. Please try again.');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = async (verificationData) => {
    setLoading(true);
    
    try {
      // Save complete merchant profile with verification status
      const completeProfile = {
        ...venueData,
        verification: verificationData,
        merchantId: currentUser.uid,
        status: 'pending_review',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Complete merchant profile:', completeProfile);
      
      setIsVerificationComplete(true);
      setSuccess('Merchant verification completed! Your profile is under review.');
      
    } catch (error) {
      setError('Failed to complete verification. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isVerificationComplete) {
    return (
      <div className="verification-complete">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Verification Complete!</h2>
          <p>Your merchant profile has been submitted for review. We'll notify you once it's approved.</p>
          <div className="next-steps">
            <h3>What happens next?</h3>
            <ul>
              <li>Our team will review your documents (1-2 business days)</li>
              <li>You'll receive an email notification about approval status</li>
              <li>Once approved, your venue will be live on Groundio</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="merchant-profile">
      <div className="profile-header">
        <h1>Create Your Merchant Profile</h1>
        <p>Join Groundio as a verified venue provider</p>
      </div>

      {step === 1 && (
        <div className="basic-info-form">
          <h2>Step 1: Venue Information</h2>
          
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <div className="form-section">
            <h3>Basic Details</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Venue Name *</label>
                <input
                  type="text"
                  value={venueData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                  placeholder="e.g. Grand Palace Wedding Hall"
                />
              </div>
              
              <div className="input-group">
                <label>Category *</label>
                <select
                  value={venueData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  {venueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label>Capacity (people) *</label>
                <input
                  type="number"
                  value={venueData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="form-input"
                  placeholder="e.g. 200"
                />
              </div>
              
              <div className="input-group">
                <label>Price per Hour (₹) *</label>
                <input
                  type="number"
                  value={venueData.pricePerHour}
                  onChange={(e) => handleInputChange('pricePerHour', e.target.value)}
                  className="form-input"
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Description *</label>
              <textarea
                value={venueData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                rows={4}
                placeholder="Describe your venue, its features, and what makes it special..."
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Location</h3>
            <div className="form-grid">
              <div className="input-group full-width">
                <label>Full Address *</label>
                <input
                  type="text"
                  value={venueData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  className="form-input"
                  placeholder="e.g. 123 Main Street, Sector 15"
                />
              </div>
              
              <div className="input-group">
                <label>City *</label>
                <input
                  type="text"
                  value={venueData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  className="form-input"
                  placeholder="e.g. Mumbai"
                />
              </div>
              
              <div className="input-group">
                <label>State</label>
                <input
                  type="text"
                  value={venueData.location.state}
                  onChange={(e) => handleInputChange('location.state', e.target.value)}
                  className="form-input"
                  placeholder="e.g. Maharashtra"
                />
              </div>
              
              <div className="input-group">
                <label>PIN Code</label>
                <input
                  type="text"
                  value={venueData.location.pincode}
                  onChange={(e) => handleInputChange('location.pincode', e.target.value)}
                  className="form-input"
                  placeholder="e.g. 400001"
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Amenities & Services</h3>
            <div className="amenities-grid">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={venueData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={venueData.contactInfo.phone}
                  onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                  className="form-input"
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={venueData.contactInfo.email}
                  onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                  className="form-input"
                  placeholder="venue@example.com"
                />
              </div>
              
              <div className="input-group">
                <label>Website (Optional)</label>
                <input
                  type="url"
                  value={venueData.contactInfo.website}
                  onChange={(e) => handleInputChange('contactInfo.website', e.target.value)}
                  className="form-input"
                  placeholder="https://yourvenue.com"
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              onClick={saveBasicInfo}
              disabled={loading}
              className="btn btn-primary btn-large"
            >
              {loading ? 'Saving...' : 'Save & Continue to Verification'}
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <MerchantVerification 
          venueData={venueData}
          onVerificationComplete={handleVerificationComplete}
        />
      )}
      
      <style jsx>{`
        .merchant-profile {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
        }
        
        .profile-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .profile-header h1 {
          color: #111827;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .profile-header p {
          color: #6b7280;
          font-size: 1.125rem;
        }
        
        .basic-info-form h2 {
          color: #111827;
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }
        
        .form-section {
          margin-bottom: 3rem;
          padding: 2rem;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fafafa;
        }
        
        .form-section h3 {
          color: #374151;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .input-group {
          margin-bottom: 1rem;
        }
        
        .input-group.full-width {
          grid-column: 1 / -1;
        }
        
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .amenity-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .amenity-checkbox:hover {
          background: #f3f4f6;
          border-color: #4f46e5;
        }
        
        .amenity-checkbox input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
        }
        
        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .alert-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        
        .alert-success {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
        
        .form-actions {
          text-align: center;
          margin-top: 3rem;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background: #4f46e5;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #4338ca;
        }
        
        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .verification-complete {
          text-align: center;
          padding: 3rem;
        }
        
        .success-message {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .verification-complete h2 {
          color: #111827;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .verification-complete p {
          color: #6b7280;
          font-size: 1.125rem;
          margin-bottom: 2rem;
        }
        
        .next-steps {
          text-align: left;
          background: #f9fafb;
          padding: 2rem;
          border-radius: 12px;
          margin-top: 2rem;
        }
        
        .next-steps h3 {
          color: #374151;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .next-steps ul {
          color: #4b5563;
          line-height: 1.6;
        }
        
        .next-steps li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default MerchantProfile;
