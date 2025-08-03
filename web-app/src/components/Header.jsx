import { useState } from "react";
import { Search, Menu, User, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Groundio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/discover" className="text-gray-700 hover:text-blue-600 transition-colors">
              Discover
            </Link>
            <Link to="/book" className="text-gray-700 hover:text-blue-600 transition-colors">
              Book Now
            </Link>
            <Link to="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
              My Bookings
            </Link>
            <Link to="/list-venue" className="text-gray-700 hover:text-blue-600 transition-colors">
              List Venue
            </Link>
          </nav>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link to="/signin" className="hidden md:flex bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </Link>
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 p-4 bg-white rounded-lg shadow-lg border">
            <nav className="flex flex-col space-y-4">
              <Link to="/discover" className="text-gray-700 hover:text-blue-600 transition-colors">
                Discover
              </Link>
              <Link to="/book" className="text-gray-700 hover:text-blue-600 transition-colors">
                Book Now
              </Link>
              <Link to="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                My Bookings
              </Link>
              <Link to="/list-venue" className="text-gray-700 hover:text-blue-600 transition-colors">
                List Venue
              </Link>
              <hr className="border-gray-200" />
              <Link to="/signin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
