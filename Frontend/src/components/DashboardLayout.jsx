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
  const [searchFocused, setSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: FiArrowLeft, label: "Medicare", path: "/" },
    { icon: FiHome, label: "Overview", path: "/dashboard" },
    { icon: FiFileText, label: "Reports", path: "/reports" },
    { icon: FiUpload, label: "Upload", path: "/upload" },
    { icon: FiUser, label: "Profile", path: "/profile" },
    { icon: FiSettings, label: "Settings", path: "/settings" },
    { icon: FiHelpCircle, label: "Help", path: "/help" },
  ];

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications", {
        withCredentials: true,
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  // Close dropdowns when clicking outside
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#4318FF] text-white transform transition-transform duration-300 ease-in-out z-50 
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 mb-2 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <FiArrowLeft className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Medicare</h1>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all
                  ${
                    location.pathname === item.path
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4">
            <button
              onClick={handleLogoutClick}
              className="flex items-center space-x-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Left Section */}
              <div className="flex items-center flex-1 space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg lg:hidden hover:bg-gray-100 transition-colors"
                >
                  <FiMenu className="w-6 h-6" />
                </button>

                {/* Search Bar */}
                <div className="max-w-xl flex-1 relative">
                  <motion.div
                    animate={searchFocused ? { scale: 1.02 } : { scale: 1 }}
                    className="relative"
                  >
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                    />
                  </motion.div>
                </div>

                {/* View Toggle */}
                <div className="hidden md:flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "hover:bg-white/50"
                    }`}
                  >
                    <FiGrid className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "hover:bg-white/50"
                    }`}
                  >
                    <FiList className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-3 z-20">
                {/* Add Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#252A61] text-white rounded-xl hover:bg-[#4318FF] transition-colors shadow-sm"
                >
                  <FiPlus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add New</span>
                  <FiChevronDown className="w-4 h-4" />
                </motion.button>

                {/* Calendar Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-gray-100 rounded-lg relative hidden sm:flex items-center space-x-2"
                >
                  <FiCalendar className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Today</span>
                </motion.button>

                {/* Notifications */}
                <div className="relative notifications-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg relative"
                  >
                    <FiBell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </motion.button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 border border-gray-100"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Notifications
                          </h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                            >
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-100">
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All Notifications
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative profile-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-1.5 hover:bg-gray-50 rounded-xl group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#252A61] to-[#4318FF] flex items-center justify-center">
                      {user && user.photoURL? (
                        <img
                          src={user.photoURL}
                          alt="User"
                          className="w-8 h-8 rounded-full cursor-pointer object-cover"
                        />
                      ) : (
                        <img
                          src={usericon}
                          alt="Default User"
                          className="w-8 h-8 rounded-full cursor-pointer object-cover"
                        />
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">Patient</p>
                    </div>
                    <FiChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiUser className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiSettings className="w-4 h-4" />
                          <span>Settings</span>
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
              </div>
            </div>

            {/* Secondary Navigation */}
            <div className="border-t border-gray-200 px-4 py-2">
              <nav className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === "/dashboard"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/analytics"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === "/analytics"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Analytics
                </Link>
                <Link
                  to="/reports"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === "/reports"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Reports
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default DashboardLayout;
