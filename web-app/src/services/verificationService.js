import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

class VerificationService {
  // Prevent abuse by limiting verification attempts
  static MAX_VERIFICATION_ATTEMPTS = 3;
  static VERIFICATION_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours
  static MAX_ACCOUNTS_PER_DEVICE = 2;
  static MAX_ACCOUNTS_PER_PHONE = 1;

  // Step 1: Email/SMS OTP Verification
  static async sendOTPVerification(contactInfo, verificationType = 'email') {
    try {
      // Check for abuse patterns first
      await this.checkForAbuse(contactInfo, verificationType);

      // Generate OTP
      const otp = this.generateOTP();
      const otpHash = await this.hashOTP(otp);
      
      // Store OTP with expiration (5 minutes)
      const otpData = {
        hash: otpHash,
        createdAt: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000),
        attempts: 0,
        verified: false,
        type: verificationType
      };

      if (verificationType === 'email') {
        await this.sendEmailOTP(contactInfo.email, otp);
        await setDoc(doc(db, 'email_verifications', contactInfo.email), otpData);
      } else if (verificationType === 'sms') {
        await this.sendSMSOTP(contactInfo.phone, otp);
        await setDoc(doc(db, 'sms_verifications', contactInfo.phone), otpData);
      }

      // Log verification attempt for abuse prevention
      await this.logVerificationAttempt(contactInfo, verificationType);

      return {
        success: true,
        message: `OTP sent to ${verificationType === 'email' ? contactInfo.email : contactInfo.phone}`,
        expiresIn: 5 * 60 * 1000 // 5 minutes
      };

    } catch (error) {
      console.error('OTP sending failed:', error);
      throw error;
    }
  }

  // Step 2: Verify OTP
  static async verifyOTP(contactInfo, userOTP, verificationType = 'email') {
    try {
      const collection_name = verificationType === 'email' ? 'email_verifications' : 'sms_verifications';
      const identifier = verificationType === 'email' ? contactInfo.email : contactInfo.phone;
      
      const docRef = doc(db, collection_name, identifier);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('No verification request found');
      }
      
      const data = docSnap.data();
      
      // Check if OTP has expired
      if (Date.now() > data.expiresAt) {
        throw new Error('OTP has expired. Please request a new one.');
      }
      
      // Check attempt limit
      if (data.attempts >= 3) {
        throw new Error('Too many failed attempts. Please request a new OTP.');
      }
      
      // Verify OTP
      const isValid = await this.verifyOTPHash(userOTP, data.hash);
      
      if (!isValid) {
        // Increment failed attempts
        await updateDoc(docRef, {
          attempts: data.attempts + 1
        });
        throw new Error('Invalid OTP');
      }
      
      // Mark as verified
      await updateDoc(docRef, {
        verified: true,
        verifiedAt: Date.now()
      });
      
      return {
        success: true,
        verified: true,
        message: `${verificationType.toUpperCase()} verified successfully`
      };
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  }

  // Step 3: Identity Document Verification
  static async uploadIdentityDocument(userId, documentType, documentFile, documentNumber = null) {
    try {
      // Validate file
      this.validateDocumentFile(documentFile);
      
      // Check if user has already uploaded this document type
      const existingDoc = await this.checkExistingDocument(userId, documentType);
      if (existingDoc && existingDoc.status === 'approved') {
        throw new Error('This document type has already been verified');
      }
      
      // Upload to Firebase Storage
      const fileName = `identity_documents/${userId}/${documentType}_${Date.now()}_${documentFile.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, documentFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Store document info in Firestore
      const documentData = {
        userId,
        documentType,
        documentNumber,
        fileURL: downloadURL,
        fileName: fileName,
        uploadedAt: Date.now(),
        status: 'pending_review',
        verifiedAt: null,
        verifiedBy: null,
        rejectionReason: null
      };
      
      const docRef = doc(collection(db, 'identity_documents'));
      await setDoc(docRef, documentData);
      
      return {
        success: true,
        documentId: docRef.id,
        message: 'Document uploaded successfully. Verification pending.',
        status: 'pending_review'
      };
      
    } catch (error) {
      console.error('Document upload failed:', error);
      throw error;
    }
  }

  // Step 4: Selfie Verification
  static async uploadSelfieVerification(userId, selfieFile) {
    try {
      // Validate selfie file
      this.validateSelfieFile(selfieFile);
      
      // Upload to Firebase Storage
      const fileName = `selfie_verification/${userId}/selfie_${Date.now()}_${selfieFile.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, selfieFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Store selfie info
      const selfieData = {
        userId,
        fileURL: downloadURL,
        fileName: fileName,
        uploadedAt: Date.now(),
        status: 'pending_review',
        verifiedAt: null,
        verifiedBy: null,
        rejectionReason: null
      };
      
      const docRef = doc(collection(db, 'selfie_verifications'));
      await setDoc(docRef, selfieData);
      
      return {
        success: true,
        selfieId: docRef.id,
        message: 'Selfie uploaded successfully. Verification pending.',
        status: 'pending_review'
      };
      
    } catch (error) {
      console.error('Selfie upload failed:', error);
      throw error;
    }
  }

  // Anti-Abuse Measures
  static async checkForAbuse(contactInfo, verificationType) {
    try {
      // Get device fingerprint
      const deviceFingerprint = this.getDeviceFingerprint();
      
      // Check rate limiting
      await this.checkRateLimit(contactInfo, verificationType);
      
      // Check device limits
      await this.checkDeviceLimits(deviceFingerprint);
      
      // Check phone number limits
      if (verificationType === 'sms' && contactInfo.phone) {
        await this.checkPhoneLimits(contactInfo.phone);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async checkRateLimit(contactInfo, verificationType) {
    const identifier = verificationType === 'email' ? contactInfo.email : contactInfo.phone;
    const logRef = collection(db, 'verification_logs');
    const q = query(
      logRef, 
      where('identifier', '==', identifier),
      where('type', '==', verificationType),
      where('timestamp', '>', Date.now() - this.VERIFICATION_COOLDOWN)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.size >= this.MAX_VERIFICATION_ATTEMPTS) {
      throw new Error('Too many verification attempts. Please try again later.');
    }
  }

  static async checkDeviceLimits(deviceFingerprint) {
    const logRef = collection(db, 'device_registrations');
    const q = query(logRef, where('deviceFingerprint', '==', deviceFingerprint));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.size >= this.MAX_ACCOUNTS_PER_DEVICE) {
      throw new Error('Maximum accounts per device exceeded.');
    }
  }

  static async checkPhoneLimits(phoneNumber) {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('phone', '==', phoneNumber));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.size >= this.MAX_ACCOUNTS_PER_PHONE) {
      throw new Error('This phone number is already registered.');
    }
  }

  static async logVerificationAttempt(contactInfo, verificationType) {
    const logData = {
      identifier: verificationType === 'email' ? contactInfo.email : contactInfo.phone,
      type: verificationType,
      timestamp: Date.now(),
      deviceFingerprint: this.getDeviceFingerprint(),
      ipAddress: await this.getIPAddress(),
      userAgent: navigator.userAgent
    };
    
    const logRef = doc(collection(db, 'verification_logs'));
    await setDoc(logRef, logData);
  }

  // Utility Functions
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async hashOTP(otp) {
    const encoder = new TextEncoder();
    const data = encoder.encode(otp + 'GROUNDIO_SALT_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async verifyOTPHash(otp, hash) {
    const newHash = await this.hashOTP(otp);
    return newHash === hash;
  }

  static getDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    return btoa(JSON.stringify({
      screen: screen.width + 'x' + screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      canvas: canvas.toDataURL(),
      userAgent: navigator.userAgent.substring(0, 100)
    }));
  }

  static async getIPAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  static validateDocumentFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG, or PDF files only.');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload files smaller than 5MB.');
    }
  }

  static validateSelfieFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 3 * 1024 * 1024; // 3MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG or PNG files only.');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload files smaller than 3MB.');
    }
  }

  static async checkExistingDocument(userId, documentType) {
    const docsRef = collection(db, 'identity_documents');
    const q = query(
      docsRef, 
      where('userId', '==', userId),
      where('documentType', '==', documentType)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }
    
    return null;
  }

  // Mock functions for OTP sending (replace with real services)
  static async sendEmailOTP(email, otp) {
    // In production, integrate with service like SendGrid, AWS SES, etc.
    console.log(`Sending OTP ${otp} to email: ${email}`);
    
    // For development, you can use a service like EmailJS
    // or integrate with your backend API
    return true;
  }

  static async sendSMSOTP(phone, otp) {
    // In production, integrate with service like Twilio, AWS SNS, etc.
    console.log(`Sending OTP ${otp} to phone: ${phone}`);
    
    // For development, you can use a service like Twilio
    // or integrate with your backend API
    return true;
  }
}

export default VerificationService;
