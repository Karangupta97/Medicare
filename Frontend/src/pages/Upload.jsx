import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiCheck, FiAlertCircle, FiFile } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import { useAuthStore } from '../store/authStore';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [category, setCategory] = useState('xrays');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { token, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsLoading(true);
        // Only check auth if not already authenticated
        if (!isAuthenticated) {
          await checkAuth();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        toast.error('Authentication failed. Please login again.');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []); // Empty dependency array to run only once on mount

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        if (errors[0]?.code === 'file-too-large') {
          toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        } else if (errors[0]?.code === 'file-invalid-type') {
          toast.error(`${file.name} is not a supported file type.`);
        } else {
          toast.error(`Error with ${file.name}: ${errors[0]?.message}`);
        }
      });
    }

    // Filter out files that are already in the list
    const newFiles = acceptedFiles.filter(
      (file) => !files.some((f) => f.name === file.name)
    );
    
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/dicom': ['.dcm'],
    },
    maxSize: 10485760, // 10MB
    multiple: true,
  });

  const removeFile = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleUpload = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to upload reports');
      navigate('/login');
      return;
    }

    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    if (!title.trim()) {
      toast.error('Please provide a title for your report');
      return;
    }

    setUploading(true);
    setUploadProgress({});

    try {
      const formData = new FormData();
      // Only upload the first file since we're using single file upload
      formData.append('file', files[0]);
      formData.append('description', description || `Uploaded on ${new Date().toLocaleDateString()}`);
      formData.append('category', category);

      const response = await axios.post('/api/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({
            ...prev,
            total: percentCompleted,
          }));
        },
      });

      toast.success('Report uploaded successfully!');
      setFiles([]);
      setDescription('');
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(
          error.response?.data?.message || 'Failed to upload report. Please try again.'
        );
      }
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload Medical Reports</h1>
          <p className="text-gray-600 mb-6">
            Upload your medical reports securely. Supported formats: PDF, JPG, PNG, DICOM.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a title for your report"
              disabled={uploading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            >
              <option value="medical">Medical Reports</option>
              <option value="xrays">X-rays & Scans</option>
              <option value="lab">Lab Results</option>
              <option value="forms">Medical Forms</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a description for your report"
              rows="3"
              disabled={uploading}
            />
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} disabled={uploading} />
            <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag and drop files here, or click to select files
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: 10MB
                </p>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Selected Files ({files.length})
              </h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FiFile className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file)}
                      className="text-gray-500 hover:text-red-500"
                      disabled={uploading}
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0 || !title.trim()}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                uploading || files.length === 0 || !title.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                'Upload Reports'
              )}
            </button>
          </div>

          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.total}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {uploadProgress.total}% Complete
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Upload Guidelines
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>
                Supported file formats: PDF, JPG, PNG, DICOM (medical imaging)
              </span>
            </li>
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Maximum file size: 10MB per file</span>
            </li>
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>
                Your files are encrypted and stored securely in AWS S3
              </span>
            </li>
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>
                Only you and authorized healthcare providers can access your reports
              </span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload; 