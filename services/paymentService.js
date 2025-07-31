// services/paymentService.js
import { Alert } from 'react-native';

// In a production app, you would never store API keys in the client
// These should come from environment variables or a secure backend
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key_here';
const PAYMENT_SERVER_URL = 'https://your-backend-server.com/api';

class PaymentService {
  constructor() {
    this.stripe = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // For web platform
      if (typeof window !== 'undefined') {
        if (!window.Stripe) {
          // Dynamically load Stripe.js
          const script = document.createElement('script');
          script.src = 'https://js.stripe.com/v3/';
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }
        this.stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      throw new Error('Payment system initialization failed');
    }
  }

  async createPaymentIntent(amount, currency = 'inr', metadata = {}) {
    try {
      const response = await fetch(`${PAYMENT_SERVER_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to smallest currency unit
          currency,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async processPayment(paymentData) {
    try {
      await this.initialize();

      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      // Create payment intent
      const { clientSecret } = await this.createPaymentIntent(
        paymentData.amount,
        'inr',
        {
          bookingId: paymentData.bookingId,
          venueId: paymentData.venueId,
          userId: paymentData.userId,
        }
      );

      // For web platform
      if (typeof window !== 'undefined') {
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: paymentData.cardElement,
            billing_details: {
              name: paymentData.billingDetails.name,
              email: paymentData.billingDetails.email,
            },
          },
        });

        if (error) {
          throw error;
        }

        return paymentIntent;
      }

      // For mobile platforms, you would use @stripe/stripe-react-native
      // This is a simplified version - implement proper mobile payment flow
      return await this.processMobilePayment(clientSecret, paymentData);

    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  async processMobilePayment(clientSecret, paymentData) {
    // This is where you would integrate with @stripe/stripe-react-native
    // For now, we'll simulate a successful payment
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate payment processing
        const success = Math.random() > 0.1; // 90% success rate for demo
        
        if (success) {
          resolve({
            id: 'pi_' + Math.random().toString(36).substr(2, 9),
            status: 'succeeded',
            amount: paymentData.amount * 100,
            currency: 'inr',
          });
        } else {
          reject(new Error('Payment failed. Please try again.'));
        }
      }, 2000);
    });
  }

  async refundPayment(paymentIntentId, amount) {
    try {
      const response = await fetch(`${PAYMENT_SERVER_URL}/refund-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount: amount ? Math.round(amount * 100) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Refund processing error:', error);
      throw error;
    }
  }

  formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Validate card number (basic Luhn algorithm)
  validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cleanNumber)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // Validate expiry date
  validateExpiryDate(month, year) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return month >= 1 && month <= 12;
  }

  // Validate CVV
  validateCVV(cvv, cardType = 'visa') {
    const length = cardType === 'amex' ? 4 : 3;
    return /^\d+$/.test(cvv) && cvv.length === length;
  }

  // Get card type from number
  getCardType(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6/.test(cleanNumber)) return 'discover';
    
    return 'unknown';
  }

  // Handle payment errors
  handlePaymentError(error) {
    let message = 'Payment failed. Please try again.';
    
    switch (error.code) {
      case 'card_declined':
        message = 'Your card was declined. Please try a different card.';
        break;
      case 'insufficient_funds':
        message = 'Insufficient funds. Please try a different card.';
        break;
      case 'expired_card':
        message = 'Your card has expired. Please try a different card.';
        break;
      case 'incorrect_cvc':
        message = 'Your card\'s security code is incorrect.';
        break;
      case 'processing_error':
        message = 'An error occurred while processing your card. Please try again.';
        break;
      case 'incorrect_number':
        message = 'Your card number is incorrect.';
        break;
      default:
        message = error.message || message;
    }
    
    Alert.alert('Payment Error', message);
    return message;
  }
}

export default new PaymentService();
