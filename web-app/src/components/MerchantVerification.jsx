import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VerificationService from '../services/verificationService';
import LocationService from '../services/locationService';

const MerchantVerification = ({ venueData, onVerificationComplete }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Contact Verification
  const [contactData, setContactData] = useState({
    email: currentUser?.email || '',
    phone: '',
    verificationType: 'email'
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Step 2: Location Verification
  const [locationVerification, setLocationVerification] = useState(null);
  const [isAtVenue, setIsAtVenue] = useState(false);

  // Step 3: Identity Documents
  const [documents, setDocuments] = useState({
    panCard: null,
    aadharCard: null,
    selfie: null
  });
  const [documentNumbers, setDocumentNumbers] = useState({
    panNumber: '',
    aadharNumber: ''
  });

  // Step 1: Send OTP
  const sendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await VerificationService.sendOTPVerification(
        contactData,
        contactData.verificationType
      );
      
      setOtpSent(true);
      setSuccess(result.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify OTP
  const verifyOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await VerificationService.verifyOTP(
        contactData,
        otp,
        contactData.verificationType
      );
      
      if (result.verified) {
        setSuccess('Contact verified successfully!');
        setTimeout(() => {
          setStep(2);
          setSuccess('');
        }, 1500);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Location
  const verifyLocation = async () => {
    setLoading(true);
    setError('');
    
    try {
      const userLocation = await LocationService.getCurrentLocation();
      
      if (!venueData.location || !venueData.location.latitude) {
        throw new Error('Venue location not available for verification');
      }
      
      const verification = LocationService.verifyMerchantLocation(
        userLocation,
        venueData.location,
        0.5 // 500 meters tolerance
      );
      
      setLocationVerification(verification);
      setIsAtVenue(verification.isAtVenue);
      
      if (verification.isAtVenue) {
        setSuccess(`Location verified! You are ${(verification.distance * 1000).toFixed(0)}m from the venue.`);
        setTimeout(() => {
          setStep(3);
          setSuccess('');
        }, 2000);
      } else {
        setError(`You must be at the venue to verify your merchant account. You are ${verification.distance.toFixed(2)}km away.`);
      }
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Upload Documents
  const uploadDocument = async (documentType, file, documentNumber = null) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await VerificationService.uploadIdentityDocument(
        currentUser.uid,
        documentType,
        file,
        documentNumber
      );
      
      setSuccess(`${documentType} uploaded successfully!`);
      
      // Update documents state
      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload Selfie
  const uploadSelfie = async (file) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await VerificationService.uploadSelfieVerification(
        currentUser.uid,
        file
      );
      
      setSuccess('Selfie uploaded successfully!');
      setDocuments(prev => ({ ...prev, selfie: file }));
      
      // Check if all verification steps are complete
      if (documents.panCard && documents.aadharCard) {
        setTimeout(() => {
          onVerificationComplete && onVerificationComplete({
            contactVerified: true,
            locationVerified: isAtVenue,
            documentsUploaded: true,
            selfieUploaded: true
          });
        }, 1500);
      }
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="verification-step">
      <h3>Step 1: Verify Your Contact</h3>
      <p>We need to verify your contact information to prevent fake accounts.</p>
      
      <div className="contact-verification">
        <div className="verification-type-selector">
          <label>
            <input
              type="radio"
              name="verificationType"
              value="email"
              checked={contactData.verificationType === 'email'}
              onChange={(e) => setContactData(prev => ({ ...prev, verificationType: e.target.value }))}
            />
            Email Verification
          </label>
          <label>
            <input
              type="radio"
              name="verificationType"
              value="sms"
              checked={contactData.verificationType === 'sms'}
              onChange={(e) => setContactData(prev => ({ ...prev, verificationType: e.target.value }))}
            />
            SMS Verification
          </label>
        </div>
        
        {contactData.verificationType === 'email' ? (
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={contactData.email}
              onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
              className="form-input"
              disabled={currentUser?.email}
            />
          </div>
        ) : (
          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={contactData.phone}
              onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
              className="form-input"
            />
          </div>
        )}
        
        {!otpSent ? (
          <button 
            onClick={sendOTP} 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        ) : (
          <div className="otp-verification">
            <div className="input-group">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-input"
                maxLength={6}
              />
            </div>
            <div className="otp-actions">
              <button 
                onClick={verifyOTP} 
                disabled={loading || otp.length !== 6}
                className="btn btn-primary"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button 
                onClick={() => setOtpSent(false)} 
                className="btn btn-secondary"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="verification-step">
      <h3>Step 2: Verify Your Location</h3>
      <p>Confirm you are physically present at your venue to prevent fake listings.</p>
      
      <div className="location-verification">
        <div className="venue-info">
          <h4>{venueData.name}</h4>
          <p>📍 {venueData.location?.address || 'Address not provided'}</p>
        </div>
        
        <div className="location-check">
          <p>Click the button below to verify you are at the venue location.</p>
          <p className="warning">⚠️ You must be within 500 meters of the venue.</p>
          
          <button 
            onClick={verifyLocation} 
            disabled={loading}
            className="btn btn-primary location-verify-btn"
          >
            {loading ? 'Checking Location...' : '📍 Verify My Location'}
          </button>
          
          {locationVerification && (
            <div className={`location-result ${isAtVenue ? 'success' : 'error'}`}>
              {isAtVenue ? (
                <p>✅ Location verified! You are at the venue.</p>
              ) : (
                <p>❌ You are {locationVerification.distance.toFixed(2)}km from the venue. Please go to the venue location.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="verification-step">
      <h3>Step 3: Identity Verification</h3>
      <p>Upload your identity documents and a selfie to complete verification.</p>
      
      <div className="document-upload">
        <div className="document-section">
          <h4>PAN Card</h4>
          <div className="input-group">
            <label>PAN Number</label>
            <input
              type="text"
              placeholder="ABCDE1234F"
              value={documentNumbers.panNumber}
              onChange={(e) => setDocumentNumbers(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
              className="form-input"
              maxLength={10}
            />
          </div>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files[0]) {
                  uploadDocument('panCard', e.target.files[0], documentNumbers.panNumber);
                }
              }}
              className="file-input"
              id="pan-upload"
            />
            <label htmlFor="pan-upload" className="file-label">
              {documents.panCard ? '✅ PAN Card Uploaded' : '📄 Upload PAN Card'}
            </label>
          </div>
        </div>
        
        <div className="document-section">
          <h4>Aadhar Card</h4>
          <div className="input-group">
            <label>Aadhar Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012"
              value={documentNumbers.aadharNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                setDocumentNumbers(prev => ({ ...prev, aadharNumber: formatted }));
              }}
              className="form-input"
              maxLength={14}
            />
          </div>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files[0]) {
                  uploadDocument('aadharCard', e.target.files[0], documentNumbers.aadharNumber.replace(/\s/g, ''));
                }
              }}
              className="file-input"
              id="aadhar-upload"
            />
            <label htmlFor="aadhar-upload" className="file-label">
              {documents.aadharCard ? '✅ Aadhar Card Uploaded' : '📄 Upload Aadhar Card'}
            </label>
          </div>
        </div>
        
        <div className="document-section">
          <h4>Selfie Verification</h4>
          <p>Take a clear selfie holding your PAN card next to your face.</p>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => {
                if (e.target.files[0]) {
                  uploadSelfie(e.target.files[0]);
                }
              }}
              className="file-input"
              id="selfie-upload"
            />
            <label htmlFor="selfie-upload" className="file-label selfie-label">
              {documents.selfie ? '✅ Selfie Uploaded' : '🤳 Take Selfie'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="merchant-verification">
      <div className="verification-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <span>1</span> Contact
        </div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <span>2</span> Location
        </div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <span>3</span> Identity
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      
      <style jsx>{`
        .merchant-verification {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .verification-progress {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
          padding: 0 1rem;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .progress-step.active {
          color: #4f46e5;
        }
        
        .progress-step.completed {
          color: #10b981;
        }
        
        .progress-step span {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        
        .progress-step.active span {
          background: #4f46e5;
          color: white;
        }
        
        .progress-step.completed span {
          background: #10b981;
          color: white;
        }
        
        .verification-step h3 {
          color: #111827;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .verification-step p {
          color: #6b7280;
          margin-bottom: 2rem;
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
        
        .input-group {
          margin-bottom: 1rem;
        }
        
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-primary {
          background: #4f46e5;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #4338ca;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .file-input {
          display: none;
        }
        
        .file-label {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #f3f4f6;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        
        .file-label:hover {
          background: #e5e7eb;
          border-color: #4f46e5;
        }
        
        .document-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        
        .warning {
          color: #d97706;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .location-result {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 600;
        }
        
        .location-result.success {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
        
        .location-result.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
      `}</style>
    </div>
  );
};

export default MerchantVerification;
