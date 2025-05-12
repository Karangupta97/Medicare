import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import usericon from "../../assets/user.png";
import MedicareLogo from "../../assets/Medicare logo 1.png"; // Import the Medicare logo
import HandLogo from "../../assets/hand logo.png"; // Import the hand logo
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
  FiCalendar,
  FiClipboard,
  FiInfo,
  FiMoon,
  FiSun,
  FiChevronRight,
  FiPlusCircle,
  FiMessageCircle,
  FiShield,
  FiActivity,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import LogoutModal from "../../components/User/LogoutModal";
import axios from "axios";

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
  const [refreshError, setRefreshError] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const stored = localStorage.getItem('darkTheme');
    return stored === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [digitalPrescriptionCount, setDigitalPrescriptionCount] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, refreshUserData, isAuthenticated } = useAuthStore();
  const tooltipTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Clean up tooltip timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Theme toggle effect
  useEffect(() => {
    localStorage.setItem('darkTheme', isDarkTheme);
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Fetch digital prescriptions count
  useEffect(() => {
    const fetchDigitalPrescriptions = async () => {
      if (user?._id) {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const response = await axios.get(`${baseUrl}/api/user/digital-prescriptions/count`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.data.success) {
            setDigitalPrescriptionCount(response.data.count);
          } else {
            console.error("Failed to fetch prescription count:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching digital prescription count:", error);
        }
      }
    };
    
    if (isAuthenticated) {
      fetchDigitalPrescriptions();
    }
  }, [user?._id, isAuthenticated, location.pathname]);

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (user?._id) {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const response = await axios.get(`${baseUrl}/api/notifications/unread-count`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.data.success) {
            setNotificationCount(response.data.count);
          } else {
            console.error("Failed to fetch notification count:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching notification count:", error);
        }
      }
    };
    
    if (isAuthenticated) {
      fetchNotificationCount();
    }
  }, [user?._id, isAuthenticated, location.pathname]);

  // Mock fetch notifications count - in a real app, this would come from an API
  useEffect(() => {
    // Simulate fetching notifications count
    const randomCount = Math.floor(Math.random() * 10);
    setNotificationCount(randomCount);
  }, []);

  // Refresh user data on component mount with error handling
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await refreshUserData();
        setRefreshError(false);
      } catch (error) {
        console.error("Error refreshing user data:", error);
        setRefreshError(true);
        
        // If we get a 404 and the user is supposedly authenticated,
        // there might be an invalid session - auto logout after 3 seconds
        if (error?.response?.status === 404 && isAuthenticated) {
          console.log("User data not found, scheduling auto-logout");
          const timer = setTimeout(() => {
            logout();
          }, 3000);
          
          return () => clearTimeout(timer);
        }
      }
    };
    
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [refreshUserData, isAuthenticated, logout]);

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

  // Add event listener for sidebar toggle from Dashboard
  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsSidebarOpen(true);
    };
    
    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, []);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu")) {
        setIsProfileOpen(false);
      }
      if (!event.target.closest(".notifications-menu")) {
        setIsNotificationsOpen(false);
      }
      if (showSearch && !event.target.closest(".search-container")) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  // Organized menu items by category
  const menuCategories = [
    { 
      title: "Main",
      items: [
        { 
          icon: FiGrid, 
          label: "Dashboard", 
          path: "/dashboard", 
          description: "View your health overview",
          badge: null
        },
        { 
          icon: FiCalendar, 
          label: "Appointments", 
          path: "/appointments", 
          description: "Manage your appointments",
          badge: { text: "SOON", color: "bg-purple-500" }
        },
        { 
          icon: FiActivity, 
          label: "Health Stats", 
          path: "/health-stats", 
          description: "Check your vital statistics",
          badge: { text: "SOON", color: "bg-purple-500" }
        }
      ]
    },
    { 
      title: "Health Records",
      items: [
        { 
          icon: FiFileText, 
          label: "Reports", 
          path: "/reports", 
          description: "View your medical reports",
          badge: null 
        },
        { 
          icon: FiUpload, 
          label: "Upload", 
          path: "/upload", 
          description: "Upload medical documents",
          badge: null 
        },
        { 
          icon: FiClipboard, 
          label: "Digital Prescriptions", 
          path: "/digital-prescriptions", 
          description: "View digital prescriptions",
          badge: { count: digitalPrescriptionCount, color: "bg-indigo-500" } 
        },
        { 
          icon: FiMessageCircle, 
          label: "Consultations", 
          path: "/consultations", 
          description: "Online doctor consultations",
          badge: { text: "SOON", color: "bg-purple-500" } 
        }
      ]
    },
    { 
      title: "Account",
      items: [
        { 
          icon: FiUser, 
          label: "Profile", 
          path: "/profile", 
          description: "Manage your profile",
          badge: null 
        },
        { 
          icon: FiBell, 
          label: "Notifications", 
          path: "/notifications", 
          description: "Check your notifications",
          badge: { count: notificationCount, color: "bg-yellow-500", hideWhenZero: false } 
        },
        { 
          icon: FiSettings, 
          label: "Settings", 
          path: "/settings", 
          description: "Customize settings",
          badge: null 
        },
        { 
          icon: FiHelpCircle, 
          label: "Help", 
          path: "/help", 
          description: "Get assistance",
          badge: null 
        }
      ]
    }
  ];
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter the current page
      console.log(`Searching for: ${searchQuery}`);
      // Example: navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  // Show/hide tooltip with delay
  const handleMouseEnter = (id) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      setActiveTooltip(id);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      setActiveTooltip(null);
    }, 200);
  };

  // Click handler for sidebar menu items that doesn't change collapse state
  const handleMenuClick = () => {
    // Only close the mobile sidebar if it's open
    if (isSidebarOpen && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    // Do NOT change isSidebarCollapsed state here
  };
  
  // Badge component for menu items
  const MenuBadge = ({ badge }) => {
    if (!badge || (badge.hideWhenZero && badge.count === 0)) return null;
    
    return (
      <span className={`${badge.color} text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] flex items-center justify-center`}>
        {badge.count !== undefined ? badge.count : badge.text}
      </span>
    );
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

  // Show authentication error message if needed
  if (refreshError && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <FiX className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Authentication Error</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't retrieve your user data. You'll be redirected to the login page shortly.
          </p>
          <button
            onClick={logout}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Animation variants for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row relative`}>
      {/* Enhanced Sidebar with categories, animations and improved visuals */}
      <aside
        className={`fixed top-0 left-0 h-screen ${
          isSidebarCollapsed 
            ? "w-16 xs:w-18 sm:w-20 lg:w-20" // Collapsed width
            : "w-[75%] xs:w-[70%] sm:w-[65%] max-w-[280px] lg:w-72"  // Expanded width
        } bg-gradient-to-b from-[#252A61] to-[#1e2350] dark:from-[#1a1d3b] dark:to-[#121430] text-white z-50 transform transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col rounded-tr-3xl rounded-br-3xl shadow-xl`}
      >
        <AnimatePresence>
          <motion.div 
            className="flex flex-col h-full max-h-screen overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo Section - Conditionally showing logos based on sidebar state and device size */}
            <div className="relative flex items-center justify-center p-2 xs:p-3 sm:p-4 border-b border-white/10">
              {/* Normal logo when sidebar is expanded */}
              {!isSidebarCollapsed && (
                <Link to="/" className="flex items-center justify-center">
                  <motion.img 
                    src={MedicareLogo} 
                    alt="Medicare Logo" 
                    className="w-24 xs:w-28 sm:w-32 h-auto" 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              )}
              
              {/* When sidebar is collapsed */}
              {isSidebarCollapsed && (
                <>
                  {/* Hand logo for large devices only */}
                  <Link to="/" className="hidden lg:flex items-center justify-center">
                    <motion.img 
                      src={HandLogo} 
                      alt="Medicare Hand Logo" 
                      className="w-10 h-10 object-contain" 
                      initial={{ rotate: -15, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                  
                  {/* X icon for small/medium devices when collapsed */}
                  <div className="lg:hidden flex items-center justify-center">
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
              
              {/* X icon when sidebar is expanded (only for small/medium devices) */}
              {!isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden absolute top-2 right-2 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <FiX className="w-4 h-4 xs:w-5 xs:h-5" />
                </button>
              )}
            </div>
            
            {/* User Profile Section - Enhanced with hover effects and animations */}
            <div className={`px-3 py-3 border-b border-white/10 flex ${isSidebarCollapsed ? 'justify-center' : 'items-center'}`}>
              {isSidebarCollapsed ? (
                <div 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('profile')}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.div 
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shadow-lg"
                    whileHover={{ scale: 1.1, borderColor: 'rgba(255, 255, 255, 0.5)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ProfilePicture />
                  </motion.div>
                  
                  {/* Enhanced tooltip for profile in collapsed state */}
                  {activeTooltip === 'profile' && (
                    <div className="absolute left-full ml-2 bg-[#252A61] dark:bg-gray-800 text-white text-xs p-2 rounded-md whitespace-nowrap z-[60] shadow-lg border border-white/10">
                      <p className="font-medium">{user?.displayName || 'User Profile'}</p>
                      <p className="opacity-70 text-xs">{user?.email}</p>
                      <div className="w-full h-px bg-white/10 my-1"></div>
                      <p className="text-xs text-white/70">Click to view profile</p>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div 
                  className="flex items-center space-x-3 w-full"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/profile" className="relative group">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-colors group-hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] duration-300">
                      <ProfilePicture />
                    </div>
                    <motion.div 
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-[#252A61] hidden group-hover:block"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to="/profile" className="block group">
                      <p className="font-medium text-sm truncate group-hover:text-blue-200 transition-colors">{user?.displayName || 'Welcome'}</p>
                      <p className="text-xs text-white/70 truncate group-hover:text-white/90 transition-colors">{user?.email}</p>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation Menu - With enhanced categories and animations */}
            <nav className="flex-1 px-1 xs:px-2 py-2 overflow-y-auto custom-scrollbar">
              {menuCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-4">
                  {/* Category Title - Only show when sidebar is expanded */}
                  {!isSidebarCollapsed && (
                    <motion.h3 
                      className="text-xs uppercase text-white/50 px-2 mb-1 font-semibold tracking-wider flex items-center"
                      initial="hidden"
                      animate="visible"
                      custom={categoryIndex}
                      variants={menuItemVariants}
                    >
                      <span>{category.title}</span>
                      <div className="ml-2 h-px bg-white/20 flex-grow"></div>
                    </motion.h3>
                  )}
                  
                  {/* Category Menu Items */}
                  {category.items.map((item, idx) => {
                    const isActive = location.pathname === item.path;
                    const menuId = `${category.title}-${idx}`;
                    
                    return (
                      <motion.div 
                        key={menuId} 
                        className="relative"
                        onMouseEnter={() => isSidebarCollapsed && handleMouseEnter(menuId)}
                        onMouseLeave={() => isSidebarCollapsed && handleMouseLeave()}
                        initial="hidden"
                        animate="visible"
                        custom={(categoryIndex * 10) + idx}
                        variants={menuItemVariants}
                      >
                        <Link
                          to={item.path}
                          onClick={handleMenuClick}
                          className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center justify-between"} 
                          px-2 py-2 rounded-lg transition-all duration-200 mb-1 group relative
                          ${isActive 
                            ? "bg-gradient-to-r from-white/20 to-white/10 text-white shadow-md" 
                            : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                        >
                          {/* Active indicator */}
                          {isActive && !isSidebarCollapsed && (
                            <motion.div 
                              className="absolute left-0 top-1/2 w-1 h-6 bg-blue-400 rounded-r-full transform -translate-y-1/2"
                              layoutId="activeIndicator"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          
                          <div className={`flex ${!isSidebarCollapsed && "items-center space-x-2"}`}>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              className={`relative ${isActive && isSidebarCollapsed ? 'after:absolute after:inset-0 after:bg-blue-400/20 after:rounded-full after:transform after:scale-150 after:-z-10' : ''}`}
                            >
                              <item.icon className={`${isSidebarCollapsed ? "w-5 h-5" : "w-5 h-5"} ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                            </motion.div>
                            {!isSidebarCollapsed && (
                              <span className="text-sm font-medium truncate flex-1">
                                {item.label}
                              </span>
                            )}
                          </div>
                          
                          {/* Badge and chevron - only visible in expanded state */}
                          {!isSidebarCollapsed && (
                            <div className="flex items-center space-x-1">
                              {item.badge && (
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <MenuBadge badge={item.badge} />
                                </motion.div>
                              )}
                              {isActive && (
                                <motion.div
                                  initial={{ rotate: -90, opacity: 0 }}
                                  animate={{ rotate: 0, opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <FiChevronRight className="w-4 h-4 text-white/70" />
                                </motion.div>
                              )}
                            </div>
                          )}
                          
                          {/* Badge for collapsed state - positioned as an indicator */}
                          {isSidebarCollapsed && item.badge && (
                            <motion.div 
                              className="absolute -top-1 -right-1"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <MenuBadge badge={item.badge} />
                            </motion.div>
                          )}
                        </Link>
                        
                        {/* Enhanced tooltip for collapsed state */}
                        {isSidebarCollapsed && activeTooltip === menuId && (
                          <div className="absolute left-full ml-2 top-0 bg-[#252A61] dark:bg-gray-800 text-white text-xs p-2 rounded-md whitespace-nowrap z-[60] shadow-lg border border-white/10">
                            <p className="font-medium">{item.label}</p>
                            <p className="opacity-70 text-xs">{item.description}</p>
                            {item.badge && (
                              <div className="mt-1 pt-1 border-t border-white/10 flex items-center">
                                <MenuBadge badge={item.badge} />
                                <span className="ml-1 text-xs text-white/70">
                                  {item.badge.text || (item.badge.count !== undefined ? `${item.badge.count} new` : '')}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Footer Section - Enhanced styling and interactions */}
            <div className="p-2 border-t border-white/10">
              {/* Theme toggle button with enhanced animation */}
              <motion.button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center space-x-2"} w-full px-2 py-2 text-sm text-white/80 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors mb-2 relative overflow-hidden group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                {isDarkTheme ? (
                  <motion.div
                    initial={{ rotate: -30 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiSun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ rotate: 30 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiMoon className="w-5 h-5" />
                  </motion.div>
                )}
                {!isSidebarCollapsed && (
                  <span className="truncate">{isDarkTheme ? 'Light Mode' : 'Dark Mode'}</span>
                )}
              </motion.button>
            
              {/* Collapse button with enhanced animation */}
              <motion.button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center space-x-2"} w-full px-2 py-2 text-sm text-white/80 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors mb-2 relative overflow-hidden group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                <motion.div
                  animate={{ rotate: isSidebarCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiMenu className="w-5 h-5" />
                </motion.div>
                {!isSidebarCollapsed && <span className="truncate">Collapse</span>}
              </motion.button>

              {/* Logout Option with enhanced animation */}
              <motion.button
                onClick={() => setIsLogoutModalOpen(true)}
                className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center space-x-2"} w-full px-2 py-2 text-sm text-red-100 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors relative overflow-hidden group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                <motion.div
                  whileHover={{ x: [0, -2, 3, -2, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <FiLogOut className="w-5 h-5" />
                </motion.div>
                {!isSidebarCollapsed && <span className="truncate">Logout</span>}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed 
          ? "lg:ml-20 xl:ml-20" 
          : "lg:ml-[280px] xl:ml-72"
      }`}>
        {/* Mobile Menu Button - Floating in the corner */}
        <motion.button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-full bg-[#252A61] dark:bg-gray-800 text-white shadow-lg hover:bg-[#3b3b98] dark:hover:bg-gray-700 transition-all duration-300"
          aria-label="Open menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiMenu className="w-6 h-6" />
        </motion.button>

        {/* Mobile Search Button */}
        <motion.button
          onClick={() => setShowSearch(!showSearch)}
          className="fixed top-4 right-4 z-40 lg:hidden p-2 rounded-full bg-[#252A61] dark:bg-gray-800 text-white shadow-lg hover:bg-[#3b3b98] dark:hover:bg-gray-700 transition-all duration-300"
          aria-label="Search"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiSearch className="w-6 h-6" />
        </motion.button>
        
        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-16 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg search-container"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base px-4 py-3 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    onClick={() => setShowSearch(false)}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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