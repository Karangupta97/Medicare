import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiHome,
  FiUpload,
  FiDownload,
  FiHelpCircle,
  FiMenu,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigationItems = [
    {
      name: "Back",
      icon: <FiArrowLeft />,
      path: "#",
      onClick: () => navigate(-1),
    },
    { name: "Overview", icon: <FiHome />, path: "/dashboard" },
    { name: "Reports", icon: <FiFileText />, path: "/dashboard/reports" },
    { name: "Upload", icon: <FiUpload />, path: "/dashboard/upload" },
    { name: "Profile", icon: <FiUser />, path: "/dashboard/profile" },
    { name: "Settings", icon: <FiSettings />, path: "/dashboard/settings" },
    { name: "Help", icon: <FiHelpCircle />, path: "/dashboard/help" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg lg:hidden"
      >
        {isSidebarOpen ? (
          <FiX className="w-6 h-6 text-gray-900 dark:text-white" />
        ) : (
          <FiMenu className="w-6 h-6 text-gray-900 dark:text-white" />
        )}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#252A61] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold">Medicare</h1>
            <p className="text-sm text-white/70 mt-1">Medical Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigationItems.map((item) =>
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-white/10 text-white/80"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-white/80"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            )}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-white/10">
            <Link
              to="/dashboard/profile"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === "/dashboard/profile"
                  ? "bg-white/20 text-white"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <FiUser className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-white/70 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </Link>
            <button
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
