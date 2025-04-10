import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import usericon from "../assets/user.png";
import {
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
  FiPlus,
  FiChevronDown,
  FiCalendar,
  FiGrid,
  FiList,
  FiMoreHorizontal,
  FiArrowLeft,
  FiX,
} from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import LogoutModal from "./LogoutModal";
import axios from "axios";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: FiHome, label: "Dashboard", path: "/dashboard" },
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
      {/* Enhanced Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] sm:w-64 bg-gradient-to-b from-[#4318FF] to-[#9747FF] 
          text-white transform transition-all duration-300 ease-in-out z-50 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-32 -mr-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/5 rounded-full -mb-24 -ml-24 blur-2xl"></div>
          
          {/* Logo */}
          <div className="p-6 mb-2 flex items-center justify-between relative z-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
                <FiArrowLeft className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Medicare</h1>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Enhanced Navigation */}
          <nav className="flex-1 px-4 relative z-10">
            <div className="mb-4 px-2">
              <p className="text-white/40 text-xs uppercase font-semibold tracking-wider">Main Menu</p>
            </div>
            {menuItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200
                  ${
                    location.pathname === item.path
                      ? "bg-white/15 text-white font-medium backdrop-blur-sm shadow-sm"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <motion.div
                  animate={{ 
                    scale: location.pathname === item.path ? [1, 1.2, 1] : 1,
                    rotate: location.pathname === item.path ? [0, 5, 0] : 0
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <span>{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-white ml-auto"
                    layoutId="nav-indicator"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Enhanced Logout Button */}
          <div className="p-4 relative z-10">
            <motion.button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center justify-between space-x-3 px-4 py-3 w-full 
                text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl 
                transition-all duration-200 border border-white/5 backdrop-blur-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center space-x-3">
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </div>
              <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg">
                <FiArrowLeft className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Enhanced Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-row items-start sm:items-center justify-between p-4">
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
                        focus:border-blue-300 dark:focus:border-blue-700 transition-all text-base placeholder:text-gray-400 
                        dark:placeholder:text-gray-500 shadow-sm hover:shadow-md"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">⌘ K</kbd>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Section - Always in one row */}
              <div className="flex items-center ml-4 space-x-3">
                {/* Enhanced Notifications */}
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
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                          <button className="text-xs text-blue-600 dark:text-blue-400">Mark all as read</button>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-2">
                          {/* Sample Notifications */}
                          {[1,2,3].map(i => (
                            <div key={i} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors mb-1">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                  <FiBell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-800 dark:text-gray-200">New notification example</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Enhanced User Profile */}
                <div className="relative profile-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl group"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#252A61] to-[#4318FF] ring-2 ring-white/10 dark:ring-black/10">
                      <img
                        src={user?.photoURL || usericon}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 leading-tight">{user?.email || "user@example.com"}</p>
                    </div>
                    <FiChevronDown className="hidden sm:block w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span>Your Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <FiSettings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span>Settings</span>
                        </Link>
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                        <button
                          onClick={() => setIsLogoutModalOpen(true)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 w-full"
                        >
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <FiLogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <span>Sign Out</span>
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