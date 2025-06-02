import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import usericon from "../../assets/user.png";
import MedicareLogo from "../../assets/Logo/Medicare logo 1.png";
import HandLogo from "../../assets/Logo/hand logo.png";
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
  FiBell,
  FiChevronDown,
  FiArrowLeft,
  FiX,
  FiCalendar,
  FiClipboard,
  FiInfo,
  FiChevronRight,
  FiPlusCircle,
  FiMessageCircle,
  FiShield,
  FiActivity,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import { useAuthStore } from "../../store/Patient/authStore";
import usePatientStore from "../../store/Patient/patientstore";
import LogoutModal from "../../components/User/LogoutModal";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    return stored === 'true';
  });
  const [refreshError, setRefreshError] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, refreshUserData, isAuthenticated } = useAuthStore();
  const { 
    unreadNotificationsCount, 
    prescriptionCount,
    fetchAllMedicalData,
    isLoading: patientStoreLoading 
  } = usePatientStore();

  // Fetch all medical data when component mounts or user changes
  useEffect(() => {
    const fetchData = async () => {
      if (user?._id && isAuthenticated) {
        try {
          await fetchAllMedicalData(localStorage.getItem('token'));
        } catch (error) {
          console.error("Error fetching medical data:", error);
        }
      }
    };
    
    if (isAuthenticated) {
      fetchData();
    }
  }, [user?._id, isAuthenticated, fetchAllMedicalData]);

  // Refresh user data on component mount with error handling
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await refreshUserData();
        setRefreshError(false);
      } catch (error) {
        console.error("Error refreshing user data:", error);
        setRefreshError(true);
        
        if (error?.response?.status === 404 && isAuthenticated) {
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
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle clicks outside of dropdowns
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
          badge: null 
        },
        { 
          icon: FiClock, 
          label: "Prescription Reminders", 
          path: "/digital-prescriptions/reminders", 
          description: "Manage medication reminders",
          badge: null 
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
          badge: { count: unreadNotificationsCount, color: "bg-yellow-500", hideWhenZero: false } 
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

  // Badge component for menu items
  const MenuBadge = ({ badge }) => {
    if (!badge || (badge.hideWhenZero && badge.count === 0)) return null;
    
    return (
      <span className={`${badge.color} text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] flex items-center justify-center`}>
        {badge.count !== undefined ? badge.count : badge.text}
      </span>
    );
  };

  // Profile picture with error handling
  const ProfilePicture = ({ className }) => {
    const [imgError, setImgError] = useState(false);
    const [imgSrc, setImgSrc] = useState(usericon);
    
    useEffect(() => {
      if (user?.photoURL) {
        setImgError(false);
        if (!user.photoIsPermanent && !user.photoURL.includes('?')) {
          setImgSrc(`${user.photoURL}?t=${new Date().getTime()}`);
        } else {
          setImgSrc(user.photoURL);
        }
      } else {
        setImgSrc(null);
      }
    }, [user?.photoURL]);
    
    if (imgError || !imgSrc) {
      return (
        <div className={`${className || "w-full h-full"} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg`}>
          {user?.name?.charAt(0) || 'U'}
        </div>
      );
    }
    
    return (
      <img
        src={imgSrc}
        alt="Profile"
        className={className || "w-full h-full object-cover"}
        onError={() => setImgError(true)}
      />
    );
  };

  // Show authentication error message if needed
  if (refreshError && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <FiX className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen ${
          isSidebarCollapsed 
            ? "w-20" 
            : "w-72"
        } bg-[#252A61] text-white z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col rounded-tr-3xl rounded-br-3xl shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-center p-4 border-b border-white/10">
            {!isSidebarCollapsed ? (
              <Link to="/" className="flex items-center justify-center">
                <img 
                  src={MedicareLogo} 
                  alt="Medicare Logo" 
                  className="w-32 h-auto" 
                />
              </Link>
            ) : (
              <Link to="/" className="flex items-center justify-center">
                <img 
                  src={HandLogo} 
                  alt="Medicare Hand Logo" 
                  className="w-10 h-10 object-contain" 
                />
              </Link>
            )}
            
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-2 right-2 p-1.5 bg-white/10 rounded-full hover:bg-white/20"
              aria-label="Close menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-2 py-2 overflow-y-auto">
            {menuCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                {!isSidebarCollapsed && (
                  <h3 className="text-xs uppercase text-white/50 px-2 mb-1 font-semibold tracking-wider flex items-center">
                    <span>{category.title}</span>
                    <div className="ml-2 h-px bg-white/20 flex-grow"></div>
                  </h3>
                )}
                
                {category.items.map((item, idx) => {
                  const isActive = location.pathname === item.path;
                  const menuId = `${category.title}-${idx}`;
                  const isComingSoon = item.badge?.text === "SOON";
                  
                  return (
                    <div key={menuId} className="relative">
                      <Link
                        to={isComingSoon ? "#" : item.path}
                        onClick={(e) => {
                          if (isComingSoon) {
                            e.preventDefault();
                          }
                          if (isSidebarOpen && window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center justify-between"} 
                        px-2 py-2 rounded-lg mb-1
                        ${isActive 
                          ? "bg-white/20 text-white" 
                          : "text-white/70 hover:bg-white/10 hover:text-white"}
                        ${isComingSoon ? "cursor-not-allowed opacity-70" : ""}`}
                      >
                        <div className={`flex ${!isSidebarCollapsed && "items-center space-x-2"}`}>
                          <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                          {!isSidebarCollapsed && (
                            <span className="text-sm font-medium truncate flex-1">
                              {item.label}
                            </span>
                          )}
                        </div>
                        
                        {!isSidebarCollapsed && (
                          <div className="flex items-center space-x-1">
                            {item.badge && <MenuBadge badge={item.badge} />}
                            {isActive && <FiChevronRight className="w-4 h-4 text-white/70" />}
                          </div>
                        )}
                        
                        {isSidebarCollapsed && item.badge && (
                          <div className="absolute -top-1 -right-1">
                            <MenuBadge badge={item.badge} />
                          </div>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer Section */}
          <div className="p-2 border-t border-white/10">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center space-x-2"} w-full px-2 py-2 text-sm text-white/80 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 mb-2`}
            >
              <FiMenu className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="truncate">Collapse</span>}
            </button>
          
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className={`flex ${isSidebarCollapsed ? "justify-center" : "items-center space-x-2"} w-full px-2 py-2 text-sm text-red-100 bg-red-500/20 rounded-lg hover:bg-red-500/30`}
            >
              <FiLogOut className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="truncate">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-full bg-[#252A61] text-white shadow-lg hover:bg-[#3b3b98]"
        aria-label="Open menu"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      <div className={`flex-1 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        {/* Navbar */}
        <nav className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-[2000px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Search Bar */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Right side items */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                >
                  <FiBell className="h-6 w-6" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <ProfilePicture className="w-8 h-8" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.name || 'User'}
                    </span>
                    <FiChevronDown className="hidden md:block h-5 w-5 text-gray-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                        <button
                          onClick={() => setIsLogoutModalOpen(true)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

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