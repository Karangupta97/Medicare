import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import usericon from "../assets/user.png";
import MedicareLogo from "../assets/Medicare logo 1.png"; // Import the Medicare logo
import {
  FiGrid,
  FiHome,
  FiFileText,
  FiUpload,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiArrowLeft,
  FiX,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import LogoutModal from "./LogoutModal";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Initialize from localStorage on component mount
    const stored = localStorage.getItem('sidebarCollapsed');
    return stored === 'true';
  });
  const location = useLocation();
  const { user, logout, refreshUserData } = useAuthStore();

  // Refresh user data on component mount to get the latest profile picture
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // When sidebar collapse state changes, save to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // When location changes, only close mobile sidebar
  useEffect(() => {
    if (window.innerWidth < 1024) { // lg breakpoint in Tailwind
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const menuItems = [
    { icon: FiGrid, label: "Dashboard", path: "/dashboard" },
    { icon: FiFileText, label: "Reports", path: "/reports" },
    { icon: FiUpload, label: "Upload", path: "/upload" },
    { icon: FiUser, label: "Profile", path: "/profile" },
    { icon: FiSettings, label: "Settings", path: "/settings" },
    { icon: FiHelpCircle, label: "Help", path: "/help" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu")) {
        setIsProfileOpen(false);
      }
      if (!event.target.closest(".notifications-menu")) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Click handler for sidebar menu items that doesn't change collapse state
  const handleMenuClick = () => {
    // Only close the mobile sidebar if it's open
    if (isSidebarOpen && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    // Do NOT change isSidebarCollapsed state here
  };
  
  // Profile picture with error handling
  const ProfilePicture = ({ className }) => {
    const [imgError, setImgError] = useState(false);
    
    // Reset error state if photoURL changes
    useEffect(() => {
      if (user?.photoURL) {
        setImgError(false);
      }
    }, [user?.photoURL]);
    
    return (
      <img
        src={imgError || !user?.photoURL ? usericon : user.photoURL}
        alt="Profile"
        className={className || "w-full h-full object-cover"}
        onError={() => setImgError(true)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
      {/* Sidebar - Updated for small/medium screens to respect top and bottom navbars */}
      <aside
        className={`fixed lg:top-1/2 lg:left-[0.2%] lg:transform lg:-translate-y-1/2 
          top-[3.5rem] sm:top-[4rem] left-0 h-[calc(100vh-3.5rem-4rem)] sm:h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem-4rem)] lg:h-[98vh] ${
          isSidebarCollapsed ? "w-16" : "w-[220px] sm:w-64"
        } bg-[#252A61] text-white transition-all duration-300 ease-in-out z-40 
          lg:rounded-[35px] rounded-r-[35px] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Logo Section - Reduced vertical padding for small screens */}
          <div className="flex items-center justify-between p-3 mb-2 sm:p-4 sm:mb-6 relative z-10">
            <Link to="/" className="flex items-center gap-2">
              {!isSidebarCollapsed && (
                <>
                  <FiArrowLeft className="w-5 h-5 text-white" /> {/* Left arrow */}
                  <img src={MedicareLogo} alt="Medicare Logo" className="w-24 sm:w-32" /> {/* Resized logo */}
                </>
              )}
            </Link>
            {/* Close Sidebar Button for Small and Medium Devices */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Navigation - Optimized spacing and text size for small screens */}
          <nav className="flex-1 px-2 sm:px-4 relative z-10 overflow-y-auto">
            <div className="mb-2 sm:mb-4 px-2">
              {!isSidebarCollapsed && (
                <p className="text-white/40 text-[10px] xs:text-xs md:text-sm lg:text-base uppercase font-semibold tracking-wider">Main Menu</p>
              )}
            </div>
            {menuItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMenuClick}
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center" : "space-x-3"
                } px-3 py-2 sm:px-4 sm:py-3 rounded-xl mb-1 sm:mb-2 transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-white/15 text-white font-medium backdrop-blur-sm shadow-sm"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <motion.div
                  animate={{
                    scale: location.pathname === item.path ? [1, 1.2, 1] : 1,
                    rotate: location.pathname === item.path ? [0, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> {/* Render the icon */}
                </motion.div>
                {!isSidebarCollapsed && <span className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Collapse Sidebar Option - Reduced bottom padding */}
          <div className="p-2 sm:p-4 relative z-10">
            <motion.button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center" : "justify-between"
              } space-x-3 px-3 py-2 sm:px-4 sm:py-3 w-full text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl 
                transition-all duration-200 border border-white/5 backdrop-blur-sm`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center space-x-3">
                <FiMenu className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                {!isSidebarCollapsed && <span className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg">Collapse Sidebar</span>}
              </div>
            </motion.button>
          </div>

          {/* Logout Button - with additional bottom margin for mobile */}
          <div className="p-2 sm:p-4 relative z-10 mt-0 sm:mt-auto mb-4 sm:mb-2">
            <motion.button
              onClick={() => setIsLogoutModalOpen(true)}
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center" : "justify-between"
              } space-x-3 px-3 py-2 sm:px-4 sm:py-3 w-full text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl 
                transition-all duration-200 border border-white/5 backdrop-blur-sm`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center space-x-3">
                <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                {!isSidebarCollapsed && <span className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg">Logout</span>}
              </div>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        {/* Header - Restored to original UI */}
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-row items-center justify-between p-4">
              {/* Left Section */}
              <div className="flex items-center w-full space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiMenu className="w-6 h-6" />
                </motion.button>

                {/* Enhanced Search Bar */}
                <div className="w-full max-w-5xl relative">
                  <motion.div
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 
                        rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 
                        focus:border-blue-300 dark:focus:border-blue-700 transition-all text-sm sm:text-base md:text-lg placeholder:text-gray-400 
                        dark:placeholder:text-gray-500 shadow-sm hover:shadow-md"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <div className="relative notifications-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl relative"
                  >
                    <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
                  </motion.button>
                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-[320px] bg-white dark:bg-gray-800 rounded-xl shadow-xl 
                          py-2 border border-gray-100 dark:border-gray-700 max-h-[80vh] overflow-y-auto"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                          <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">Notifications</h3>
                          <button className="text-xs md:text-sm text-blue-600 dark:text-blue-400">Mark all as read</button>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-2">
                          {/* Sample Notifications */}
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors mb-1">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                  <FiBell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-sm md:text-base text-gray-800 dark:text-gray-200">New notification example</p>
                                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Just now</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Profile - Updated with better image handling */}
                <div className="relative profile-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl group"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#252A61] to-[#4318FF] ring-2 ring-white/10 dark:ring-black/10">
                      <ProfilePicture />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 leading-tight">{user?.name || "User"}</p>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500 leading-tight">{user?.email || "user@example.com"}</p>
                    </div>
                    <FiChevronDown className="hidden sm:block w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
                  </motion.button>
                  
                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl 
                          py-2 border border-gray-100 dark:border-gray-700 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || "User"}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "user@example.com"}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FiUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FiSettings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                          className="flex items-center space-x-3 px-4 py-2.5 w-full text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 max-w-[2000px] mx-auto">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </div>
  );
};

export default DashboardLayout;