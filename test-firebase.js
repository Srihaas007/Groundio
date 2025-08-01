// Test Firebase Connection
import { auth } from './services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

console.log('Testing Firebase connection...');
console.log('Auth instance:', auth);
console.log('Firebase config loaded successfully');

// Test signup function
async function testSignup() {
  try {
    console.log('Attempting test signup...');
    const result = await createUserWithEmailAndPassword(auth, 'test@example.com', 'testpass123');
    console.log('Signup successful:', result);
  } catch (error) {
    console.error('Signup failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

// Uncomment to test (but don't leave uncommented in production)
// testSignup();
