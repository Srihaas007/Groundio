import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './globals.css'

// Context
import { VenueProvider } from './contexts/SimpleVenueContext'
import { AuthProvider } from './contexts/AuthContext'

// Components
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Search from './pages/Search'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Discover from './pages/Discover'
import BookNow from './pages/BookNow'
import MyBookings from './pages/MyBookings'
import ListVenue from './pages/ListVenue'

function App() {
  return (
    <AuthProvider>
      <VenueProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Header />
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/book" element={<BookNow />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/list-venue" element={<ListVenue />} />
              
              {/* Auth Routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Legacy Routes */}
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Navigate to="/signin" replace />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </VenueProvider>
    </AuthProvider>
  )
}

export default App
