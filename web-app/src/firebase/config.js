// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyAywh8aCXNZ1uVn08IkWOIF9FxPsX9bIK8",
  authDomain: "groundio-2d809.firebaseapp.com",
  projectId: "groundio-2d809",
  storageBucket: "groundio-2d809.firebasestorage.app",
  messagingSenderId: "1070979314500",
  appId: "1:1070979314500:web:f1c1427ad27c15e77ddd11",
  measurementId: "G-CSBBPKPG67"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const analytics = getAnalytics(app)

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export default app
