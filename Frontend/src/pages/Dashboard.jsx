import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { 
  FiUser, FiClock, FiMail, FiKey, FiMenu, FiX, 
  FiFileText, FiCalendar, FiBell, FiHeart, FiActivity,
  FiUpload, FiDownload, FiSettings, FiHelpCircle,
  FiTrendingUp, FiCheckCircle, FiAlertCircle, FiInfo,
  FiShield, FiCreditCard, FiFile, FiClipboard,
  FiMapPin, FiPhone, FiUserCheck, FiHome, FiBookOpen,
  FiUserPlus, FiBookmark, FiPackage, FiUploadCloud,
  FiFilter, FiGrid, FiArrowRight, FiMoreVertical, FiEye
} from "react-icons/fi";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userReports, setUserReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isCheckingAuth) {
      checkAuth().catch(() => {
        navigate("/login");
      });
    }
  }, [isAuthenticated, isCheckingAuth, checkAuth, navigate]);

  useEffect(() => {
    // Fetch user reports when component mounts or user changes
    if (user?.uid) {
      console.log('User data available:', user);
      fetchUserReports();
    }
  }, [user]);

  const fetchUserReports = async () => {
    try {
      setIsLoading(true);
      
      // Get the user ID (handle both formats)
      const userId = user.id || user._id || user.uid;
      console.log('Using user ID for fetching reports:', userId);
      
      // Make request with credentials to include cookies
      const response = await axios.get(`/api/reports/user/${userId}`, {
        withCredentials: true
      });
      
      setUserReports(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user reports:", error);
      setErrorMessage("Failed to load your reports. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage("");
    
    // Get the user ID (handle both formats)
    const userId = user.id || user._id || user.uid;
    console.log('Using user ID for upload:', userId);
    
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('report', file);
    formData.append('userId', userId);
    formData.append('reportType', getReportType(file.name));
    formData.append('description', `Uploaded on ${new Date().toLocaleDateString()}`);
    
    try {
      // Upload to your backend API with credentials to include cookies
      const response = await axios.post('/api/reports/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      
      // If successful, add the new report to state
      setUserReports(prevReports => [response.data, ...prevReports]);
      setUploadStatus('success');
      setTimeout(() => {
        setUploadStatus(null);
        setSelectedFile(null);
      }, 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.message || "Failed to upload file. Please try again.");
    }
  };

  const getReportType = (fileName) => {
    // Simple function to determine report type based on file name
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png'].includes(extension)) return 'Image';
    if (['pdf'].includes(extension)) return 'PDF Document';
    if (['doc', 'docx'].includes(extension)) return 'Medical Report';
    return 'Other Document';
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
      <div 
        className="p-2 sm:p-6 bg-gray-50 min-h-screen"
      >
        {/* Welcome Section / Header */}
        <div 
          className="bg-white border-b border-gray-200 shadow-sm overflow-hidden mx-2 sm:mx-0 mb-6"
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between mb-2">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-gray-500">
                  <li>
                    <a href="#" className="hover:text-blue-600">Home</a>
                  </li>
                  <li className="flex items-center">
                    <span className="mx-1">/</span>
                    <span className="text-gray-700 font-medium">Dashboard</span>
                  </li>
                </ol>
              </nav>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 text-sm">
                  Welcome back, <span className="font-medium">{user?.name || 'Member'}</span>. Manage your Medicare information and documents.
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <label className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm">
                  <FiUploadCloud className="w-4 h-4" />
                  <span className="whitespace-nowrap">Upload Document</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
                <button className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
                  <FiDownload className="w-4 h-4" />
                  <span className="whitespace-nowrap">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 px-4 sm:px-6 border-t border-blue-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Documents</p>
                  <p className="text-xl font-bold text-gray-800">12</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <FiFileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <span className="text-green-600 flex items-center">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  +18%
                </span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Claims Processed</p>
                  <p className="text-xl font-bold text-gray-800">8</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <span className="text-green-600 flex items-center">
                  <FiCheckCircle className="w-3 h-3 mr-1" />
                  All Clear
                </span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Upcoming Appts</p>
                  <p className="text-xl font-bold text-gray-800">2</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <FiCalendar className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <span className="text-purple-600 flex items-center">
                  <FiClock className="w-3 h-3 mr-1" />
                  Next: May 15
                </span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Prescriptions</p>
                  <p className="text-xl font-bold text-gray-800">5</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <FiPackage className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <span className="text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" />
                  1 Renewal Needed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Medicare Documents Grid */}
        <div className="px-2 sm:px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Medicare Documents</h2>
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <FiFilter className="w-4 h-4 mr-1" /> Filter
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <FiGrid className="w-4 h-4 mr-1" /> View All
              </button>
            </div>
          </div>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {medicareDocuments.map((doc, index) => (
              <div
              key={doc.title}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Colorful accent border on top */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  index % 4 === 0 ? 'bg-blue-500' : 
                  index % 4 === 1 ? 'bg-green-500' : 
                  index % 4 === 2 ? 'bg-purple-500' : 
                  'bg-yellow-500'
                }`}></div>
                
                <div className="flex items-center justify-between mb-4 mt-2">
                  <div className={`p-3 rounded-md ${doc.bgColor}`}>
                    <doc.icon className={`w-5 h-5 ${doc.color}`} />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'Upload' ? 'bg-blue-50 text-blue-700' : 
                    doc.status === 'View' ? 'bg-green-50 text-green-700' : 
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-2">{doc.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{doc.details}</p>
                <a href={doc.link} className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                  {doc.status === 'Upload' ? 'Upload Now' : 'View Details'}
                  <FiArrowRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
        
        {/* Activity Feed - New Section */}
        <div className="px-2 sm:px-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                  <FiActivity className="w-3 h-3 mr-1" /> Live Updates
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Activity items */}
              <div className="flex items-start gap-3 p-3 border-l-2 border-blue-500 bg-blue-50 rounded-r-md">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FiUpload className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-800">Blood Test Results Uploaded</h4>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Your lab results have been processed successfully</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <FiMoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-start gap-3 p-3 border-l-2 border-yellow-500 bg-yellow-50 rounded-r-md">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <FiBell className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-800">Prescription Renewal Needed</h4>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-600">Your heart medication needs to be renewed within 5 days</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <FiMoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-start gap-3 p-3 border-l-2 border-green-500 bg-green-50 rounded-r-md">
                <div className="p-2 bg-green-100 rounded-full">
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-800">Claim #MC456789 Approved</h4>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Your claim has been approved. Reimbursement will be processed.</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <FiMoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-100 rounded-md hover:bg-blue-50 transition-colors">
              View All Activity
            </button>
          </div>
        </div>

        {/* Reports Section */}
        <div className="px-2 sm:px-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Your Medical Reports</h2>
              <div className="flex items-center gap-2">
                <label className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer">
                  <FiUploadCloud className="w-4 h-4 mr-1.5" /> Upload New Report
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
            </div>

            {/* Upload Status */}
            {uploadStatus === 'uploading' && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700 mb-1">Uploading {selectedFile?.name}...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
            
            {uploadStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-50 rounded-md">
                <div className="flex items-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-sm text-green-700">File uploaded successfully!</p>
                </div>
              </div>
            )}
            
            {uploadStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-50 rounded-md">
                <div className="flex items-start">
                  <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <p className="text-sm text-red-700">Upload failed</p>
                    <p className="text-xs text-red-600">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : errorMessage && !uploadStatus ? (
              <div className="p-4 bg-red-50 rounded-md text-center">
                <p className="text-sm text-red-700">{errorMessage}</p>
                <button 
                  onClick={fetchUserReports}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Try Again
                </button>
              </div>
            ) : userReports.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-lg">
                <FiFileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No reports uploaded yet</p>
                <p className="text-sm text-gray-400 mt-1">Upload your medical reports to keep them organized</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userReports.map((report) => (
                        <tr key={report._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-md ${
                                report.reportType === 'Image' ? 'bg-purple-50' :
                                report.reportType === 'PDF Document' ? 'bg-red-50' :
                                'bg-blue-50'
                              }`}>
                                <FiFile className={`w-5 h-5 ${
                                  report.reportType === 'Image' ? 'text-purple-600' :
                                  report.reportType === 'PDF Document' ? 'text-red-600' :
                                  'text-blue-600'
                                }`} />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{report.filename}</p>
                                <p className="text-xs text-gray-500 truncate max-w-xs">{report.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">{report.reportType}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">{formatDate(report.createdAt)}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">{report.fileSize ? `${(report.fileSize / 1024).toFixed(1)} KB` : 'N/A'}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-2">
                              <a 
                                href={report.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 p-1.5"
                                title="View"
                              >
                                <FiEye className="w-4 h-4" />
                              </a>
                              <a 
                                href={report.fileUrl} 
                                download 
                                className="text-green-600 hover:text-green-800 p-1.5"
                                title="Download"
                              >
                                <FiDownload className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
          {/* Document Profile Card */}
          <div 
            className="lg:col-span-1 bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div 
                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <FiUser className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800">{user?.name || 'Member'}</h2>
                <p className="text-xs sm:text-sm text-gray-500">Medicare Member</p>
                <p className="text-xs text-gray-400 mt-1">UID: {user?.uid || 'Not available'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div 
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-md border border-gray-100"
              >
                <FiFileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Documents</p>
                  <p className="text-sm font-medium text-gray-800">12 Files</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-md border border-gray-100"
              >
                <FiUpload className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Last Upload</p>
                  <p className="text-sm font-medium text-gray-800">Blood Test Results</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Documents and Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Documents Card */}
            <div 
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-800">Recent Documents</h3>
                <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-md border border-gray-100"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center ${
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
                      <button className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Timeline Card */}
            <div 
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-800">Document History</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {documentTimeline.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-md border border-gray-100"
                  >
                    <div className={`p-3 rounded-md ${item.bgColor}`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div 
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-4 sm:mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <button
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <FiUploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span className="text-xs sm:text-sm text-gray-700">Upload Report</span>
                </button>
                <button
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <FiDownload className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <span className="text-xs sm:text-sm text-gray-700">Download All</span>
                </button>
                <button
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  <span className="text-xs sm:text-sm text-gray-700">View Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
