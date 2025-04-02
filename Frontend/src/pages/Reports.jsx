import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import axios from "axios";
import {
  FiUploadCloud,
  FiFile,
  FiEye,
  FiDownload,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiMoreVertical,
  FiX,
  FiInfo,
} from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";

const Reports = () => {
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userReports, setUserReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [skipDeleteConfirmation, setSkipDeleteConfirmation] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [reportDescription, setReportDescription] = useState("");
  
  // Define storage limit (in bytes) - 50MB limit
  const STORAGE_LIMIT = 50 * 1024 * 1024; 
  
  // Calculate total used storage
  const calculateUsedStorage = () => {
    return userReports.reduce(
      (total, report) => total + (report.fileSize || 0),
      0
    );
  };
  
  // Check if file will exceed storage limit
  const willExceedStorageLimit = (fileSize) => {
    const currentUsage = calculateUsedStorage();
    return currentUsage + fileSize > STORAGE_LIMIT;
  };

  useEffect(() => {
    // Load user preference for delete confirmation from localStorage
    try {
      const savedPreference = localStorage.getItem("skipDeleteConfirmation");
      console.log("Loading saved preference:", savedPreference);
      if (savedPreference === "true") {
        setSkipDeleteConfirmation(true);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    if (user?.uid) {
      fetchUserReports();
    }
  }, [user]);

  const fetchUserReports = async () => {
    try {
      setIsLoading(true);
      const userId = user.id || user._id || user.uid;
      const response = await axios.get(`/api/reports/user/${userId}`, {
        withCredentials: true,
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

    // Check if file will exceed storage limit
    if (willExceedStorageLimit(file.size)) {
      setErrorMessage(`Cannot upload file. You've reached your ${(STORAGE_LIMIT / (1024 * 1024)).toFixed(0)}MB storage limit. Please delete some files to free up space.`);
      setUploadStatus("error");
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);
      return;
    }

    // Instead of uploading immediately, store the file and show the type selection modal
    setFileToUpload(file);
    setSelectedFile(file);

    // Auto-select a default report type based on file extension
    const suggestedType = getReportType(file.name);
    setSelectedReportType(suggestedType);

    // Set a default description but allow users to change it
    setReportDescription(`Uploaded on ${new Date().toLocaleDateString()}`);

    // Show the selection modal
    setShowTypeSelection(true);
  };

  const confirmUpload = async () => {
    if (!fileToUpload || !selectedReportType) return;

    // Final check to make sure the file doesn't exceed storage limit
    if (willExceedStorageLimit(fileToUpload.size)) {
      setShowTypeSelection(false);
      setErrorMessage(`Cannot upload file. You've reached your ${(STORAGE_LIMIT / (1024 * 1024)).toFixed(0)}MB storage limit. Please delete some files to free up space.`);
      setUploadStatus("error");
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);
      return;
    }

    setShowTypeSelection(false);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrorMessage("");

    const userId = user.id || user._id || user.uid;
    const formData = new FormData();
    
    // Generate a well-formatted date-time string for the filename
    const now = new Date();
    const dateTimeFormatted = now.toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_');
    
    // Get original file components
    const fileExt = fileToUpload.name.split('.').pop().toLowerCase();
    const fileNameWithoutExt = fileToUpload.name.substring(0, fileToUpload.name.lastIndexOf('.'));
    
    // Create a clean version of original filename (remove special chars)
    const cleanOriginalName = fileNameWithoutExt
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .substring(0, 50); // Limit length
    
    // Get username or user identifier for file naming
    const userIdentifier = user.username || 
                          (user.email ? user.email.split('@')[0] : null) || 
                          userId.substring(0, 8);
    
    // Create the new filename with format: username_originalName_YYYY-MM-DD_HH-MM-SS.ext
    const s3Filename = `${userIdentifier}_${cleanOriginalName}_${dateTimeFormatted}.${fileExt}`;
    
    // Create a new File object with the modified name
    const modifiedFile = new File([fileToUpload], s3Filename, { type: fileToUpload.type });
    
    formData.append("report", modifiedFile);
    formData.append("userId", userId);
    formData.append("reportType", selectedReportType);
    formData.append("description", reportDescription);
    formData.append("originalFilename", fileToUpload.name); // Store original filename for display
    formData.append("uploadDateTime", now.toISOString()); // Store exact upload time in ISO format
    formData.append("s3Filename", s3Filename); // Store the actual S3 filename

    try {
      const response = await axios.post("/api/reports/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setUserReports((prevReports) => [response.data, ...prevReports]);
      setUploadStatus("success");
      setTimeout(() => {
        setUploadStatus(null);
        setSelectedFile(null);
        setFileToUpload(null);
      }, 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to upload file. Please try again."
      );
    }
  };

  const cancelUpload = () => {
    setShowTypeSelection(false);
    setSelectedFile(null);
    setFileToUpload(null);
    setSelectedReportType("");
    setReportDescription("");
  };

  const initiateDeleteReport = (reportId, reportName) => {
    // Check current preference
    const currentPreference = localStorage.getItem("skipDeleteConfirmation");
    const shouldSkipConfirmation = currentPreference === "true";

    console.log("Delete initiated for report:", reportId);
    console.log("Skip confirmation preference:", shouldSkipConfirmation);

    if (shouldSkipConfirmation) {
      console.log("Skipping confirmation and deleting directly");
      // If user has chosen to skip confirmation, delete directly
      performDeleteReport(reportId);
    } else {
      console.log("Showing confirmation dialog");
      // Otherwise show the confirmation dialog
      setReportToDelete({
        id: reportId,
        name: reportName,
      });
      setShowDeleteConfirm(true);
    }
  };

  const performDeleteReport = async (reportId) => {
    try {
      setIsDeletingFile(true);
      setErrorMessage("");
      console.log(
        `Attempting to delete report ${reportId} from S3 and database`
      );

      // Send delete request to API with a query parameter to confirm S3 deletion
      const response = await axios.delete(
        `/api/reports/${reportId}?deleteFromS3=true`,
        {
          withCredentials: true,
        }
      );

      console.log("Delete response:", response.data);

      // Update UI
      setUserReports((prevReports) =>
        prevReports.filter((report) => report._id !== reportId)
      );
      setShowDeleteConfirm(false);
      setReportToDelete(null);

      // Show success message
      setUploadStatus("delete-success");
      setTimeout(() => {
        setUploadStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting report:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to delete report. Please try again.";
      console.error(errorMsg);
      setErrorMessage(errorMsg);
      setShowDeleteConfirm(false);

      // Show error message
      setUploadStatus("error");
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);
    } finally {
      setIsDeletingFile(false);
    }
  };

  const handleDontShowAgain = (checked) => {
    console.log("Setting skipDeleteConfirmation to:", checked);
    setSkipDeleteConfirmation(checked);
    try {
      localStorage.setItem("skipDeleteConfirmation", checked.toString());
      console.log("Saved preference to localStorage:", checked.toString());
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const downloadFile = async (fileUrl, fileName, reportId) => {
    try {
      // Validate URL
      if (!fileUrl) {
        throw new Error(
          "File URL is missing. The download link may have expired."
        );
      }

      console.log("Downloading file:", fileName, "from URL:", fileUrl);
      setIsDownloading(true);
      setDownloadingId(reportId);
      setErrorMessage("");

      // For simplicity and reliability, use the server-side proxy directly
      // This approach has fewer browser security restrictions
      console.log("Using server-side proxy for download");
      const proxyUrl = `/api/reports/${reportId}/download`;

      // Create an invisible iframe to handle the download
      // This is the most reliable cross-browser approach
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = proxyUrl;
      document.body.appendChild(iframe);

      console.log("Download iframe created with proxy URL:", proxyUrl);

      // Check if the iframe loaded successfully
      iframe.onload = () => {
        console.log("Iframe loaded successfully");

        // Remove the iframe after a delay
        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 5000);

        // Set success message
        setUploadStatus("download-success");
        setTimeout(() => {
          setUploadStatus(null);
        }, 3000);
      };

      // Handle iframe errors
      iframe.onerror = (error) => {
        console.error("Iframe download failed:", error);
        throw new Error("Browser failed to process the download");
      };
    } catch (error) {
      console.error("Error downloading file:", error);
      let errorMsg = "Failed to download file: ";

      // More specific error messages based on the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 403) {
          errorMsg += "Access denied. The download link may have expired.";
        } else if (error.response.status === 404) {
          errorMsg += "File not found. It may have been deleted or moved.";
        } else {
          errorMsg += `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        if (error.code === "ECONNABORTED") {
          errorMsg +=
            "Request timed out. The file may be too large or the server is busy.";
        } else {
          errorMsg +=
            "No response from server. The S3 URL may have expired or there are connectivity issues.";
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        if (error.message && error.message.includes("fetch")) {
          errorMsg +=
            "Browser couldn't establish connection to the server. This could be due to CORS restrictions or network issues.";
        } else {
          errorMsg += error.message;
        }
      }

      setErrorMessage(errorMsg);
      setUploadStatus("error");
    } finally {
      setIsDownloading(false);
      setDownloadingId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setReportToDelete(null);
  };

  const getReportType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png"].includes(extension)) return "Image";
    if (["pdf"].includes(extension)) return "PDF Document";
    if (["doc", "docx"].includes(extension)) return "Medical Report";
    return "Other Document";
  };

  const filteredReports = userReports.filter((report) => {
    if (!report) return false;

    const matchesSearch =
      searchTerm === "" ||
      (report.originalFilename?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (report.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (report.filename?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" || report.reportType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      {/* Report Type Selection Modal */}
      {showTypeSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4 animate-fade-in-down">
            <div className="mb-4 flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Report Type
                </h3>
                <p className="text-gray-600 mt-1">
                  Choose how you want to categorize{" "}
                  <span className="font-medium">
                    {fileToUpload?.name || "this file"}
                  </span>
                </p>
              </div>
              <button
                onClick={cancelUpload}
                className="ml-auto p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 mb-5">
              <div className="space-y-2">
                <div className="font-medium text-gray-700 mb-2">
                  Report Type
                </div>
                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedReportType === "Image"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value="Image"
                    checked={selectedReportType === "Image"}
                    onChange={() => setSelectedReportType("Image")}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 mr-3"
                  />
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-md mr-3">
                      <FiFile className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Image</p>
                      <p className="text-xs text-gray-500">
                        X-rays, scan images, photos
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedReportType === "PDF Document"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value="PDF Document"
                    checked={selectedReportType === "PDF Document"}
                    onChange={() => setSelectedReportType("PDF Document")}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 mr-3"
                  />
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-md mr-3">
                      <FiFile className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">PDF Document</p>
                      <p className="text-xs text-gray-500">
                        General documents, letters, forms
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedReportType === "Medical Report"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value="Medical Report"
                    checked={selectedReportType === "Medical Report"}
                    onChange={() => setSelectedReportType("Medical Report")}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 mr-3"
                  />
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-md mr-3">
                      <FiFile className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Medical Report
                      </p>
                      <p className="text-xs text-gray-500">
                        Lab results, diagnoses, treatment plans
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedReportType === "Other Document"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value="Other Document"
                    checked={selectedReportType === "Other Document"}
                    onChange={() => setSelectedReportType("Other Document")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-md mr-3">
                      <FiFile className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Other Document
                      </p>
                      <p className="text-xs text-gray-500">
                        Any other file type
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="description"
                  className="block font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows="3"
                  placeholder="Add a description for this report"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelUpload}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                disabled={!selectedReportType}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  !selectedReportType ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Upload Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4 animate-fade-in-down">
            <div className="mb-4 flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FiInfo className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">
                    {reportToDelete?.name || "this report"}
                  </span>
                  ?
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  This will permanently remove the file from AWS S3 storage and
                  delete the record from the database. This action cannot be
                  undone.
                </p>
              </div>
              <button
                onClick={cancelDelete}
                className="ml-auto p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-5 flex items-center">
              <input
                type="checkbox"
                id="dontShowAgain"
                checked={skipDeleteConfirmation}
                onChange={(e) => handleDontShowAgain(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2 cursor-pointer"
              />
              <label
                htmlFor="dontShowAgain"
                className="text-sm text-gray-600 cursor-pointer select-none"
                onClick={() => handleDontShowAgain(!skipDeleteConfirmation)}
              >
                Don't show this confirmation again
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => performDeleteReport(reportToDelete.id)}
                disabled={isDeletingFile}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center ${
                  isDeletingFile ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isDeletingFile ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global loading overlay for delete operation */}
      {isDeletingFile && !showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 flex items-center">
            <svg
              className="animate-spin h-6 w-6 text-blue-600 mr-3"
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
            <span className="text-gray-700">
              Removing file from S3 and database...
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Medical Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and organize your medical documents
            </p>
          </div>
          <label className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer">
            <FiUploadCloud className="w-5 h-5" />
            <span>Upload New Report</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </label>
        </div>

        {/* Upload Status */}
        {uploadStatus === "uploading" && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">
              Uploading {selectedFile?.name}...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-700">
                File uploaded successfully!
              </p>
            </div>
          </div>
        )}

        {uploadStatus === "delete-success" && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-700">
                File deleted successfully from S3 and database!
              </p>
            </div>
          </div>
        )}

        {uploadStatus === "download-success" && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-700">
                File downloaded successfully!
              </p>
            </div>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <div className="flex items-start">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <p className="text-sm text-red-700">
                  {errorMessage.includes("download")
                    ? "Download failed"
                    : "Upload failed"}
                </p>
                <p className="text-xs text-red-600">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Low Storage Warning */}
        {calculateUsedStorage() / STORAGE_LIMIT > 0.85 && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <FiInfo className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Storage Almost Full</p>
                <p className="text-xs text-yellow-700 mt-1">
                  You are using {Math.round((calculateUsedStorage() / STORAGE_LIMIT) * 100)}% of your {(STORAGE_LIMIT / (1024 * 1024)).toFixed(0)}MB storage limit. Consider deleting some files to free up space.
                </p>
                <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-yellow-500"
                    style={{ width: `${Math.min(100, (calculateUsedStorage() / STORAGE_LIMIT) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-56 bg-white rounded-lg shadow-sm border border-gray-300 flex items-center">
            <div className="flex items-center px-2 py-2.5 bg-gray-50 border-r border-gray-300 rounded-l-lg">
              <FiFilter className="text-gray-500" />
            </div>
            <select
              className="flex-1 border-none rounded-r-lg pl-2 pr-1 py-2.5 focus:outline-none text-gray-700 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Image">Images</option>
              <option value="PDF Document">PDFs</option>
              <option value="Medical Report">Medical Reports</option>
              <option value="Other Document">Other Documents</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 overflow-x-auto scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="grid grid-cols-5 gap-3 min-w-[900px]">
            {/* Total Reports Card */}
            <div 
              className={`bg-white p-3 rounded-lg shadow-sm border ${
                filterType === "all" 
                  ? "border-blue-500 shadow-md ring-2 ring-blue-200" 
                  : "border-blue-100"
              } transform hover:scale-105 transition-transform duration-200 cursor-pointer`}
              onClick={() => setFilterType("all")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Reports</p>
                  <p className="text-lg font-bold text-gray-800">
                    {userReports.length}
                  </p>
                </div>
                <div className={`p-1.5 rounded-full ${filterType === "all" ? "bg-blue-200" : "bg-blue-100"}`}>
                  <FiFileText className={`w-4 h-4 ${filterType === "all" ? "text-blue-700" : "text-blue-600"}`} />
                </div>
              </div>
              <div className="flex items-center mt-1 text-xs">
                <span className={`${filterType === "all" ? "text-blue-700 font-medium" : "text-blue-600"} text-xs`}>All documents</span>
              </div>
            </div>

            {/* Images Card */}
            <div 
              className={`bg-white p-3 rounded-lg shadow-sm border ${
                filterType === "Image" 
                  ? "border-purple-500 shadow-md ring-2 ring-purple-200" 
                  : "border-purple-100"
              } transform hover:scale-105 transition-transform duration-200 cursor-pointer`}
              onClick={() => setFilterType("Image")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Images</p>
                  <p className="text-lg font-bold text-gray-800">
                    {
                      userReports.filter(
                        (report) => report.reportType === "Image"
                      ).length
                    }
                  </p>
                </div>
                <div className={`p-1.5 rounded-full ${filterType === "Image" ? "bg-purple-200" : "bg-purple-100"}`}>
                  <FiFile className={`w-4 h-4 ${filterType === "Image" ? "text-purple-700" : "text-purple-600"}`} />
                </div>
              </div>
              <div className="flex items-center mt-1 text-xs">
                <span className={`${filterType === "Image" ? "text-purple-700 font-medium" : "text-purple-600"} text-xs`}>X-rays, scans</span>
              </div>
            </div>

            {/* PDF Documents Card */}
            <div 
              className={`bg-white p-3 rounded-lg shadow-sm border ${
                filterType === "PDF Document" 
                  ? "border-red-500 shadow-md ring-2 ring-red-200" 
                  : "border-red-100"
              } transform hover:scale-105 transition-transform duration-200 cursor-pointer`}
              onClick={() => setFilterType("PDF Document")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">PDF Documents</p>
                  <p className="text-lg font-bold text-gray-800">
                    {
                      userReports.filter(
                        (report) => report.reportType === "PDF Document"
                      ).length
                    }
                  </p>
                </div>
                <div className={`p-1.5 rounded-full ${filterType === "PDF Document" ? "bg-red-200" : "bg-red-100"}`}>
                  <FiFile className={`w-4 h-4 ${filterType === "PDF Document" ? "text-red-700" : "text-red-600"}`} />
                </div>
              </div>
              <div className="flex items-center mt-1 text-xs">
                <span className={`${filterType === "PDF Document" ? "text-red-700 font-medium" : "text-red-600"} text-xs`}>Documents, forms</span>
              </div>
            </div>

            {/* Medical Reports Card */}
            <div 
              className={`bg-white p-3 rounded-lg shadow-sm border ${
                filterType === "Medical Report" 
                  ? "border-green-500 shadow-md ring-2 ring-green-200" 
                  : "border-green-100"
              } transform hover:scale-105 transition-transform duration-200 cursor-pointer`}
              onClick={() => setFilterType("Medical Report")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Medical Reports</p>
                  <p className="text-lg font-bold text-gray-800">
                    {
                      userReports.filter(
                        (report) => report.reportType === "Medical Report"
                      ).length
                    }
                  </p>
                </div>
                <div className={`p-1.5 rounded-full ${filterType === "Medical Report" ? "bg-green-200" : "bg-green-100"}`}>
                  <FiFileText className={`w-4 h-4 ${filterType === "Medical Report" ? "text-green-700" : "text-green-600"}`} />
                </div>
              </div>
              <div className="flex items-center mt-1 text-xs">
                <span className={`${filterType === "Medical Report" ? "text-green-700 font-medium" : "text-green-600"} text-xs`}>Lab results</span>
              </div>
            </div>

            {/* Storage Used Card */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Storage Used</p>
                  <p className="text-lg font-bold text-gray-800">
                    {(calculateUsedStorage() / (1024 * 1024)).toFixed(2)} / {(STORAGE_LIMIT / (1024 * 1024)).toFixed(0)} MB
                  </p>
                </div>
                <div className="p-1.5 bg-green-100 rounded-full">
                  <FiUploadCloud className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-green-600 text-xs">
                  {Math.min(100, Math.round((calculateUsedStorage() / STORAGE_LIMIT) * 100))}% of limit
                </span>
              </div>
              
              {/* Storage progress bar */}
              <div className="mt-1.5 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    (calculateUsedStorage() / STORAGE_LIMIT) > 0.9 ? 'bg-red-500' : 
                    (calculateUsedStorage() / STORAGE_LIMIT) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (calculateUsedStorage() / STORAGE_LIMIT) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section Header */}
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-gray-800">Your Reports</h2>
            {filterType !== "all" && (
              <span className={`ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                filterType === "Image" 
                  ? "bg-purple-100 text-purple-800 border border-purple-200" 
                  : filterType === "PDF Document" 
                  ? "bg-red-100 text-red-800 border border-red-200" 
                  : filterType === "Medical Report" 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}>
                {filterType}
                <button 
                  onClick={() => setFilterType("all")} 
                  className="ml-1.5 text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          {filteredReports.length > 0 && (
            <span className="text-sm text-gray-500">
              Showing {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Reports Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : errorMessage && !uploadStatus ? (
          <div className="p-4 bg-red-50 rounded-lg text-center">
            <p className="text-sm text-red-700">{errorMessage}</p>
            <button
              onClick={fetchUserReports}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-lg">
            <FiFileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No reports found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Upload your medical reports to keep them organized"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-200 hover:translate-y-[-2px] cursor-pointer transition-all duration-200 flex flex-col group relative"
              >
                {/* Card Header with Color Accent */}
                <div
                  className={`h-1.5 w-full ${
                    report.reportType === "Image"
                      ? "bg-purple-500"
                      : report.reportType === "PDF Document"
                      ? "bg-red-500"
                      : report.reportType === "Medical Report"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                ></div>

                {/* Preview Section */}
                <div className={`px-3 pt-3 ${report.reportType === "Image" ? "" : "flex justify-center items-center"} relative`}>
                  {/* File type indicator badge */}
                  <div className={`absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded-full ${
                    report.reportType === "Image" ? "bg-purple-100 text-purple-700" : 
                    report.reportType === "PDF Document" ? "bg-red-100 text-red-700" : 
                    report.reportType === "Medical Report" ? "bg-green-100 text-green-700" : 
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {report.reportType === "Image" ? "IMAGE" : 
                     report.reportType === "PDF Document" ? "PDF" : 
                     report.reportType === "Medical Report" ? "MED" : 
                     "DOC"}
                  </div>
                  
                  {report.reportType === "Image" ? (
                    <div className="w-full h-32 overflow-hidden rounded-md bg-gray-100 mb-2 flex items-center justify-center">
                      <img 
                        src={report.fileUrl} 
                        alt={report.originalFilename || report.filename || "Image preview"} 
                        className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x200?text=Image+Preview+Unavailable";
                        }}
                      />
                    </div>
                  ) : report.reportType === "PDF Document" ? (
                    <div className="w-full h-32 overflow-hidden rounded-md bg-gray-50 mb-2 flex items-center justify-center relative border border-gray-200">
                      <div className="absolute top-0 left-0 right-0 h-6 bg-red-500 flex items-center px-2">
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                          <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                          <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                        </div>
                        <span className="text-white text-xs ml-auto font-medium opacity-90">PDF</span>
                      </div>
                      <div className="w-full px-3 pt-8 pb-2">
                        <div className="w-full h-3 bg-gray-300 rounded mb-2"></div>
                        <div className="w-2/3 h-3 bg-gray-300 rounded mb-2"></div>
                        <div className="w-5/6 h-3 bg-gray-300 rounded mb-2"></div>
                        <div className="w-3/4 h-3 bg-gray-300 rounded mb-2"></div>
                        <div className="w-4/5 h-3 bg-gray-300 rounded"></div>
                      </div>
                      <div className="absolute bottom-2 right-2 text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                  ) : report.reportType === "Medical Report" ? (
                    <div className="w-full h-32 overflow-hidden rounded-md bg-gray-50 mb-2 flex items-center justify-center relative border border-gray-200">
                      <div className="absolute top-0 left-0 right-0 h-6 bg-green-500 flex items-center px-2">
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                          <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                          <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                        </div>
                        <span className="text-white text-xs ml-auto font-medium opacity-90">DOC</span>
                      </div>
                      <div className="w-full px-3 pt-8 pb-2">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <div>
                            <div className="w-24 h-2 bg-gray-300 rounded"></div>
                            <div className="w-16 h-2 bg-gray-300 rounded mt-1"></div>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-300 rounded mb-1.5"></div>
                        <div className="w-5/6 h-2 bg-gray-300 rounded mb-1.5"></div>
                        <div className="w-4/5 h-2 bg-gray-300 rounded"></div>
                      </div>
                      <div className="absolute bottom-2 right-2 text-green-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-32 overflow-hidden rounded-md bg-gray-50 mb-2 flex items-center justify-center relative border border-gray-200">
                      <div className="absolute top-0 left-0 right-0 h-6 bg-blue-500 flex items-center px-2">
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                          <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                          <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                        </div>
                        <span className="text-white text-xs ml-auto font-medium opacity-90">FILE</span>
                      </div>
                      <div className="w-full px-3 pt-8 pb-2 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 flex-grow flex flex-col">
                  {/* Document Icon and Title */}
                  <div className="flex items-start mb-2">
                    <div
                      className={`p-1.5 rounded-md transition-all duration-200 hover:scale-110 ${
                        report.reportType === "Image"
                          ? "bg-purple-50 hover:bg-purple-100"
                          : report.reportType === "PDF Document"
                          ? "bg-red-50 hover:bg-red-100"
                          : report.reportType === "Medical Report"
                          ? "bg-green-50 hover:bg-green-100"
                          : "bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      <FiFile
                        className={`w-4 h-4 ${
                          report.reportType === "Image"
                            ? "text-purple-600"
                            : report.reportType === "PDF Document"
                            ? "text-red-600"
                            : report.reportType === "Medical Report"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="ml-2 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate transition-colors duration-200">
                        {report.originalFilename ||
                          report.filename ||
                          "Unnamed File"}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {report.description || "No description"}
                      </p>
                    </div>
                  </div>

                  {/* Document Details */}
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-2 mt-auto">
                    <div className="col-span-2">
                      <span className="inline-block px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors duration-200">
                        {report.reportType}
                      </span>
                      {report.originalFilename && (
                        <span className="inline-block ml-1 px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors duration-200">
                          {report.originalFilename.split('.').pop().toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Date</p>
                      <p title={report.uploadDateTime || report.createdAt}>
                        {formatDate(report.uploadDateTime || report.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Size</p>
                      <p>
                        {report.fileSize
                          ? `${(report.fileSize / 1024).toFixed(1)} KB`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-auto">
                    <div className="flex space-x-1">
                      <a
                        href={report.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-white p-1 hover:bg-blue-500 rounded-full transform hover:scale-110 transition-all duration-200 cursor-pointer"
                        title="View"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiEye className="w-3.5 h-3.5" />
                      </a>
                      <div className="relative">
                        <button
                          className="text-green-600 hover:text-white p-1 hover:bg-green-500 rounded-full transform hover:scale-110 transition-all duration-200 cursor-pointer"
                          title={
                            isDownloading && downloadingId === report._id
                              ? "Downloading..."
                              : "Download"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(
                              report.fileUrl,
                              report.originalFilename ||
                                report.filename ||
                                "download",
                              report._id
                            );
                          }}
                          disabled={
                            isDownloading && downloadingId === report._id
                          }
                          onContextMenu={(e) => {
                            e.preventDefault();
                            // Alternative: directly open in new tab as a fallback
                            window.open(
                              `/api/reports/${report._id}/download`,
                              "_blank"
                            );
                          }}
                        >
                          {isDownloading && downloadingId === report._id ? (
                            <svg
                              className="animate-spin w-3.5 h-3.5 text-white"
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
                          ) : (
                            <FiDownload className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          initiateDeleteReport(
                            report._id,
                            report.originalFilename ||
                              report.filename ||
                              "Unnamed File"
                          );
                        }}
                        className="text-red-600 hover:text-white p-1 hover:bg-red-500 rounded-full transform hover:scale-110 transition-all duration-200 cursor-pointer"
                        title="Delete"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span
                      className="text-xs text-gray-400 truncate max-w-[80px]"
                      title={report._id}
                    >
                      #{report._id.substring(0, 6)}
                    </span>
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

