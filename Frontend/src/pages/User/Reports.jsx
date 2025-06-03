import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiSearch, FiFilter, FiFile, FiDownload, FiEye, FiTrash2, FiFileText, FiImage, FiClipboard, FiHardDrive, FiX, FiFolderPlus, FiEdit, FiAlertCircle, FiCheck, FiZoomIn, FiZoomOut, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/User/DashboardLayout';
import { useAuthStore } from '../../store/Patient/authStore';
import usePatientStore from '../../store/Patient/patientstore';
import { useDropzone } from 'react-dropzone';

const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }
`;
document.head.appendChild(style);

const StatCard = ({ title, count, subtitle, icon: Icon, iconColor, borderColor, showProgress, progressPercentage }) => {
  // Convert color classes
  const bgColorClass = borderColor.replace('border-', 'bg-').replace('-600', '-50');
  const textColorClass = iconColor;
  const hoverBgClass = borderColor.replace('border-', 'bg-').replace('-600', '-100');
  const hoverBorderClass = borderColor;
  
  return (
    <div 
      className={`rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-sm backdrop-blur-xl bg-white/80 border-2 border-transparent transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group hover:${hoverBorderClass}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs sm:text-sm font-medium ${textColorClass} mb-0.5 sm:mb-1 opacity-90 group-hover:opacity-100 transition-all`}>{title}</p>
          <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 ${textColorClass} transition-all group-hover:scale-105 origin-left`}>{count}</h3>
          {showProgress ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex-1 bg-gray-100 rounded-full h-1.5 sm:h-2.5 shadow-inner overflow-hidden">
                <div 
                  className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-500 ease-out ${
                    progressPercentage > 90 ? 'bg-red-500' : 
                    progressPercentage > 70 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <p className={`text-[10px] xs:text-xs font-medium ${textColorClass} opacity-80 group-hover:opacity-100 transition-all whitespace-nowrap`}>
                {progressPercentage > 90 ? 'Critical' : 
                 progressPercentage > 70 ? 'Warning' : 
                 `${progressPercentage}% used`}
              </p>
            </div>
          ) : (
            <p className={`text-xs sm:text-sm font-medium ${textColorClass} opacity-80 group-hover:opacity-100 transition-all`}>{subtitle}</p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${bgColorClass} group-hover:${hoverBgClass} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${textColorClass}`} />
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, report: null });
  const [previewModal, setPreviewModal] = useState({ show: false, report: null });
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadData, setUploadData] = useState({
    category: 'medical',
    description: '',
    title: ''
  });
  const [sectionModal, setSectionModal] = useState({ show: false, report: null });
  const [editModal, setEditModal] = useState({ show: false, report: null });
  const [editData, setEditData] = useState({ title: '', description: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [initialZoomLevel, setInitialZoomLevel] = useState(1);
  const imageContainerRef = useRef(null);
  const { token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Get state and actions from patient store
  const {
    reports,
    isLoading,
    error,
    fetchReports,
    uploadReport,
    deleteReport,
    moveReport,
    updateReport
  } = usePatientStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your reports');
      navigate('/login');
      return;
    }
    fetchReports(token);
  }, [isAuthenticated, navigate, token, fetchReports]);

  const handleDelete = async (reportId) => {
    const report = reports.find(r => r._id === reportId);
    setDeleteModal({ show: true, report });
  };

  const confirmDelete = async () => {
    if (!deleteModal.report) return;

    try {
      await deleteReport(token, deleteModal.report._id);
      toast.success('Report deleted successfully');
      setDeleteModal({ show: false, report: null });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error(error.response?.data?.message || 'Failed to delete report');
    }
  };

  const handleDownload = async (fileUrl, filename) => {
    if (!fileUrl) {
      toast.error('File URL not available');
      return;
    }

    try {
      const loadingToastId = toast.loading('Preparing download...');
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename || 'report';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.dismiss(loadingToastId);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  // Calculate statistics for the dashboard
  const totalReports = reports.length;
  const imageReports = reports.filter(report => 
    report.contentType.startsWith('image/')).length;
  const pdfReports = reports.filter(report => 
    report.contentType === 'application/pdf').length;
  const medicalReports = reports.filter(report => 
    report.category === 'medical').length;

  // Calculate total storage used (in bytes)
  const totalStorageUsed = reports.reduce((acc, report) => acc + (report.fileSize || 0), 0);
  const storageLimit = 3 * 1024 * 1024; // 3 MB in bytes
  const usedStorageInMB = (totalStorageUsed / (1024 * 1024)).toFixed(2);
  const storagePercentage = ((totalStorageUsed / storageLimit) * 100).toFixed(1);

  // Filter reports based on search and category
  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      (report.originalFilename?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (report.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'images') return matchesSearch && report.contentType.startsWith('image/');
    if (selectedFilter === 'pdf') return matchesSearch && report.contentType === 'application/pdf';
    if (selectedFilter === 'medical') return matchesSearch && report.category === 'medical';
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

  // Update the preview handler to handle all file types
  const handlePreviewClick = (report) => {
    setPreviewModal({
      show: true,
      report
    });
    // Reset zoom level and position when opening a new preview
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
  };

  // Close preview modal and reset zoom
  const handleClosePreview = () => {
    setPreviewModal({ show: false, report: null });
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB limit
        toast.error('File size must be less than 3MB');
        return;
      }
      setUploadFile(file);
    }
  };
  
  // Add drag and drop functionality
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        if (errors[0]?.code === 'file-too-large') {
          toast.error(`${file.name} is too large. Maximum size is 3MB.`);
        } else if (errors[0]?.code === 'file-invalid-type') {
          toast.error(`${file.name} is not a supported file type.`);
        } else {
          toast.error(`Error with ${file.name}: ${errors[0]?.message}`);
        }
      });
      return;
    }
    
    // Only use the first file if multiple are dropped
    const file = acceptedFiles[0];
    if (file) {
      setUploadFile(file);
      // Automatically set the title if it's empty
      if (!uploadData.title) {
        setUploadData(prevData => ({
          ...prevData,
          title: file.name
        }));
      }
    }
  }, [uploadData.title]);
  
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 3 * 1024 * 1024, // 3MB
    multiple: false,
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', uploadData.category);
    formData.append('description', uploadData.description);
    formData.append('title', uploadData.title || uploadFile.name);

    try {
      const uploadedReport = await uploadReport(token, formData);
      toast.success('Report uploaded successfully');
      setUploadModal(false);
      setSectionModal({ 
        show: true, 
        report: uploadedReport 
      });
      setUploadFile(null);
      setUploadData({ category: 'medical', description: '', title: '' });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload report');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSectionChange = async (reportId, newCategory) => {
    try {
      const loadingToast = toast.loading('Moving report...');
      await moveReport(token, reportId, newCategory);
      toast.dismiss(loadingToast);
      toast.success('Report moved successfully');
      setSectionModal({ show: false, report: null });
      setSelectedFilter(newCategory);
    } catch (error) {
      console.error('Error updating report section:', error);
      toast.error('Failed to move report');
    }
  };

  const handleUpdateReport = async (e) => {
    e.preventDefault();
    
    if (!editModal.report) return;
    if (!editData.title.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    
    setEditLoading(true);
    
    try {
      await updateReport(token, editModal.report._id, {
        title: editData.title,
        description: editData.description
      });
      
      toast.success('Report updated successfully');
      setEditModal({ show: false, report: null });
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error(error.response?.data?.message || 'Failed to update report');
    } finally {
      setEditLoading(false);
    }
  };

  // Function to calculate distance between two touch points
  const getTouchDistance = (touches) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Handle touch events for zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Starting pinch zoom
      setInitialPinchDistance(getTouchDistance(e.touches));
      setInitialZoomLevel(zoomLevel);
      e.preventDefault();
    } else if (zoomLevel > 1) {
      // Starting pan
      setIsDragging(true);
    }
  };
  
  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      // Handle pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / initialPinchDistance;
      const newZoom = Math.max(1, Math.min(3, initialZoomLevel * scale));
      setZoomLevel(newZoom);
      e.preventDefault();
    } else if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      // Handle pan
      const touch = e.touches[0];
      const container = imageContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        setDragPosition({
          x: (offsetX - container.clientWidth / 2) / zoomLevel,
          y: (offsetY - container.clientHeight / 2) / zoomLevel
        });
      }
      e.preventDefault(); // Prevent page scroll
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialPinchDistance(null);
  };

  // Handle mouse events for drag when zoomed
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      e.preventDefault(); // Prevent image drag behavior
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setDragPosition({
        x: dragPosition.x + e.movementX / zoomLevel,
        y: dragPosition.y + e.movementY / zoomLevel
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle double click for quick zoom toggle
  const handleDoubleClick = (e) => {
    // Reset or zoom in on double click
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setDragPosition({ x: 0, y: 0 });
    } else {
      setZoomLevel(2.5);
      // Zoom to clicked position
      const container = imageContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        setDragPosition({
          x: (offsetX - container.clientWidth / 2) / 2.5,
          y: (offsetY - container.clientHeight / 2) / 2.5
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-380 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">Medical Reports</h1>
            <p className="text-sm sm:text-base text-gray-500">Manage and organize your medical documents</p>
          </div>
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
            onClick={() => setUploadModal(true)}
          >
            <FiUpload className="w-4 h-4 sm:w-5 sm:h-5" />
            Upload New Report
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 bg-white/80 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-72">
            <FiFilter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full appearance-none pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm text-gray-700 cursor-pointer text-sm sm:text-base"
            >
              <option value="all">All Reports</option>
              <option value="images">Images Only</option>
              <option value="pdf">PDF Documents Only</option>
              <option value="medical">Medical Only</option>
            </select>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4">
          <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <StatCard
              title="Total Reports"
              count={totalReports}
              subtitle="All documents"
              icon={FiFileText}
              iconColor="text-blue-600"
              borderColor="border-blue-600"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <StatCard
              title="Images"
              count={imageReports}
              subtitle="X-rays, scans"
              icon={FiImage}
              iconColor="text-purple-600"
              borderColor="border-purple-600"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <StatCard
              title="PDF Documents"
              count={pdfReports}
              subtitle="Documents, forms"
              icon={FiFile}
              iconColor="text-red-600"
              borderColor="border-red-600"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <StatCard
              title="Medical Reports"
              count={medicalReports}
              subtitle="Lab results"
              icon={FiClipboard}
              iconColor="text-green-600"
              borderColor="border-green-600"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <StatCard
              title="Storage Used"
              count={`${usedStorageInMB} / 3 MB`}
              subtitle={`${storagePercentage}% of limit`}
              icon={FiHardDrive}
              iconColor="text-teal-600"
              borderColor="border-teal-600"
              showProgress={true}
              progressPercentage={parseFloat(storagePercentage)}
            />
          </div>
        </div>

        {/* Filter Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-1 sm:px-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"></span>
            <span className="text-xs sm:text-sm text-gray-600">
              Showing: {' '}
              <span className="font-medium text-gray-900">
                {selectedFilter === 'all' && 'All Reports'}
                {selectedFilter === 'images' && 'Image Reports Only'}
                {selectedFilter === 'pdf' && 'PDF Documents Only'}
                {selectedFilter === 'medical' && 'Medical Reports Only'}
              </span>
              {searchQuery && (
                <>
                  {' '}• Filtered by "<span className="font-medium text-gray-900">{searchQuery}</span>"
                </>
              )}
            </span>
          </div>
          {(selectedFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchQuery('');
              }}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Reports Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No reports found</p>
            <p className="text-gray-400 mt-2">Upload a new report or try a different search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-white/80 backdrop-blur-xl p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-100"
              >
                <div className="flex flex-col h-full">
                  {/* Preview Section */}
                  <div 
                    className="mb-3 sm:mb-4 h-28 sm:h-32 md:h-36 lg:h-40 bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity group relative"
                    onClick={() => handlePreviewClick(report)}
                  >
                    {report.contentType?.startsWith('image/') ? (
                      <>
                        <img 
                          src={report.fileUrl} 
                          alt={report.originalFilename}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <FiEye className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                      </>
                    ) : report.contentType === 'application/pdf' ? (
                      <div className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 group-hover:scale-110 transition-transform">
                        <FiFile className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-500 mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-gray-500">PDF Document</span>
                      </div>
                    ) : report.category === 'medical' ? (
                      <div className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 group-hover:scale-110 transition-transform">
                        <FiClipboard className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-500 mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-gray-500">Medical Report</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 group-hover:scale-110 transition-transform">
                        <FiFileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-500 mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-gray-500">Document</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">{report.originalFilename || 'Unnamed File'}</h3>
                    
                    {/* Category badge */}
                    <div className="mb-1.5 sm:mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${
                        report.category === 'medical' ? 'bg-green-100 text-green-800' : 
                        report.category === 'lab' ? 'bg-purple-100 text-purple-800' : 
                        report.category === 'prescription' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-2">{report.description || 'No description provided'}</p>
                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 sm:gap-2">
                        <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-400"></span>
                        </span>
                        {formatDate(report.createdAt)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 sm:gap-2">
                        <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-400"></span>
                        </span>
                        {formatFileSize(report.fileSize)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex gap-1.5 sm:gap-2">
                    <button
                      onClick={() => {
                        setEditModal({ 
                          show: true, 
                          report 
                        });
                        setEditData({
                          title: report.originalFilename || '',
                          description: report.description || ''
                        });
                      }}
                      className="flex-1 flex items-center justify-center py-2 sm:py-2.5 px-2 sm:px-4 bg-yellow-50 text-yellow-600 rounded-lg sm:rounded-xl hover:bg-yellow-100 transition-colors font-medium text-xs sm:text-sm"
                    >
                      <FiEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline-block">Edit</span>
                    </button>
                    
                    <button
                      onClick={() => report.fileUrl ? window.open(report.fileUrl, '_blank') : toast.error('File URL not available')}
                      className="flex-1 flex items-center justify-center py-2 sm:py-2.5 px-2 sm:px-4 bg-gray-50 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors font-medium text-xs sm:text-sm"
                    >
                      <FiEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline-block">View</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownload(report.fileUrl, report.originalFilename)}
                      className="flex items-center justify-center p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-100 transition-colors"
                      title="Download Report"
                    >
                      <FiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="flex items-center justify-center p-2 sm:p-2.5 bg-red-50 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-100 transition-colors"
                      title="Delete Report"
                    >
                      <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Choose Button */}
                  <button
                    onClick={() => setSectionModal({ show: true, report })}
                    className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      report.category === 'medical' ? 'bg-green-600 text-white hover:bg-green-700' :
                      report.category === 'lab' ? 'bg-purple-600 text-white hover:bg-purple-700' :
                      report.category === 'prescription' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                      'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    <FiFolderPlus className="w-4 h-4" />
                    Choose
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {previewModal.show && previewModal.report && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in-up"
            onClick={() => handleClosePreview()}
          >
            <div 
              className="relative w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="w-full p-3 sm:p-4 md:p-5 flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-white to-gray-50">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {previewModal.report.contentType?.startsWith('image/') ? (
                    <div className="p-1.5 sm:p-2 rounded-lg bg-purple-50 text-purple-600">
                      <FiImage className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                  ) : previewModal.report.contentType === 'application/pdf' ? (
                    <div className="p-1.5 sm:p-2 rounded-lg bg-red-50 text-red-600">
                      <FiFile className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                  ) : previewModal.report.category === 'medical' ? (
                    <div className="p-1.5 sm:p-2 rounded-lg bg-green-50 text-green-600">
                      <FiClipboard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                  ) : (
                    <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50 text-blue-600">
                      <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                      {previewModal.report.originalFilename}
                    </h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                      <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${
                        previewModal.report.category === 'medical' ? 'bg-green-100 text-green-800' : 
                        previewModal.report.category === 'lab' ? 'bg-purple-100 text-purple-800' : 
                        previewModal.report.category === 'prescription' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {previewModal.report.category.charAt(0).toUpperCase() + previewModal.report.category.slice(1)}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500 truncate">
                        Uploaded on {formatDate(previewModal.report.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handleDownload(previewModal.report.fileUrl, previewModal.report.originalFilename)}
                    className="flex items-center justify-center p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-colors"
                    title="Download"
                  >
                    <FiDownload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => window.open(previewModal.report.fileUrl, '_blank')}
                    className="flex items-center justify-center p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors"
                    title="Open in New Tab"
                  >
                    <FiEye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleClosePreview()}
                    className="flex items-center justify-center p-1.5 sm:p-2 hover:bg-red-50 rounded-lg sm:rounded-xl transition-colors ml-1 sm:ml-2"
                    title="Close"
                  >
                    <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Main Content Area with Sidebar - Responsive Layout */}
              <div className="flex flex-col lg:flex-row overflow-hidden">
                {/* Content Area - Takes full width on mobile, switches to right side on desktop */}
                <div className="order-1 lg:order-2 flex-1 overflow-auto bg-gray-900 min-h-[30vh] sm:min-h-[40vh] lg:min-h-0">
                  {previewModal.report.contentType?.startsWith('image/') ? (
                    <div className="w-full h-full flex items-center justify-center p-3 sm:p-4 bg-[#1c1c1c] relative overflow-hidden" ref={imageContainerRef}>
                      <img
                        src={previewModal.report.fileUrl}
                        alt={previewModal.report.originalFilename}
                        className="max-w-full max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(90vh-8rem)] object-contain rounded-lg shadow-2xl transition-all duration-200 select-none"
                        style={{ 
                          transform: `scale(${zoomLevel}) translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                          cursor: zoomLevel > 1 ? 'grab' : 'default',
                          touchAction: zoomLevel > 1 ? 'none' : 'auto'
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onDoubleClick={handleDoubleClick}
                      />
                      
                      {/* Zoom control buttons */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
                        <button
                          onClick={() => {
                            if (zoomLevel < 3) {
                              setZoomLevel(zoomLevel + 0.5);
                            }
                          }}
                          className="p-2 sm:p-2.5 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-all"
                          title="Zoom In"
                          disabled={zoomLevel >= 3}
                        >
                          <FiZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (zoomLevel > 1) {
                              setZoomLevel(Math.max(1, zoomLevel - 0.5));
                              if (zoomLevel <= 1.5) {
                                setDragPosition({ x: 0, y: 0 });
                              }
                            }
                          }}
                          className="p-2 sm:p-2.5 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-all"
                          title="Zoom Out"
                          disabled={zoomLevel <= 1}
                        >
                          <FiZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (zoomLevel === 1) {
                              setZoomLevel(2.5);
                            } else {
                              setZoomLevel(1);
                              setDragPosition({ x: 0, y: 0 });
                            }
                          }}
                          className="p-2 sm:p-2.5 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-all"
                          title={zoomLevel === 1 ? "Fit to Screen" : "Reset Zoom"}
                        >
                          {zoomLevel === 1 ? 
                            <FiMaximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : 
                            <FiMinimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          }
                        </button>
                      </div>
                      
                      {/* Current zoom level indicator */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 py-1 px-2 sm:py-1.5 sm:px-2.5 bg-black/40 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full">
                        {Math.round(zoomLevel * 100)}%
                      </div>

                      <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => window.open(previewModal.report.fileUrl, '_blank')}
                          className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                          title="Open Original"
                        >
                          <FiEye className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleDownload(previewModal.report.fileUrl, previewModal.report.originalFilename)}
                          className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                          title="Download"
                        >
                          <FiDownload className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                        </button>
                      </div>
                      
                      {/* Touch instructions */}
                      {zoomLevel === 1 && (
                        <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 py-1 px-2 sm:py-1.5 sm:px-2.5 bg-black/40 backdrop-blur-sm text-white text-[10px] sm:text-xs rounded-full opacity-70">
                          Double-tap to zoom
                        </div>
                      )}
                    </div>
                  ) : previewModal.report.contentType === 'application/pdf' ? (
                    <div className="w-full h-full relative">
                      <iframe
                        src={`${previewModal.report.fileUrl}#toolbar=0&navpanes=0`}
                        title={previewModal.report.originalFilename}
                        className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[calc(90vh-6rem)]"
                      />
                      <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => window.open(previewModal.report.fileUrl, '_blank')}
                          className="p-2 sm:p-3 bg-white/90 shadow-lg rounded-full hover:bg-white transition-all"
                          title="Open Original"
                        >
                          <FiEye className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-800" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-4 md:p-8 text-center bg-linear-to-b from-gray-900 to-gray-800">
                      <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl border border-white/5 max-w-2xl w-full transform transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-500/10">
                        <div className="mb-4 sm:mb-6 p-4 sm:p-5 rounded-full bg-white/5 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 mx-auto flex items-center justify-center">
                          {previewModal.report.category === 'medical' ? (
                            <FiClipboard className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-green-400" />
                          ) : previewModal.report.category === 'lab' ? (
                            <FiFileText className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-purple-400" />
                          ) : previewModal.report.category === 'prescription' ? (
                            <FiFile className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-blue-400" />
                          ) : (
                            <FiFileText className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-gray-400" />
                          )}
                        </div>
                        <h4 className="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
                          {previewModal.report.originalFilename}
                        </h4>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs ${
                            previewModal.report.category === 'medical' ? 'bg-green-900/50 text-green-300' : 
                            previewModal.report.category === 'lab' ? 'bg-purple-900/50 text-purple-300' : 
                            previewModal.report.category === 'prescription' ? 'bg-blue-900/50 text-blue-300' : 
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {previewModal.report.category.charAt(0).toUpperCase() + previewModal.report.category.slice(1)}
                          </span>
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/10 text-gray-300 text-xs">
                            {formatFileSize(previewModal.report.fileSize)}
                          </span>
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/10 text-gray-300 text-xs">
                            {previewModal.report.contentType || "Unknown file type"}
                          </span>
                        </div>
                        <p className="text-gray-300 max-w-lg mx-auto mb-6 pb-4 sm:pb-6 border-b border-white/10 text-xs sm:text-sm md:text-base">
                          {previewModal.report.description || 'No description provided'}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                          <button
                            onClick={() => window.open(previewModal.report.fileUrl, '_blank')}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-800 text-white rounded-lg sm:rounded-xl hover:bg-gray-700 transition-colors font-medium border border-white/10 text-sm"
                          >
                            <FiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Open File
                          </button>
                          <button
                            onClick={() => handleDownload(previewModal.report.fileUrl, previewModal.report.originalFilename)}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600/90 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-colors font-medium text-sm"
                          >
                            <FiDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sidebar - Now below on mobile, left side on desktop */}
                <div className="order-2 lg:order-1 w-full lg:w-80 border-t lg:border-t-0 lg:border-r border-gray-200 bg-gray-50/80 overflow-auto max-h-[40vh] lg:max-h-[calc(90vh-6rem)]">
                  <div className="p-3 sm:p-4 md:p-5">
                    <h4 className="font-semibold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">File Information</h4>
                    
                    <div className="space-y-4 sm:space-y-6">
                      {/* Basic Info */}
                      <div>
                        <h5 className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-medium mb-2 sm:mb-3">Basic Information</h5>
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">File Name</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 break-all">{previewModal.report.originalFilename}</p>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Category</p>
                            <p className="text-xs sm:text-sm font-medium">
                              <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium ${
                                previewModal.report.category === 'medical' ? 'bg-green-100 text-green-800' : 
                                previewModal.report.category === 'lab' ? 'bg-purple-100 text-purple-800' : 
                                previewModal.report.category === 'prescription' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {previewModal.report.category.charAt(0).toUpperCase() + previewModal.report.category.slice(1)}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Description</p>
                            <p className="text-xs sm:text-sm text-gray-700">{previewModal.report.description || 'No description provided'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Technical Details */}
                      <div>
                        <h5 className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-medium mb-2 sm:mb-3">Technical Details</h5>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between">
                            <p className="text-xs sm:text-sm text-gray-500">File Size</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">{formatFileSize(previewModal.report.fileSize)}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-xs sm:text-sm text-gray-500">File Type</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              {previewModal.report.contentType?.split('/')[1]?.toUpperCase() || 'Unknown'}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-xs sm:text-sm text-gray-500">MIME Type</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">{previewModal.report.contentType || 'Unknown'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Timeline */}
                      <div>
                        <h5 className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-medium mb-2 sm:mb-3">Timeline</h5>
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-50 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></span>
                              </div>
                              <div>
                                <p className="text-[10px] sm:text-xs text-gray-500">Uploaded</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-900">{formatDate(previewModal.report.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                          {previewModal.report.updatedAt && previewModal.report.updatedAt !== previewModal.report.createdAt && (
                            <div>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"></span>
                                </div>
                                <div>
                                  <p className="text-[10px] sm:text-xs text-gray-500">Last Modified</p>
                                  <p className="text-xs sm:text-sm font-medium text-gray-900">{formatDate(previewModal.report.updatedAt)}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions - Responsive grid */}
                      <div>
                        <h5 className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-medium mb-2 sm:mb-3">Actions</h5>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <button
                            onClick={() => window.open(previewModal.report.fileUrl, '_blank')}
                            className="flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl text-gray-800 font-medium text-xs transition-colors"
                          >
                            <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                            Open
                          </button>
                          <button
                            onClick={() => handleDownload(previewModal.report.fileUrl, previewModal.report.originalFilename)}
                            className="flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 bg-blue-50 hover:bg-blue-100 rounded-lg sm:rounded-xl text-blue-700 font-medium text-xs transition-colors"
                          >
                            <FiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                            Download
                          </button>
                          <button
                            onClick={() => setSectionModal({ show: true, report: previewModal.report })}
                            className="flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 bg-green-50 hover:bg-green-100 rounded-lg sm:rounded-xl text-green-700 font-medium text-xs transition-colors col-span-1 sm:col-span-2"
                          >
                            <FiFolderPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                            Change Category
                          </button>
                          <button
                            onClick={() => {
                              setPreviewModal({ show: false, report: null });
                              setDeleteModal({ show: true, report: previewModal.report });
                            }}
                            className="flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 bg-red-50 hover:bg-red-100 rounded-lg sm:rounded-xl text-red-700 font-medium text-xs transition-colors col-span-1 sm:col-span-2"
                          >
                            <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            Delete Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                      </div>
                    </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Confirm Delete</h3>
                <button
                  onClick={() => setDeleteModal({ show: false, report: null })}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 bg-red-50 rounded-xl mb-6">
                <p className="text-base text-gray-700 mb-2">
                  Are you sure you want to delete "{deleteModal.report?.originalFilename || 'this report'}"?
                </p>
                <p className="text-sm text-red-600 font-medium">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, report: null })}
                  className="px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {uploadModal && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
            onClick={() => setUploadModal(false)}
          >
            <div 
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-1">Upload New Report</h3>
                  <p className="text-gray-500 text-sm">Add your medical documents, images, or PDFs</p>
                </div>
                <button
                  onClick={() => setUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2.5 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload File
                    </label>
                    <span className="text-xs text-gray-500">Max size: 3MB</span>
                  </div>
                  <div {...getRootProps()} className="flex items-center justify-center w-full">
                    <div className={`w-full flex flex-col items-center px-8 py-10 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
                      ${isDragActive ? 'bg-blue-50 border-blue-400 shadow-md' : 'bg-gray-50/80 border-gray-300'}
                      ${isDragAccept ? 'bg-green-50 border-green-500' : ''}
                      ${isDragReject ? 'bg-red-50 border-red-500' : ''}
                      ${!isDragActive ? 'hover:border-blue-500 hover:bg-blue-50/50' : ''}
                      group
                    `}>
                      <input {...getInputProps()} />
                      <div className={`p-4 rounded-2xl transition-all duration-200 mb-4 group-hover:scale-110 ${
                        isDragReject ? 'bg-red-100 text-red-500' : 
                        isDragAccept ? 'bg-green-100 text-green-500' : 
                        'bg-blue-50 group-hover:bg-blue-100/80 text-blue-500'
                      }`}>
                        {isDragReject ? (
                          <FiAlertCircle className="w-8 h-8" />
                        ) : isDragAccept ? (
                          <FiCheck className="w-8 h-8" />
                        ) : uploadFile ? (
                          <FiFile className="w-8 h-8" />
                        ) : (
                          <FiUpload className="w-8 h-8" />
                        )}
                      </div>
                      <div className="text-center">
                        {isDragActive ? (
                          <span className="text-sm font-medium mb-1 block">
                            {isDragReject 
                              ? "This file type is not supported" 
                              : "Drop the file here"}
                          </span>
                        ) : (
                        <span className="text-sm font-medium text-gray-700 mb-1 block">
                          {uploadFile ? (
                            <span className="text-blue-600">{uploadFile.name}</span>
                          ) : (
                            'Drag and drop your file here'
                          )}
                        </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {!uploadFile && !isDragActive && 'or click to browse'}
                          {isDragActive && isDragAccept && 'File will be uploaded when you drop it'}
                        </span>
                      </div>
                      {uploadFile && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <span className="px-2 py-1 rounded-full bg-gray-100">
                            {formatFileSize(uploadFile.size)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setUploadFile(null);
                            }}
                            className="px-2 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/80 appearance-none text-gray-700"
                      placeholder={uploadFile ? uploadFile.name : "Enter a title for your report"}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={uploadData.category}
                          onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/80 appearance-none pr-10 text-gray-700"
                        >
                          <option value="medical">Medical Report</option>
                          <option value="lab">Lab Result</option>
                          <option value="prescription">Prescription</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={uploadData.description}
                        onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/80 resize-none text-gray-700"
                        rows="3"
                        placeholder="Enter a brief description..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setUploadModal(false)}
                    className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadLoading || !uploadFile}
                    className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl transition-all ${
                      uploadLoading || !uploadFile 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:transform active:scale-95'
                    }`}
                  >
                    {uploadLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="font-medium">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FiUpload className="w-5 h-5" />
                        <span className="font-medium">Upload Report</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Section Selection Modal */}
        {sectionModal.show && sectionModal.report && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSectionModal({ show: false, report: null })}
          >
            <div 
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full shadow-2xl border border-white/20 transform transition-all duration-500 animate-fade-in-up"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-1">Organize Your Report</h3>
                  <p className="text-gray-500 text-sm">Choose a section to move your report to</p>
                </div>
                <button
                  onClick={() => setSectionModal({ show: false, report: null })}
                  className="text-gray-500 hover:text-gray-700 p-2.5 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* File Preview Section */}
                <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-xl ${
                      sectionModal.report.contentType?.startsWith('image/') ? 'bg-purple-50 text-purple-600' :
                      sectionModal.report.contentType === 'application/pdf' ? 'bg-red-50 text-red-600' :
                      sectionModal.report.category === 'medical' ? 'bg-green-50 text-green-600' :
                      'bg-blue-50 text-blue-600'
                    } transform transition-all duration-300 hover:scale-105`}>
                      {sectionModal.report.contentType?.startsWith('image/') ? (
                        <FiImage className="w-10 h-10" />
                      ) : sectionModal.report.contentType === 'application/pdf' ? (
                        <FiFile className="w-10 h-10" />
                      ) : sectionModal.report.category === 'medical' ? (
                        <FiClipboard className="w-10 h-10" />
                      ) : (
                        <FiFileText className="w-10 h-10" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {sectionModal.report.originalFilename}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {sectionModal.report.description || 'No description provided'}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sectionModal.report.contentType?.startsWith('image/') ? 'bg-purple-100 text-purple-700' :
                          sectionModal.report.contentType === 'application/pdf' ? 'bg-red-100 text-red-700' :
                          sectionModal.report.category === 'medical' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {sectionModal.report.contentType?.split('/')[1]?.toUpperCase() || 'Unknown'}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* File Information */}
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">File Details</p>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                {formatFileSize(sectionModal.report.fileSize)}
                              </p>
                              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                {sectionModal.report.contentType?.split('/')[1]?.toUpperCase() || 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Current Section</p>
                            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                              {sectionModal.report.category.charAt(0).toUpperCase() + sectionModal.report.category.slice(1)}
                            </p>
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Upload Information</p>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                Uploaded: {formatDate(sectionModal.report.createdAt)}
                              </p>
                              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                Last Modified: {formatDate(sectionModal.report.updatedAt)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => window.open(sectionModal.report.fileUrl, '_blank')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <FiEye className="w-4 h-4" />
                            Preview
                          </button>
                          <button
                            onClick={() => handleDownload(sectionModal.report.fileUrl, sectionModal.report.originalFilename)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <FiDownload className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Selection */}
                <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Select a Section</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleSectionChange(sectionModal.report._id, 'medical')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        sectionModal.report.category === 'medical' 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-white border-gray-200 hover:border-green-200 hover:bg-green-50/50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-50 text-green-600">
                          <FiClipboard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Medical Reports</p>
                          <p className="text-xs text-gray-500">
                            {reports.filter(r => r.category === 'medical').length} reports
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSectionChange(sectionModal.report._id, 'lab')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        sectionModal.report.category === 'lab' 
                          ? 'bg-purple-50 border-purple-200 text-purple-700' 
                          : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                          <FiFileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Lab Results</p>
                          <p className="text-xs text-gray-500">
                            {reports.filter(r => r.category === 'lab').length} reports
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSectionChange(sectionModal.report._id, 'prescription')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        sectionModal.report.category === 'prescription' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          <FiFile className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Prescriptions</p>
                          <p className="text-xs text-gray-500">
                            {reports.filter(r => r.category === 'prescription').length} reports
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSectionChange(sectionModal.report._id, 'other')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        sectionModal.report.category === 'other' 
                          ? 'bg-gray-50 border-gray-200 text-gray-700' 
                          : 'bg-white border-gray-200 hover:border-gray-200 hover:bg-gray-50/50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                          <FiHardDrive className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Other Documents</p>
                          <p className="text-xs text-gray-500">
                            {reports.filter(r => r.category === 'other').length} reports
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Select a section to move this report
                </div>
                <button
                  onClick={() => setSectionModal({ show: false, report: null })}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Report Modal */}
        {editModal.show && editModal.report && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
            onClick={() => setEditModal({ show: false, report: null })}
          >
            <div 
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-1">Edit Report Details</h3>
                  <p className="text-gray-500 text-sm">Update title and description for this report</p>
                </div>
                <button
                  onClick={() => setEditModal({ show: false, report: null })}
                  className="text-gray-500 hover:text-gray-700 p-2.5 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateReport} className="space-y-6">
                {/* File Preview */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`p-3 rounded-xl ${
                    editModal.report.contentType?.startsWith('image/') ? 'bg-purple-50 text-purple-600' :
                    editModal.report.contentType === 'application/pdf' ? 'bg-red-50 text-red-600' :
                    editModal.report.category === 'medical' ? 'bg-green-50 text-green-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {editModal.report.contentType?.startsWith('image/') ? (
                      <FiImage className="w-6 h-6" />
                    ) : editModal.report.contentType === 'application/pdf' ? (
                      <FiFile className="w-6 h-6" />
                    ) : editModal.report.category === 'medical' ? (
                      <FiClipboard className="w-6 h-6" />
                    ) : (
                      <FiFileText className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500">Original filename</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{editModal.report.originalFilename}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    editModal.report.category === 'medical' ? 'bg-green-100 text-green-800' : 
                    editModal.report.category === 'lab' ? 'bg-purple-100 text-purple-800' : 
                    editModal.report.category === 'prescription' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {editModal.report.category.charAt(0).toUpperCase() + editModal.report.category.slice(1)}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="transition-all duration-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Report Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter a descriptive title for your report"
                      disabled={editLoading}
                      required
                    />
                  </div>

                  <div className="transition-all duration-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Add details about this report to help you identify it later"
                      rows="4"
                      disabled={editLoading}
                    />
                  </div>
                </div>

                <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditModal({ show: false, report: null })}
                    className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors hover:bg-gray-50 rounded-xl"
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading || !editData.title.trim()}
                    className={`flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl transition-all ${
                      editLoading || !editData.title.trim()
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-500/20 active:transform active:scale-95'
                    }`}
                  >
                    {editLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="font-medium">Updating...</span>
                      </>
                    ) : (
                      <>
                        <FiEdit className="w-5 h-5" />
                        <span className="font-medium">Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;