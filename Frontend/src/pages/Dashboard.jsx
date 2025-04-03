import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { FiFileText, FiCheckCircle, FiCalendar, FiAlertCircle, FiMail, FiPhone, FiCreditCard, FiUpload, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats', {
        withCredentials: true,
      });
      setStats(response.data.stats || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get('/api/dashboard/recent-activity', {
        withCredentials: true,
      });
      setRecentActivity(response.data.activities || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      toast.error('Failed to load recent activity');
    }
  };

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching reports from API');
      
      const response = await axios.get('/api/reports', {
        withCredentials: true,
      });
      
      console.log('Reports fetched successfully:', response.data);
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        setError('Please login to view your reports');
        toast.error('Please login to view your reports');
      } else if (error.response?.status === 500) {
        setError(`Server error: ${error.response?.data?.message || 'Unknown error'}`);
        toast.error(`Server error: ${error.response?.data?.message || 'Unknown error'}`);
      } else if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        toast.error(`Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Network error: Could not connect to the server. Please check your internet connection.');
        toast.error('Network error: Could not connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message || 'Failed to load reports. Please try again.'}`);
        toast.error(`Error: ${error.message || 'Failed to load reports. Please try again.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchStats();
    fetchRecentActivity();
  }, []);

  const handleRetry = () => {
    fetchReports();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-[#252A61] to-[#4318FF]">
            <div className="absolute -bottom-12 left-8 flex items-end space-x-6">
              <div className="w-24 h-24 rounded-xl bg-white shadow-lg p-1">
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#252A61] to-[#4318FF] flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="pb-4">
                <h1 className="text-white text-2xl font-semibold">{user?.name || 'User Name'}</h1>
                <p className="text-blue-100">Patient</p>
              </div>
            </div>
          </div>
          <div className="pt-16 pb-6 px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FiCreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">UID</p>
                  <p className="text-gray-900 font-medium">{user?.uid || 'MED-2024-0123'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FiMail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FiPhone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900 font-medium">{user?.phone || '+1 (555) 000-0000'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Manage your Medicare information and documents.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className="text-3xl font-semibold">{stat.value}</span>
              </div>
              <h3 className="text-gray-600 font-medium mb-2">{stat.title}</h3>
              {stat.change && (
                <p className="text-sm text-green-600">
                  {stat.change} {stat.changeText}
                </p>
              )}
              {stat.status && (
                <p className="text-sm text-green-600">{stat.status}</p>
              )}
              {stat.nextDate && (
                <p className="text-sm text-purple-600">{stat.nextDate}</p>
              )}
              {stat.alert && (
                <p className="text-sm text-yellow-600">{stat.alert}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Medicare Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-4">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <FiFileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Medical Reports</h3>
                    <p className="text-gray-600 text-sm">Manage and view your medical documents</p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/upload'}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiUpload className="w-5 h-5" />
                  Upload New Report
                </button>
              </div>

              {/* Reports Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">All Reports</h4>
                  </div>
                  <p className="text-sm text-gray-600">{reports.length} documents</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiFileText className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-gray-900">Medical Reports</h4>
                  </div>
                  <p className="text-sm text-gray-600">{reports.filter(r => r.category === 'medical').length} documents</p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="medical">Medical Reports</option>
                  <option value="xrays">X-rays & Scans</option>
                  <option value="lab">Lab Results</option>
                  <option value="forms">Medical Forms</option>
                </select>
              </div>

              {/* Reports List */}
              <div className="min-h-[300px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading reports...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <div className="text-red-500 mb-4">
                      <FiAlertCircle className="w-12 h-12" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">{error}</p>
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <div className="text-gray-400 mb-4">
                      <FiFileText className="w-12 h-12" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">No reports found</p>
                    <p className="text-gray-600">Upload your first medical report to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports
                      .filter(report => {
                        const matchesSearch = 
                          (report.originalFilename?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                          (report.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
                        const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
                        return matchesSearch && matchesCategory;
                      })
                      .map((report, index) => (
                        <div key={report._id || index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                          <div className={`p-2 rounded-lg ${report.category === 'medical' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <FiFileText className={`w-5 h-5 ${report.category === 'medical' ? 'text-green-600' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{report.originalFilename || 'Unnamed File'}</h4>
                                <p className="text-sm text-gray-500">{report.description || 'No description provided'}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Date not available'} • {report.contentType || 'Unknown type'}
                                </p>
                              </div>
                              <button 
                                onClick={() => report.fileUrl ? window.open(report.fileUrl, '_blank') : toast.error('File URL not available')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!isLoading && !error && reports.length > 0 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Showing {reports.length} reports</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 font-medium">View</span>
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Claims History</h3>
              <p className="text-gray-600 text-sm mb-4">View your Medicare claims history</p>
              <button className="mt-auto text-green-600 hover:text-green-700 font-medium">
                View Details →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <FiCalendar className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-purple-600 font-medium">Available</span>
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Benefits Summary</h3>
              <p className="text-gray-600 text-sm mb-4">Review your Medicare benefits</p>
              <button className="mt-auto text-purple-600 hover:text-purple-700 font-medium">
                View Details →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <FiAlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-yellow-600 font-medium">Active</span>
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Coverage Details</h3>
              <p className="text-gray-600 text-sm mb-4">Check your coverage status</p>
              <button className="mt-auto text-yellow-600 hover:text-yellow-700 font-medium">
                View Details →
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All Activity
            </button>
          </div>
          <div className="space-y-6">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className={`p-2 rounded-lg ${activity.iconBg}`}>
                  <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium">{activity.title}</h3>
                  <p className="text-gray-600 text-sm">{activity.description}</p>
                </div>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
