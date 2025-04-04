import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/Medicare logo.jpg";
import UserIcon from "../assets/user.png";
import { FiUser, FiLogOut, FiHome } from 'react-icons/fi';
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
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[1700px] flex justify-between items-center py-4 px-4 md:px-8 relative z-50"
    >
      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />

      {/* Mobile Controls */}
      <div className="md:hidden flex justify-between items-center w-full">
        {/* Mobile menu button */}
        <button 
          className="p-2 bg-white rounded-full shadow-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-8 h-8 text-[#252A61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Login/User */}
        {user ? (
          <div className="relative user-menu">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center border-2 border-[#252A61]"
            >
              <img
                src={UserIcon}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
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
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiHome className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
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
            className="h-[45px] flex items-center justify-center px-6 py-2 bg-[#252A61] text-white rounded-full text-base hover:bg-[#3b3b98] transition-all duration-300 hover:shadow-lg"
          >
            Login
          </Link>
        )}
      </div>

      {/* Desktop Navigation and Controls */}
      <div className="hidden md:flex items-center justify-between w-full">
        <img className="w-40 h-auto" src={Logo} alt="Logo" />
        <nav className="flex space-x-8 lg:space-x-12 text-base lg:text-lg font-[Montserrat Alternates] font-semibold">
          <Link to="/" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
            Home
          </Link>
          <Link to="/health-records" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
            Health Records
          </Link>
          <Link to="/upload" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
            Upload Reports
          </Link>
          <Link to="/about" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
            About Us
          </Link>
          <Link to="/dashboard" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
            Dashboard
          </Link>
        </nav>
        {user ? (
          <div className="relative user-menu">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-[60px] h-[60px] focus:outline-none"
            >
              <img
                src={UserIcon}
                alt="User Icon"
                className="w-full h-full rounded-full object-cover hover:ring-2 hover:ring-[#252A61] transition-all duration-300"
              />
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
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiHome className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
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
            className="w-[200px] h-[60px] flex items-center justify-center px-6 py-2 bg-[#252A61] text-white rounded-full text-xl hover:bg-[#3b3b98] transition-all duration-300 hover:shadow-lg"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-[80%] bg-white rounded-r-[30px] shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <img className="w-32 h-auto" src={Logo} alt="Logo" />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-8 h-8 text-[#252A61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4">
              <Link
                to="/"
                className="block py-3 text-lg font-semibold text-gray-800 hover:text-[#252A61]"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/health-records"
                className="block py-3 text-lg font-semibold text-gray-800 hover:text-[#252A61]"
                onClick={() => setIsMenuOpen(false)}
              >
                Health Records
              </Link>
              <Link
                to="/upload"
                className="block py-3 text-lg font-semibold text-gray-800 hover:text-[#252A61]"
                onClick={() => setIsMenuOpen(false)}
              >
                Upload Reports
              </Link>
              <Link
                to="/about"
                className="block py-3 text-lg font-semibold text-gray-800 hover:text-[#252A61]"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/dashboard"
                className="block py-3 text-lg font-semibold text-gray-800 hover:text-[#252A61]"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Navbar; 