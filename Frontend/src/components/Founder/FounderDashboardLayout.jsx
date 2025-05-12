import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  FiMenu, FiX, FiLogOut, FiGrid, FiUsers, FiSettings, 
  FiShield, FiDatabase, FiAlertCircle, FiFileText, FiServer,
  FiActivity, FiBell, FiCreditCard, FiUser
} from "react-icons/fi";
import Logo from "../../assets/logo.png";
import { useFounderStore } from "../../store/founderStore";

const FounderDashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use founder store hooks
  const { 
    founder, 
    isAuthenticated, 
    isLoading, 
    logout, 
    checkAuth 
  } = useFounderStore();
  
  // Check authentication on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        try {
          await checkAuth();
        } catch (err) {
          console.error("Authentication check failed:", err);
          navigate("/founder/login");
        }
      }
    };
    
    verifyAuth();
  }, [isAuthenticated, checkAuth, navigate]);
  
  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/founder/login");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/founder/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  
  // Navigation items
  const navItems = [
    { 
      name: "Dashboard", 
      path: "/founder/dashboard", 
      icon: <FiGrid className="h-5 w-5" /> 
    },
    { 
      name: "Users Management", 
      path: "/founder/users", 
      icon: <FiUsers className="h-5 w-5" /> 
    },
    { 
      name: "Admin Management", 
      path: "/founder/admins", 
      icon: <FiShield className="h-5 w-5" /> 
    },
    { 
      name: "System Health", 
      path: "/founder/system-health", 
      icon: <FiActivity className="h-5 w-5" /> 
    },
    { 
      name: "Security Center", 
      path: "/founder/security", 
      icon: <FiAlertCircle className="h-5 w-5" /> 
    },
    { 
      name: "Database Management", 
      path: "/founder/database", 
      icon: <FiDatabase className="h-5 w-5" /> 
    },
    { 
      name: "API Configuration", 
      path: "/founder/api-config", 
      icon: <FiServer className="h-5 w-5" /> 
    },
    { 
      name: "Logs & Reports", 
      path: "/founder/logs", 
      icon: <FiFileText className="h-5 w-5" /> 
    },
    { 
      name: "Billing & Subscription", 
      path: "/founder/billing", 
      icon: <FiCreditCard className="h-5 w-5" /> 
    },
    { 
      name: "Settings", 
      path: "/founder/settings", 
      icon: <FiSettings className="h-5 w-5" /> 
    },
  ];
  
  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Show loading spinner if checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header with logo */}
        <div className="flex items-center justify-between h-16 px-4 bg-blue-800 dark:bg-gray-900">
          <div className="flex items-center">
            <img src={Logo} alt="Medicare Logo" className="h-8 w-8" />
            <span className="ml-2 text-xl font-semibold text-white">Medicare</span>
          </div>
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        {/* Founder profile summary */}
        {founder && (
          <div className="flex items-center px-4 py-3 bg-blue-800/70 dark:bg-gray-700/50">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-700 text-white">
              <FiUser className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{founder.name}</p>
              <p className="text-xs text-blue-200 dark:text-gray-300">Founder</p>
            </div>
          </div>
        )}
        
        {/* Navigation links */}
        <nav className="mt-4 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                ${isActive(item.path) 
                  ? "bg-blue-700 text-white dark:bg-gray-700" 
                  : "text-blue-100 hover:bg-blue-700/60 dark:text-gray-300 dark:hover:bg-gray-700/70"}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Logout button */}
        <div className="absolute bottom-0 w-full px-4 py-4 bg-blue-800 dark:bg-gray-900">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-blue-100 rounded-md hover:bg-blue-700/60 dark:text-gray-300 dark:hover:bg-gray-700/70 transition-colors duration-150"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              className="lg:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <div className="text-lg font-semibold text-gray-800 dark:text-white lg:hidden">
              Founder Dashboard
            </div>
            
            {/* Right side header controls */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none">
                <FiBell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Main content scrollable area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FounderDashboardLayout; 