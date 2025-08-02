// test-auth.js - Simple authentication test
const { authHelpers } = require('./services/firebase');

async function testAuth() {
  console.log('Testing Firebase Authentication...');
  
  try {
    // Test sign up
    console.log('Testing sign up...');
    const result = await authHelpers.signUpWithEmail('test@example.com', 'password123');
    
    if (result.success) {
      console.log('✅ Sign up successful');
      console.log('User:', result.user?.email);
    } else {
      console.log('❌ Sign up failed:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Authentication test failed:', error.message);
  }
}

testAuth();
