import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/Medicare logo.jpg";
import UserIcon from "../assets/user.png";
import { FiUser, FiLogOut, FiHome, FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from "../store/authStore";
import LogoutModal from "./LogoutModal";

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout function from auth store and wait for it to complete
      await logout();
      
      // Call the onLogout prop if provided
      if (onLogout) {
        onLogout();
      }
      
      // Close the menu
      setIsUserMenuOpen(false);
      
      // Navigate to home page
      navigate('/');
      
      // Force a page reload to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Show error message to user
      alert('Failed to logout. Please try again.');
    }
  };

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    handleLogout();
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[1700px] flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 lg:px-8 relative z-50"
    >
      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />

      {/* Mobile Controls */}
      <div className="flex justify-between items-center w-full lg:hidden">
        <Link to="/" className="flex items-center">
          <img className="w-24 sm:w-32 h-auto" src={Logo} alt="Logo" />
        </Link>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#252A61]"
                >
                  <img
                    src={user.photoURL || UserIcon}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>
              </div>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 bg-white rounded-full shadow-md"
              >
                <svg className="w-6 h-6 text-[#252A61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-[#252A61] text-white rounded-full text-sm sm:text-base hover:bg-[#3b3b98] transition-all duration-300 hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-between w-full">
        <Link to="/" className="flex items-center">
          <img className="w-40 h-auto" src={Logo} alt="Logo" />
        </Link>
        
        <nav className="flex space-x-6 xl:space-x-8 text-base xl:text-lg font-[Montserrat Alternates] font-semibold">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/health-records" className="nav-link">Health Records</Link>
          <Link to="/upload" className="nav-link">Upload Reports</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </nav>

        {user ? (
          <div className="relative user-menu">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-1.5 hover:bg-gray-50 rounded-xl group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#252A61] to-[#4318FF]">
                <img
                  src={user.photoURL || UserIcon}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
            </button>
            
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email || 'user@example.com'}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="menu-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="menu-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiHome className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="menu-item text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-8 py-3 bg-[#252A61] text-white rounded-full text-lg hover:bg-[#3b3b98] transition-all duration-300 hover:shadow-lg"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <img className="w-32 h-auto" src={Logo} alt="Logo" />
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-6 h-6 text-[#252A61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="p-4 space-y-2">
                <Link to="/" className="mobile-nav-link">Home</Link>
                <Link to="/health-records" className="mobile-nav-link">Health Records</Link>
                <Link to="/upload" className="mobile-nav-link">Upload Reports</Link>
                <Link to="/about" className="mobile-nav-link">About Us</Link>
                <Link to="/dashboard" className="mobile-nav-link">Dashboard</Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;