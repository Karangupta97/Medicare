import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/Medicare logo.jpg";
import UserIcon from "../assets/user.png";
import { FiUser, FiLogOut, FiHome, FiChevronDown, FiUpload, FiInfo, FiFileText, FiPlus, FiSettings, FiBell } from 'react-icons/fi';
import { useAuthStore } from "../store/authStore";
import LogoutModal from "./LogoutModal";
import axios from "axios";

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, refreshUserData, token } = useAuthStore();
  const authUser = useAuthStore((state) => state.user) || user;
  
  // Refresh user data to get fresh profile picture when component mounts
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadNotificationCount = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get('/api/notifications?limit=1', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.unreadCount !== undefined) {
          setUnreadNotifications(response.data.unreadCount);
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };
    
    fetchUnreadNotificationCount();
    
    // Set up WebSocket listener for real-time notification updates
    if (window.socket && token) {
      window.socket.on('notification', (notification) => {
        // Ignore "Connection Established" notifications
        if (notification.title !== 'Connection Established') {
          fetchUnreadNotificationCount();
        }
      });
    }
    
    return () => {
      if (window.socket) {
        window.socket.off('notification');
      }
    };
  }, [token, location.pathname]);

  // Profile picture component with error handling and cache busting
  const ProfilePicture = ({ className }) => {
    const [imgError, setImgError] = useState(false);
    const [imgSrc, setImgSrc] = useState(UserIcon);
    
    useEffect(() => {
      // Reset error state and update image source when user data changes
      if (authUser?.photoURL) {
        setImgError(false);
        
        // Add a timestamp parameter to the URL to prevent caching if it's not already there
        if (!authUser.photoURL.includes('?')) {
          setImgSrc(`${authUser.photoURL}?t=${new Date().getTime()}`);
        } else {
          setImgSrc(authUser.photoURL);
        }
      } else {
        setImgSrc(UserIcon);
      }
    }, [authUser?.photoURL]);
    
    return (
      <img
        src={imgError ? UserIcon : imgSrc}
        alt="User"
        className={className || "w-full h-full object-cover"}
        onError={() => setImgError(true)}
      />
    );
  };

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
  
  // Close user menu when route changes
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

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

  // Check if path is active for bottom navigation
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[1700px] flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 lg:px-8 relative z-40"
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
            {authUser ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#252A61]"
                >
                  <ProfilePicture className="w-8 h-8 rounded-full object-cover" />
                </button>
                
                {/* Mobile Profile Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-xl 
                        py-2 border border-gray-100 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{authUser?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{authUser?.email || 'user@example.com'}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiHome className="w-4 h-4 text-gray-500" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings className="w-4 h-4 text-gray-500" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiBell className="w-4 h-4 text-gray-500" />
                        <span>Notifications</span>
                        {unreadNotifications > 0 && (
                          <span className="ml-auto bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                            {unreadNotifications}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center space-x-3 px-4 py-2.5 w-full text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
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

          {authUser ? (
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <Link to="/notifications" className="relative p-2 hover:bg-gray-50 rounded-xl">
                <FiBell className="w-6 h-6 text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>
              
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-1.5 hover:bg-gray-50 rounded-xl group"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#252A61] to-[#4318FF]">
                    <ProfilePicture />
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
                        <p className="text-sm font-medium text-gray-900">{authUser?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{authUser?.email || 'user@example.com'}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiHome className="w-4 h-4 text-gray-500" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiBell className="w-4 h-4 text-gray-500" />
                        <span>Notifications</span>
                        {unreadNotifications > 0 && (
                          <span className="ml-auto bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                            {unreadNotifications}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings className="w-4 h-4 text-gray-500" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center space-x-3 px-4 py-2.5 w-full text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                  <Link to="/profile" className="mobile-nav-link">Profile</Link>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Bottom Navigation for Mobile and Medium Devices */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <nav className="flex justify-between items-center h-16 px-2 relative">
            {/* Home Button */}
            <Link 
              to="/" 
              className={`flex flex-col items-center justify-center w-1/5 h-full relative ${
                isActive('/') 
                  ? 'text-[#252A61]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive('/') && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 w-1/2 h-1 bg-[#252A61] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <FiHome className={`w-5 h-5 mb-1 transition-all ${isActive('/') ? 'w-5.5 h-5.5' : ''}`} />
              <span className={`text-xs font-medium transition-all ${isActive('/') ? 'opacity-100' : 'opacity-80'}`}>Home</span>
            </Link>
            
            {/* Health Records Button */}
            <Link 
              to="/health-records" 
              className={`flex flex-col items-center justify-center w-1/5 h-full relative ${
                isActive('/health-records') 
                  ? 'text-[#252A61]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive('/health-records') && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 w-1/2 h-1 bg-[#252A61] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <FiFileText className={`w-5 h-5 mb-1 transition-all ${isActive('/health-records') ? 'w-5.5 h-5.5' : ''}`} />
              <span className={`text-xs font-medium transition-all ${isActive('/health-records') ? 'opacity-100' : 'opacity-80'}`}>Records</span>
            </Link>
            
            {/* Upload Button - Enhanced */}
            <Link 
              to="/upload" 
              className="relative flex flex-col items-center -mt-5"
            >
              <div className={`w-14 h-14 rounded-full ${isActive('/upload') ? 'bg-[#252A61]' : 'bg-[#3b3b98]'} flex items-center justify-center shadow-lg border-4 border-white transition-all duration-300 hover:shadow-xl`}>
                <FiPlus className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xs font-medium mt-0.5 ${isActive('/upload') ? 'text-[#252A61]' : 'text-gray-500'}`}>Upload</span>
            </Link>
            
            {/* About Button */}
            <Link 
              to="/about" 
              className={`flex flex-col items-center justify-center w-1/5 h-full relative ${
                isActive('/about') 
                  ? 'text-[#252A61]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive('/about') && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 w-1/2 h-1 bg-[#252A61] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <FiInfo className={`w-5 h-5 mb-1 transition-all ${isActive('/about') ? 'w-5.5 h-5.5' : ''}`} />
              <span className={`text-xs font-medium transition-all ${isActive('/about') ? 'opacity-100' : 'opacity-80'}`}>About</span>
            </Link>
            
            {/* Profile Button */}
            <Link 
              to="/profile" 
              className={`flex flex-col items-center justify-center w-1/5 h-full relative ${
                isActive('/dashboard') 
                  ? 'text-[#252A61]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive('/dashboard') && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 w-1/2 h-1 bg-[#252A61] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <FiUser className={`w-5 h-5 mb-1 transition-all ${isActive('/dashboard') ? 'w-5.5 h-5.5' : ''}`} />
              <span className={`text-xs font-medium transition-all ${isActive('/dashboard') ? 'opacity-100' : 'opacity-80'}`}>Profile</span>
            </Link>
          </nav>
        </div>
        
        {/* Add glass effect for iOS feel */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm -z-10"></div>
      </div>
      
      {/* Add padding to the bottom of the page content to account for the bottom nav bar */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Navbar;