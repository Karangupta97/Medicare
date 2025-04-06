import React from "react";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { FaUserEdit, FaIdCard, FaCalendarAlt, FaEnvelope, FaPhone, FaShieldAlt, FaHistory, FaClock, FaCamera } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setLoading(false);
      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, JPG or PNG)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file); // Changed from 'photo' to 'file' to match backend expectation

    try {
      const response = await axios.put('/api/auth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted);
        },
      });

      if (response.data.user) {
        setUser(response.data.user);
        toast.success('Profile photo updated successfully');
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      if (error.response?.status === 413) {
        toast.error('Image size too large. Please select a smaller file.');
      } else if (error.response?.status === 415) {
        toast.error('Invalid file type. Please select a JPEG or PNG image.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update profile photo. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('/api/auth/update-profile', formData);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Personal Information Card */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <FaIdCard className="text-blue-500" />
            Personal Information
          </h3>
          <button 
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaUserEdit />
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaIdCard className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.name} {user.lastname}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaEnvelope className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaPhone className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date Joined</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.createdAt ? formatDate(user.createdAt) : "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Account Security Card */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
          <FaShieldAlt className="text-green-500" />
          Account Security
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <FaShieldAlt className="w-5 h-5 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email Verification</p>
              <div className="flex items-center gap-2">
                {user.isverified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Not Verified
                  </span>
                )}
                {!user.isverified && (
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Verify Now
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <FaClock className="w-5 h-5 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(user.lastLOGIN)}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Change Password
          </button>
        </div>
      </motion.div>

      {/* Activity Overview */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
          <FaHistory className="text-purple-500" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg shrink-0">
              <FaHistory className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Login from new device</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(user.lastLOGIN)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg shrink-0">
              <FaHistory className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Profile updated</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(user.updatedAt || new Date(Date.now() - 7*24*60*60*1000))}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg shrink-0">
              <FaHistory className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Account created</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(user.createdAt || new Date(Date.now() - 30*24*60*60*1000))}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Profile Header */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 sm:p-8 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6 z-10">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative overflow-hidden">
                <img
                  src={user?.photoURL || "/user.png"}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-900 transition-transform group-hover:scale-105"
                />
                <div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handlePhotoClick}
                >
                  {uploading ? (
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaCamera className="text-white text-2xl" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {user.name} {user.lastname}
              </h1>
              <p className="text-blue-100 mb-3">Account ID: {user.uid}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {user.isverified ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-50 border border-green-500/30">
                    <FaShieldAlt className="mr-1" /> Verified Account
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-50 border border-yellow-500/30">
                    <FaShieldAlt className="mr-1" /> Unverified Account
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-50 border border-blue-500/30">
                  <FaCalendarAlt className="mr-1" /> Member since {new Date(user.createdAt || Date.now() - 30*24*60*60*1000).getFullYear()}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => setEditMode(!editMode)}
                className="px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm flex items-center gap-2"
              >
                <FaUserEdit />
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Profile Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "reports"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Settings
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "reports" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Reports</h3>
              <p className="text-gray-500 dark:text-gray-400">View your reports in the Reports section.</p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Settings</h3>
              <p className="text-gray-500 dark:text-gray-400">Account settings will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
