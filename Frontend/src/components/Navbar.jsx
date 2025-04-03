import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../assets/Medicare logo.jpg";
import UserIcon from "../assets/user.png";

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[1700px] flex justify-between items-center py-4 px-4 md:px-8"
    >
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
          <div className="relative">
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
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-semibold text-gray-800">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user.email || 'user@example.com'}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
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
          <Link to="/upload-reports" className="text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg">
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
          <div className="relative">
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
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-semibold text-gray-800">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user.email || 'user@example.com'}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
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
            <nav className="flex flex-col space-y-4 p-6">
              <Link to="/" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </Link>
              <Link to="/health-records" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Health Records</span>
              </Link>
              <Link to="/upload-reports" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload Reports</span>
              </Link>
              <Link to="/about" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About Us</span>
              </Link>
              <Link to="/dashboard" className="text-[#252A61] text-xl font-medium hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-2 flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Navbar; 