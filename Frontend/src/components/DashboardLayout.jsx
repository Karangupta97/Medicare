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
  
  // Profile picture with error handling and cache busting
  const ProfilePicture = ({ className }) => {
    const [imgError, setImgError] = useState(false);
    const [imgSrc, setImgSrc] = useState(usericon);
    
    useEffect(() => {
      // Reset error state and update image source when user data changes
      if (user?.photoURL) {
        setImgError(false);
        
        // Add a timestamp parameter to the URL to prevent caching if it's not already there
        if (!user.photoURL.includes('?')) {
          setImgSrc(`${user.photoURL}?t=${new Date().getTime()}`);
        } else {
          setImgSrc(user.photoURL);
        }
      } else {
        setImgSrc(usericon);
      }
    }, [user?.photoURL]);
    
    return (
      <img
        src={imgError ? usericon : imgSrc}
        alt="Profile"
        className={className || "w-full h-full object-cover"}
        onError={() => setImgError(true)}
      />
    );
  };

  // Adjust the sidebar layout for mobile devices
  const Sidebar = () => {
    return (
      <div className="w-full md:w-64 h-auto md:h-full bg-[#252a61] text-white flex flex-col">
        {/* Ensure the sidebar fits within the viewport for mobile devices */}
        <div className="flex flex-col items-center justify-center py-4">
          <img src="/logo.png" alt="Medicare Logo" className="w-16 h-16" />
          <h1 className="text-lg font-bold mt-2">Medicare</h1>
        </div>
        <nav className="flex flex-col space-y-2 px-4">
          {/* Add navigation links */}
          <a href="/dashboard" className="text-sm md:text-base py-2 px-3 rounded hover:bg-[#3b3b98]">Dashboard</a>
          <a href="/profile" className="text-sm md:text-base py-2 px-3 rounded hover:bg-[#3b3b98]">Profile</a>
          <a href="/reports" className="text-sm md:text-base py-2 px-3 rounded hover:bg-[#3b3b98]">Reports</a>
          <a href="/settings" className="text-sm md:text-base py-2 px-3 rounded hover:bg-[#3b3b98]">Settings</a>
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
      {/* Sidebar - Optimized with rounded corners and better icon arrangement */}
      <aside
        className={`fixed top-0 left-0 h-screen ${isSidebarCollapsed ? "w-16" : "w-[80%] max-w-xs lg:w-64"} bg-[#252A61] text-white z-50 transform transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 overflow-y-auto flex flex-col rounded-tr-2xl rounded-br-2xl shadow-xl`}
      >
        <div className="flex flex-col min-h-full">
          {/* Logo Section - increased logo size */}
          <div className="flex items-center justify-between p-2 sm:p-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={MedicareLogo} alt="Medicare Logo" className={`transition-all duration-300 ${isSidebarCollapsed ? "w-10 mx-auto" : "w-28 sm:w-32"}`} />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu - increased text size */}
          <nav className="flex-1 px-2 py-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMenuClick}
                className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center space-x-2"} px-2 py-2 rounded-lg transition-all duration-200 mb-3
                  ${location.pathname === item.path ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              >
                <item.icon className={`${isSidebarCollapsed ? "w-7 h-7" : "w-6 h-6"}`} />
                {!isSidebarCollapsed && <span className="text-base md:text-lg font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Footer Section - increased text size and icon size */}
          <div className="p-2 mb-2">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center"} w-full px-2 py-2 text-base text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors mb-3`}
            >
              <FiMenu className={`${isSidebarCollapsed ? "w-7 h-7" : "w-6 h-6"}`} />
              {!isSidebarCollapsed && <span className="ml-2">Collapse</span>}
            </button>

            {/* Logout Option - consistent with other elements */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center"} w-full px-2 py-2 text-base text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors`}
            >
              <FiLogOut className={`${isSidebarCollapsed ? "w-7 h-7" : "w-6 h-6"}`} />
              {!isSidebarCollapsed && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Add proper margin to prevent content from going under sidebar */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        {/* Header - Sticky position */}
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
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

        {/* Scrollable Page Content */}
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