import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        // Load user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setUserProfile(userDoc.data())
          }
        } catch (err) {
          console.error('Error loading user profile:', err)
        }
      } else {
        setCurrentUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email, password, userData = {}) => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user

      // Update display name
      if (userData.name) {
        await updateProfile(user, { displayName: userData.name })
      }

      // Save additional user data to Firestore
      const userProfileData = {
        uid: user.uid,
        email: user.email,
        name: userData.name || '',
        userType: userData.userType || 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await setDoc(doc(db, 'users', user.uid), userProfileData)
      setUserProfile(userProfileData)

      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await signInWithEmailAndPassword(auth, email.trim(), password)
      
      // Load user profile
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (userDoc.exists()) {
        setUserProfile(userDoc.data())
      }

      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (!userDoc.exists()) {
        // Create new user profile for Google sign-in
        const userProfileData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          photoURL: user.photoURL || '',
          userType: 'customer',
          provider: 'google',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        await setDoc(doc(db, 'users', user.uid), userProfileData)
        setUserProfile(userProfileData)
      } else {
        setUserProfile(userDoc.data())
      }

      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setCurrentUser(null)
      setUserProfile(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in')
      
      setError(null)
      const updatedData = {
        ...userProfile,
        ...updates,
        updatedAt: new Date()
      }

      await setDoc(doc(db, 'users', currentUser.uid), updatedData, { merge: true })
      setUserProfile(updatedData)

      // Update Firebase Auth profile if name changed
      if (updates.name && updates.name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: updates.name })
      }

      return updatedData
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    clearError: () => setError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
