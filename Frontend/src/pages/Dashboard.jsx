import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { 
  FiUser, FiClock, FiMail, FiKey, FiMenu, FiX, 
  FiFileText, FiCalendar, FiBell, FiHeart, FiActivity,
  FiUpload, FiDownload, FiSettings, FiHelpCircle,
  FiTrendingUp, FiCheckCircle, FiAlertCircle, FiInfo,
  FiShield, FiCreditCard, FiFile, FiClipboard,
  FiMapPin, FiPhone, FiUserCheck, FiHome, FiBookOpen,
  FiUserPlus, FiBookmark, FiPackage, FiUploadCloud
} from "react-icons/fi";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isCheckingAuth) {
      checkAuth().catch(() => {
        navigate("/login");
      });
    }
  }, [isAuthenticated, isCheckingAuth, checkAuth, navigate]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // Here you would typically handle the file upload to your backend
    setUploadStatus('uploading');
    // Simulate upload
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Mock data for Medicare documents
  const medicareDocuments = [
    {
      title: "Medical Reports",
      status: "Upload",
      icon: FiUploadCloud,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      details: "Upload your medical reports and documents",
      link: "#"
    },
    {
      title: "Claims History",
      status: "View",
      icon: FiFileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      details: "View your Medicare claims history",
      link: "#"
    },
    {
      title: "Benefits Summary",
      status: "Available",
      icon: FiShield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      details: "Review your Medicare benefits",
      link: "#"
    },
    {
      title: "Coverage Details",
      status: "Active",
      icon: FiCheckCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      details: "Check your coverage status",
      link: "#"
    }
  ];

  // Mock data for recent documents
  const recentDocuments = [
    {
      id: 1,
      name: "Blood Test Results",
      date: "2024-03-25",
      type: "Lab Report",
      status: "uploaded",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "X-Ray Report",
      date: "2024-03-20",
      type: "Imaging",
      status: "processing",
      size: "4.1 MB"
    },
    {
      id: 3,
      name: "Prescription List",
      date: "2024-03-15",
      type: "Pharmacy",
      status: "uploaded",
      size: "1.2 MB"
    }
  ];

  // Mock data for document timeline
  const documentTimeline = [
    {
      id: 1,
      date: "2024-03-25",
      title: "Blood Test Uploaded",
      description: "Lab results from March 20th visit",
      icon: FiUpload,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: 2,
      date: "2024-03-20",
      title: "X-Ray Report Added",
      description: "Chest X-ray from March 15th",
      icon: FiUpload,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      id: 3,
      date: "2024-03-15",
      title: "Prescription List Updated",
      description: "Updated medication list",
      icon: FiUpload,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-2 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen"
      >
        {/* Welcome Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mx-2 sm:mx-0"
        >
          <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <motion.h1 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl sm:text-3xl font-bold text-white mb-2"
                >
                  Welcome Back, {user?.name || 'Member'}!
                </motion.h1>
                <p className="text-white/90 text-sm sm:text-base">
                  Manage your Medicare documents and medical reports
                </p>
              </div>
              <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
                <label className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <FiUploadCloud className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">Upload Report</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
                <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                  <FiDownload className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">Download All</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Medicare Documents Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-2 sm:px-0"
        >
          {medicareDocuments.map((doc, index) => (
            <motion.div
              key={doc.title}
              variants={itemVariants}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${doc.bgColor}`}>
                  <doc.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${doc.color}`} />
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'Upload' ? 'bg-blue-100 text-blue-700' : 
                  doc.status === 'View' ? 'bg-green-100 text-green-700' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {doc.status}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{doc.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{doc.details}</p>
              <a href={doc.link} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                {doc.status === 'Upload' ? 'Upload Now →' : 'View Details →'}
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
          {/* Document Profile Card */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center"
              >
                <FiUser className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{user?.name || 'Member'}</h2>
                <p className="text-xs sm:text-sm text-gray-500">Medicare Member</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <FiFileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Documents</p>
                  <p className="text-sm font-medium text-gray-800">12 Files</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <FiUpload className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Last Upload</p>
                  <p className="text-sm font-medium text-gray-800">Blood Test Results</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Recent Documents and Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Documents Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Recent Documents</h3>
                <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                        doc.status === 'uploaded' ? 'bg-green-50' : 'bg-yellow-50'
                      }`}>
                        <FiFile className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          doc.status === 'uploaded' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800">{doc.name}</h4>
                        <p className="text-xs text-gray-500">{doc.type} - {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs text-gray-500 hidden sm:block">{formatDate(doc.date)}</span>
                      <button className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Document Timeline Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Document History</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {documentTimeline.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`p-3 rounded-xl ${item.bgColor}`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(item.date)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <FiUploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span className="text-xs sm:text-sm text-gray-700">Upload Report</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <FiDownload className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <span className="text-xs sm:text-sm text-gray-700">Download All</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  <span className="text-xs sm:text-sm text-gray-700">View Reports</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
