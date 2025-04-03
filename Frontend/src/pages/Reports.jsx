import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiSearch, FiFilter, FiFile, FiDownload, FiEye, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import { useAuthStore } from '../store/authStore';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your reports');
      navigate('/login');
      return;
    }
    fetchReports();
  }, [isAuthenticated, navigate]);

  const fetchReports = async () => {
    if (!token) {
      toast.error('Please login to view your reports');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('/api/reports', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setReports(response.data.reports || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to view your reports');
        navigate('/login');
      } else {
        toast.error('Failed to load reports. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      console.log(`Attempting to delete report with ID: ${reportId}`);
      const response = await axios.delete(`/api/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      console.log('Delete response:', response.data);
      toast.success('Report deleted successfully');
      // Refresh the reports list
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('Report not found. It may have been already deleted.');
      } else {
        toast.error(`Failed to delete report: ${error.response?.data?.message || 'Unknown error'}`);
      }
    }
  };

  const handleDownload = (fileUrl, filename) => {
    if (!fileUrl) {
      toast.error('File URL not available');
      return;
    }
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename || 'report';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      (report.originalFilename?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (report.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    return matchesSearch;
  });

  const formatDate = (date) => {
    if (!date) return 'Date not available';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Medical Reports</h1>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/upload'}
          >
            <FiUpload className="w-5 h-5" />
            Upload New Report
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reports found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{report.originalFilename || 'Unnamed File'}</h3>
                    <p className="text-sm text-gray-500 mb-4">{report.description || 'No description provided'}</p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Uploaded:</span>{' '}
                        {formatDate(report.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Type:</span>{' '}
                        {report.contentType || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Size:</span>{' '}
                        {formatFileSize(report.fileSize)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => report.fileUrl ? window.open(report.fileUrl, '_blank') : toast.error('File URL not available')}
                      className="flex items-center justify-center py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="View Report"
                    >
                      <FiEye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    
                    <button
                      onClick={() => handleDownload(report.fileUrl, report.originalFilename)}
                      className="flex items-center justify-center py-2 px-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      title="Download Report"
                    >
                      <FiDownload className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="flex items-center justify-center py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Report"
                    >
                      <FiTrash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports; 