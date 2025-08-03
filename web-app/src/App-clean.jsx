import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Context
import { VenueProvider } from './contexts/VenueContext'

// Components
import Layout from './components/Layout'
import PWAInstallButton from './components/PWAInstallButton'

// Pages
import Home from './pages/Home'
import Search from './pages/Search'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import MerchantLogin from './pages/MerchantLogin'
import MerchantSignUp from './pages/MerchantSignUp'
import MerchantDashboard from './pages/MerchantDashboard'

function App() {
  const [user, setUser] = useState(null)

  return (
    <VenueProvider>
      <Router>
        <Layout user={user} setUser={setUser}>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            
            {/* Merchant Routes */}
            <Route path="/merchant/login" element={<MerchantLogin setUser={setUser} />} />
            <Route path="/merchant/signup" element={<MerchantSignUp setUser={setUser} />} />
            <Route path="/merchant/dashboard" element={<MerchantDashboard user={user} />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <PWAInstallButton />
        </Layout>
      </Router>
    </VenueProvider>
  )
}

export default App
