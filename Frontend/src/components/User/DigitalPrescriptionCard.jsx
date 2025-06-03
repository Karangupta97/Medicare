import React, { useState } from "react";
import { FiFileText, FiClock, FiCalendar, FiInfo, FiDownload, FiEye, FiUser, FiCheckCircle, FiClipboard, FiChevronRight, FiPlusCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { safeExecute } from "../../utils/errorHandling";
import { useAuthStore } from "../../store/Patient/authStore";

const DigitalPrescriptionCard = ({ prescription, onView }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { token } = useAuthStore();
  
  // Format date to a readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate relative time (e.g., "2 days ago")
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const prescriptionDate = new Date(dateString);
    const diffTime = Math.abs(now - prescriptionDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  };

  // Get medication summary (shows the first medication name and count if more)
  const getMedicationSummary = () => {
    if (!prescription.medications || prescription.medications.length === 0) {
      return "No medications";
    }

    const firstMed = prescription.medications[0].name;
    if (prescription.medications.length === 1) {
      return firstMed;
    }
    
    return `${firstMed} and ${prescription.medications.length - 1} more`;
  };

  // Handle view details button click
  const handleViewDetails = () => {
    if (onView && typeof onView === 'function') {
      // Use the provided onView function if it exists
      onView(prescription);
    } else {
      // Otherwise, navigate to the prescription detail page
      navigate(`/digital-prescriptions/${prescription._id}`);
    }
  };

  // Handle download PDF - redirects to detail page for PDF generation
  const handleDownloadPDF = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    safeExecute(() => {
      try {
        // Navigate to detail page where PDF generation is implemented
        navigate(`/digital-prescriptions/${prescription._id}`);
        
        // Show a toast indicating how to download the PDF
        toast.success("Opening prescription details. Click the Download PDF button to download.", { duration: 5000 });
      } catch (error) {
        console.error("Navigation error:", error);
        toast.error("Failed to open prescription details");
      }
    });
  };

  // Determine the status of the prescription
  const getPrescriptionStatus = () => {
    // For a real application, you might determine this based on prescription dates
    // and other factors. For now, we'll simulate this.
    const isActive = prescription.isActive !== undefined ? 
      prescription.isActive : 
      true; // Default to active if not specified
    
    return isActive ? "Active" : "Expired";
  };

  const status = getPrescriptionStatus();
  const statusColor = status === "Active" ? "green" : "gray";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Status indicator */}
      <div className={`w-full h-1.5 bg-${statusColor}-500`}></div>
      
      {/* Header */}
      <div className="border-b border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white p-1.5 rounded-md shadow-sm mr-2 border border-blue-100">
              <FiFileText className="text-blue-600" />
            </div>
            <h4 className="font-medium text-blue-800">Digital Prescription</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs bg-${statusColor}-100 text-${statusColor}-800 px-2 py-0.5 rounded-full flex items-center gap-1`}>
              {status === "Active" ? <FiCheckCircle size={10} /> : <FiClock size={10} />}
              {status}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Date info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FiCalendar size={12} className="text-blue-500" />
            <span>{formatDate(prescription.createdAt)}</span>
          </div>
          <div className="text-xs text-gray-400 italic">
            {getRelativeTime(prescription.createdAt)}
          </div>
        </div>
        
        {/* Doctor info */}
        {prescription.doctor && (
          <div className="flex items-center mb-3 bg-gray-50 p-2 rounded-md">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <FiUser className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-800 font-medium">Dr. {prescription.doctor}</p>
              <p className="text-xs text-gray-500">{prescription.hospitalName || "Medicare Hospital"}</p>
            </div>
          </div>
        )}
        
        {/* Diagnosis */}
        {prescription.diagnosis && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
              <FiInfo size={12} className="text-blue-500" /> Diagnosis:
            </p>
            <p className="text-sm font-medium text-gray-800 bg-blue-50 p-2 rounded-md">
              {prescription.diagnosis}
            </p>
          </div>
        )}
        
        {/* Medications summary */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <FiClipboard size={12} className="text-blue-500" /> Medications:
          </p>
          <div className="bg-gray-50 p-2 rounded-md">
            {prescription.medications && prescription.medications.length > 0 ? (
              <div>
                {prescription.medications.slice(0, 2).map((med, index) => (
                  <div key={index} className="flex items-start gap-2 mb-1.5 last:mb-0">
                    <FiPlusCircle size={12} className="mt-1 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{med.name}</p>
                      {med.dosage && (
                        <p className="text-xs text-gray-600">
                          {med.dosage} {med.frequency && `- ${med.frequency}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {prescription.medications.length > 2 && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center">
                    +{prescription.medications.length - 2} more medications
                    <FiChevronRight size={12} className="ml-1" />
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No medications listed</p>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
          <motion.button
            onClick={handleViewDetails}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded-md"
          >
            <FiEye className="w-3.5 h-3.5" /> View Details
          </motion.button>
          
          <div className="flex gap-1">
            <motion.a
              href={`/digital-prescriptions/reminders?prescriptionId=${prescription._id}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors bg-purple-50 px-2 py-1 rounded-md"
            >
              <FiClock className="w-3.5 h-3.5" /> Set Reminder
            </motion.a>
            
            <motion.button
              onClick={handleDownloadPDF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors bg-gray-50 px-2 py-1 rounded-md"
            >
              <FiDownload className="w-3.5 h-3.5" /> Download
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DigitalPrescriptionCard;