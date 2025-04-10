import React from "react";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  FaUserEdit,
  FaIdCard,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaHistory,
  FaClock,
  FaCamera,
} from "react-icons/fa";
import { FiX, FiEye, FiEdit } from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import PhotoEditorModal from "../components/PhotoEditorModal";

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [showPicOptions, setShowPicOptions] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);

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

  const handlePicView = () => {
    setIsPicModalOpen(true);
  };

  const handlePhotoClick = () => {
    setIsPhotoEditorOpen(true);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, JPG or PNG)");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setUser((prev) => ({
      ...prev,
      photoURL: localPreview,
      _tempPhotoURL: true,
    }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.put("/api/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Upload progress:", percentCompleted);
        },
      });

      if (response.data.user && response.data.user.photoURL) {
        setUser({
          ...response.data.user,
          _tempPhotoURL: false,
        });

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            photoURL: response.data.user.photoURL,
            _tempPhotoURL: false,
          })
        );

        toast.success("Profile photo updated successfully");
      } else {
        throw new Error("Invalid server response: Missing photo URL");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      setUser((prev) => ({
        ...prev,
        photoURL: user.photoURL,
        _tempPhotoURL: false,
      }));

      if (error.response?.status === 413) {
        toast.error("Image size too large. Please select a smaller file.");
      } else if (error.response?.status === 415) {
        toast.error("Invalid file type. Please select a JPEG or PNG image.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to update profile photo. Please try again."
        );
      }
    } finally {
      setUploading(false);
      if (localPreview) URL.revokeObjectURL(localPreview);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put("/api/auth/update-profile", formData);
      setUser(response.data.user);
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePhotoSave = async (editedImage) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", editedImage);

      const response = await axios.put("/api/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.user) {
        setUser({
          ...response.data.user,
          _tempPhotoURL: false,
        });

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            photoURL: response.data.user.photoURL,
            _tempPhotoURL: false,
          })
        );

        toast.success("Profile photo updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile photo:", error);
      toast.error("Failed to update profile photo");
    } finally {
      setUploading(false);
      setIsPhotoEditorOpen(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
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
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md p-3 sm:p-4 md:p-6 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4 md:mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-1.5 sm:gap-2">
            <FaIdCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Personal Information
          </h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaUserEdit className="w-3 h-3 sm:w-4 sm:h-4" />
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                onClick={handleSaveProfile}
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                <FaIdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                  {user.name} {user.lastname}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaEnvelope className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email Address
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaPhone className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone Number
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date Joined
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md p-3 sm:p-4 md:p-6 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4 md:mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-1.5 sm:gap-2">
            <div className="p-1.5 sm:p-2 bg-green-50 dark:bg-green-900/30 rounded-lg flex-shrink-0">
              <FaShieldAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 dark:text-green-400" />
            </div>
            Account Security
          </h3>
          <button className="flex items-center gap-1 text-xs sm:text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
            <FaShieldAlt className="w-3 h-3 sm:w-4 sm:h-4" />
            Security Settings
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 sm:p-2 bg-green-50 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                <FaShieldAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Email Verification
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                  {user.isverified ? (
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Not Verified
                    </span>
                  )}
                  {!user.isverified && (
                    <button className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium ml-2 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 sm:p-2 bg-green-50 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                <FaClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Last Login
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(user.lastLOGIN)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 sm:p-2 bg-green-50 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Password Status
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Secure
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 sm:p-2 bg-green-50 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Two-Factor Authentication
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    Not Enabled
                  </span>
                  <button className="text-[10px] sm:text-xs text-green-600 hover:text-green-700 font-medium">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 sm:gap-3">
          <button className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              ></path>
            </svg>
            Change Password
          </button>
          <button className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
            Enable 2FA
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 mb-3 sm:mb-4 md:mb-6 relative overflow-hidden backdrop-blur-md bg-opacity-50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full -mr-10 sm:-mr-16 md:-mr-24 lg:-mr-32 -mt-10 sm:-mt-16 md:-mt-24 lg:-mt-32 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-purple-500/20 rounded-full -ml-10 sm:-ml-16 md:-ml-24 lg:-ml-32 -mb-10 sm:-mb-16 md:-mb-24 lg:-mb-32 blur-3xl"></div>

              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 z-10 w-full">
                <div className="relative flex-shrink-0 mb-3 sm:mb-0 flex flex-col items-center">
                  <div
                    onClick={handlePhotoClick}
                    className="group w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative overflow-hidden cursor-pointer"
                  >
                    <img
                      src={user?.photoURL || "/user.png"}
                      alt="Profile"
                      className="w-[90%] h-[90%] rounded-full object-cover border-2 sm:border-3 md:border-4 border-white transition-all group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all">
                      <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                        <FaCamera className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handlePicView}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white text-xs hover:bg-white/20 transition-colors border border-white/20"
                    >
                      <FiEye className="w-3 h-3" />
                      View
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-1">
                    {user.name} {user.lastname}
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-sm md:text-base mb-3 sm:mb-2">
                    ID: {user.uid}
                  </p>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-1.5 md:gap-2">
                    {user.isverified ? (
                      <span className="inline-flex items-center px-2 sm:px-2 md:px-3 py-1 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-green-500/20 text-green-50 border border-green-500/30">
                        <FaShieldAlt className="mr-1 w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />{" "}
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 sm:px-2 md:px-3 py-1 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-500/20 text-yellow-50 border border-yellow-500/30">
                        <FaShieldAlt className="mr-1 w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />{" "}
                        Unverified
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 sm:px-2 md:px-3 py-1 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-500/20 text-blue-50 border border-blue-500/30">
                      <FaCalendarAlt className="mr-1 w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />{" "}
                      Member since{" "}
                      {new Date(
                        user.createdAt || Date.now() - 30 * 24 * 60 * 60 * 1000
                      ).getFullYear()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="px-3 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 bg-white/10 text-white rounded-lg sm:rounded-xl hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm flex items-center gap-1.5 sm:gap-1.5 md:gap-2 text-sm sm:text-sm"
                  >
                    <FaUserEdit className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    {editMode ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 -mx-2 sm:mx-0 px-2 sm:px-0 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                <div className="flex space-x-2 min-w-max">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === "overview"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaIdCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className={`px-3 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === "reports"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaHistory className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Reports
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`px-3 sm:px-3 md:px-4 py-1.5 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === "settings"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaShieldAlt className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 md:gap-6">
              {activeTab === "overview" && renderOverviewTab()}
              {activeTab === "reports" && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 sm:mb-4">
                    Reports History
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Your medical reports will appear here.
                  </p>
                </div>
              )}
              {activeTab === "settings" && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 sm:mb-4">
                    Account Settings
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Configure your account preferences.
                  </p>
                </div>
              )}
            </div>

            {isPicModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 md:p-6"
                onClick={() => setIsPicModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="relative max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={user?.photoURL || "/user.png"}
                    alt="Profile"
                    className="w-full h-auto object-contain"
                  />
                  <button
                    onClick={() => setIsPicModalOpen(false)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                  >
                    <FiX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
        onSave={handlePhotoSave}
        imageUrl={user?.photoURL || "/user.png"}
      />
    </DashboardLayout>
  );
};

export default Profile;
