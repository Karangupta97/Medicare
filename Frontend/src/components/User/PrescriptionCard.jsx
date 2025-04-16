import React from "react";
import { FiFileText, FiClock, FiCalendar, FiInfo, FiDownload, FiEye, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PrescriptionCard = ({ prescription, onView }) => {
  const navigate = useNavigate();
  
  // Format date to a readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white p-1.5 rounded-md shadow-sm mr-2">
              <FiFileText className="text-blue-600" />
            </div>
            <h4 className="font-medium text-blue-800">Digital Prescription</h4>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {formatDate(prescription.createdAt)}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Doctor info */}
        {prescription.doctor && (
          <div className="flex items-center mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <FiUser className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700">Dr. {prescription.doctor}</p>
              <p className="text-xs text-gray-500">{prescription.hospitalName || "Medicare Hospital"}</p>
            </div>
          </div>
        )}
        
        {/* Diagnosis */}
        {prescription.diagnosis && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-0.5">Diagnosis:</p>
            <p className="text-sm font-medium text-gray-800">
              {prescription.diagnosis}
            </p>
          </div>
        )}
        
        {/* Medications summary */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-0.5">Medications:</p>
          <p className="text-sm font-medium text-gray-800">
            {getMedicationSummary()}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between pt-3 mt-2 border-t border-gray-100">
          <button
            onClick={handleViewDetails}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiEye className="w-3.5 h-3.5" /> View Details
          </button>
          
          <button
            className="text-xs flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiDownload className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PrescriptionCard;