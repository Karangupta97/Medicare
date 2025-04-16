import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiClipboard, FiFileText, FiFile, FiDownload, FiEye, FiUser, FiAlertCircle, FiCalendar, FiPhone, FiMail, FiClock, FiCheckCircle, FiPlus, FiPlusCircle, FiEdit, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import handlogo from "../assets/logo/logo.png";
import axios from "axios";
import HospitalDashboardLayout from "../components/Hospital/HospitalDashboardLayout";
import { motion, AnimatePresence } from "framer-motion";


// Component for displaying patient information
const PatientInfo = ({ patient }) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  // Set up profile picture with error handling and cache busting
  useEffect(() => {
    if (patient?.photoURL) {
      setImgError(false);
      
      // Add a timestamp parameter to the URL to prevent caching if it's not already there
      if (!patient.photoURL.includes('?')) {
        setImgSrc(`${patient.photoURL}?t=${new Date().getTime()}`);
      } else {
        setImgSrc(patient.photoURL);
      }
    } else {
      // Default user icon if no photo available
      setImgSrc(null);
    }
  }, [patient?.photoURL]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center p-1">
            <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
              {imgSrc && !imgError ? (
                <img 
                  src={imgSrc} 
                  alt={`${patient.name} ${patient.lastname}`}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <FiUser className="w-10 h-10 text-blue-600" />
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patient.name} {patient.lastname}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                UMID: {patient.umid}
              </span>
              {patient.bloodType && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Blood: {patient.bloodType}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <a href={`/hospital/patient-history/${patient._id}`} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <FiFileText className="w-4 h-4" />
            <span>View History</span>
          </a>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <FiClipboard className="w-4 h-4" />
            <span>Add Note</span>
          </button>
          <DigitalPrescription 
            patient={patient} 
            onPrescriptionSaved={(prescription) => {
              // Update reports to include the new prescription
              const newPrescriptionReport = {
                _id: prescription._id,
                category: 'prescription',
                originalFilename: `Prescription - ${new Date().toLocaleDateString()}`,
                description: prescription.diagnosis || 'Digital Prescription',
                doctor: 'Current Doctor', // This would be replaced with actual logged in doctor name
                createdAt: prescription.createdAt,
                fileUrl: `/api/hospital/prescriptions/${prescription._id}/view`
              };
              setReports([newPrescriptionReport, ...reports]);
            }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3 transition-colors hover:bg-gray-100">
          <FiCalendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
            <p className="font-medium text-gray-900">{patient.dob || 'Not provided'}</p>
            {patient.dob && (
              <p className="text-xs text-gray-500 mt-1">
                {calculateAge(patient.dob)} years old
              </p>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3 transition-colors hover:bg-gray-100">
          <FiPhone className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <p className="font-medium text-gray-900">{patient.phone || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3 transition-colors hover:bg-gray-100">
          <FiMail className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="font-medium text-gray-900">{patient.email || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3 transition-colors hover:bg-gray-100">
          <FiCheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <p className="font-medium text-gray-900">
              <span className="inline-flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${patient.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                {patient.status === 'active' ? 'Active Patient' : 'Under Review'}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      {patient.allergies && patient.allergies.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
          <h3 className="font-medium text-red-800 flex items-center gap-2 mb-2">
            <FiAlertCircle className="w-5 h-5" />
            Allergies
          </h3>
          <div className="flex flex-wrap gap-2">
            {patient.allergies.map((allergy, index) => (
              <span key={index} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Utility function to calculate age from date of birth
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Component for displaying a medical report card
const ReportCard = ({ report, onView, onRefreshUrl }) => {
  const [isUrlExpired, setIsUrlExpired] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Map category to icon and color
  const getCategoryInfo = (category) => {
    switch(category) {
      case 'medical':
        return { 
          icon: <FiFileText className="w-6 h-6 text-green-600" />, 
          bg: 'bg-green-50 border-green-100', 
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-800'
        };
      case 'lab':
        return { 
          icon: <FiClipboard className="w-6 h-6 text-purple-600" />, 
          bg: 'bg-purple-50 border-purple-100', 
          text: 'text-purple-800',
          badge: 'bg-purple-100 text-purple-800' 
        };
      case 'prescription':
        return { 
          icon: <FiFile className="w-6 h-6 text-blue-600" />, 
          bg: 'bg-blue-50 border-blue-100', 
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800'
        };
      default:
        return { 
          icon: <FiFile className="w-6 h-6 text-gray-600" />, 
          bg: 'bg-gray-50 border-gray-100', 
          text: 'text-gray-800',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const categoryInfo = getCategoryInfo(report.category);
  
  // Handle viewing a report, checking for expired URL errors
  const handleViewReport = async () => {
    try {
      // Open in new window, which will trigger an error if the URL is expired
      const newWindow = window.open(report.fileUrl, '_blank');
      
      // We can't directly check if the URL is expired because of CORS,
      // so we'll provide a refresh button for the user to manually refresh if needed
      onView(report);
    } catch (error) {
      console.error("Error viewing report:", error);
      setIsUrlExpired(true);
    }
  };
  
  // Handle refreshing an expired URL
  const handleRefreshUrl = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshUrl(report._id);
      setIsUrlExpired(false);
    } catch (error) {
      console.error("Error refreshing URL:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-md group ${categoryInfo.bg}`}
    >
      {/* Card Header */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-3">
          {categoryInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.badge}`}>
            {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
          </span>
          {report.createdAt && (
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(report.createdAt)}
            </p>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {report.originalFilename || 'Unnamed File'}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {report.description || 'No description provided'}
        </p>

        {report.doctor && (
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <FiUser className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Dr. {report.doctor}</span>
          </div>
        )}
        
        {/* Expired URL Warning */}
        {isUrlExpired && (
          <div className="mb-4 p-2 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-sm flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>The access link has expired. Please refresh it.</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <button
            onClick={handleViewReport}
            className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors`}
          >
            <FiEye className="w-4 h-4" /> 
            View
          </button>
          
          {isUrlExpired ? (
            <button
              onClick={handleRefreshUrl}
              disabled={isRefreshing}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium ${
                isRefreshing ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              } transition-colors`}
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh URL
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => window.open(report.fileUrl, '_blank')}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium ${categoryInfo.text} hover:bg-white transition-colors`}
            >
              <FiDownload className="w-4 h-4" /> 
              Download
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Digital Prescription Component
const DigitalPrescription = ({ patient, onPrescriptionSaved }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    diagnosis: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    const updatedMedications = [...formData.medications];
    updatedMedications[index][field] = value;
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications, 
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    });
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      const updatedMedications = [...formData.medications];
      updatedMedications.splice(index, 1);
      setFormData({
        ...formData,
        medications: updatedMedications
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add patient details and current date to the prescription
      const prescriptionData = {
        ...formData,
        patientId: patient._id,
        patientName: `${patient.name} ${patient.lastname}`,
        patientUMID: patient.umid,
        createdAt: new Date().toISOString()
      };

      console.log("Submitting prescription:", prescriptionData);
      const response = await axios.post('/api/hospital/digital-prescriptions', prescriptionData);
      
      if (response.data.success) {
        toast.success('Prescription created successfully');
        setIsOpen(false);
        
        // Reset form data
        setFormData({
          medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
          diagnosis: '',
          notes: ''
        });
        
        // Call the callback if provided to refresh parent component
        if (onPrescriptionSaved) {
          onPrescriptionSaved(response.data.prescription);
        }
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error(error.response?.data?.message || "Failed to create prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  // List of common medication frequencies for dropdown
  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every morning',
    'Every night',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'With meals',
    'Before meals',
    'After meals'
  ];

  return (
    <>
      {/* Button to open the prescription modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <FiEdit className="w-4 h-4" />
        <span>Write Prescription</span>
      </button>

      {/* Prescription Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Digital Prescription</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Creating prescription for {patient.name} {patient.lastname} (UMID: {patient.umid})
                </p>
              </div>

              {/* Prescription Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Patient Information Summary */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">Patient Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name:</p>
                      <p className="font-medium text-gray-900">{patient.name} {patient.lastname}</p>
                    </div>
                    {patient.dob && (
                      <div>
                        <p className="text-sm text-gray-600">Age:</p>
                        <p className="font-medium text-gray-900">{calculateAge(patient.dob)} years</p>
                      </div>
                    )}
                    {patient.bloodType && (
                      <div>
                        <p className="text-sm text-gray-600">Blood Type:</p>
                        <p className="font-medium text-gray-900">{patient.bloodType}</p>
                      </div>
                    )}
                    {patient.allergies && patient.allergies.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Allergies:</p>
                        <p className="font-medium text-red-600">{patient.allergies.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="mb-6">
                  <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis
                  </label>
                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    rows={2}
                    value={formData.diagnosis}
                    onChange={handleGeneralChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter diagnosis or reason for prescription"
                  ></textarea>
                </div>

                {/* Medications */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-medium text-gray-900">Prescribed Medications</h4>
                    <button
                      type="button"
                      onClick={addMedication}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <FiPlus className="w-4 h-4 mr-1" />
                      Add Medication
                    </button>
                  </div>

                  {formData.medications.map((medication, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium text-gray-900">Medication #{index + 1}</h5>
                        {formData.medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Medication Name
                          </label>
                          <input
                            type="text"
                            value={medication.name}
                            onChange={(e) => handleChange(e, index, 'name')}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter medication name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={medication.dosage}
                            onChange={(e) => handleChange(e, index, 'dosage')}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="E.g., 500mg, 5ml, etc."
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Frequency
                          </label>
                          <select
                            value={medication.frequency}
                            onChange={(e) => handleChange(e, index, 'frequency')}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select frequency</option>
                            {frequencyOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={medication.duration}
                            onChange={(e) => handleChange(e, index, 'duration')}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="E.g., 7 days, 2 weeks, etc."
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Instructions
                          </label>
                          <input
                            type="text"
                            value={medication.instructions}
                            onChange={(e) => handleChange(e, index, 'instructions')}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="E.g., Take with food"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes/Instructions
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleGeneralChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Any additional instructions or notes for the patient"
                  ></textarea>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 ${
                      isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FiEdit className="w-4 h-4" />
                        <span>Create Prescription</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const FindPatient = () => {
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('lastPatientSearch') || "";
  });
  const [isSearching, setIsSearching] = useState(false);
  const [patient, setPatient] = useState(() => {
    const savedPatient = localStorage.getItem('currentPatient');
    return savedPatient ? JSON.parse(savedPatient) : null;
  });
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem('currentPatientReports');
    return savedReports ? JSON.parse(savedReports) : [];
  });
  const [viewingReport, setViewingReport] = useState(null);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('recentPatientSearches');
    return saved ? JSON.parse(saved) : [];
  });

  // Effect to save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentPatientSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Effect to save patient data to localStorage when it changes
  useEffect(() => {
    if (patient) {
      localStorage.setItem('currentPatient', JSON.stringify(patient));
      localStorage.setItem('lastPatientSearch', searchQuery);
    }
  }, [patient, searchQuery]);

  // Effect to save reports data to localStorage when it changes
  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem('currentPatientReports', JSON.stringify(reports));
    }
  }, [reports]);

  // Effect to load saved patient and reports on initial render
  useEffect(() => {
    // If we have a saved search query but no patient data, auto-search on page load
    const savedSearch = localStorage.getItem('lastPatientSearch');
    if (savedSearch && !patient && savedSearch.trim()) {
      setSearchQuery(savedSearch);
      // Auto-search with the saved query
      const autoSearch = async () => {
        setIsSearching(true);
        try {
          // First, search for patient by UMID
          const patientResponse = await axios.get(`/api/hospital/patient/${savedSearch}`);
          
          if (patientResponse.data.success) {
            const patientData = patientResponse.data.patient;
            setPatient(patientData);
            
            // Then get patient reports
            const reportsResponse = await axios.get(`/api/hospital/patient/${patientData._id}/reports`);
            
            if (reportsResponse.data.success) {
              setReports(reportsResponse.data.reports);
            }
          }
        } catch (error) {
          console.error("Error auto-searching patient:", error);
          // Clear localStorage if the auto-search fails
          localStorage.removeItem('currentPatient');
          localStorage.removeItem('currentPatientReports');
          localStorage.removeItem('lastPatientSearch');
        } finally {
          setIsSearching(false);
        }
      };
      
      autoSearch();
    }
  }, []); // Run only once on component mount

  // UMID format validation function
  const isValidUMID = (umid) => {
    // Format should be "MED-XXXXX XXXXX XXXXX XXXXX" where X is a digit
    // Exactly 4 groups of exactly 5 digits, no more, no less
    const umidRegex = /^MED-\d{5}\s\d{5}\s\d{5}\s\d{5}$/;
    return umidRegex.test(umid);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const trimmedUMID = searchQuery.trim();
    
    if (!trimmedUMID) {
      toast.error("Please enter a valid UMID");
      return;
    }
    
    // Validate UMID format
    if (!isValidUMID(trimmedUMID)) {
      toast.error("Invalid UMID format. Format should be MED-XXXXX XXXXX XXXXX XXXXX");
      setError("Invalid UMID format. Please enter UMID in the format: MED-XXXXX XXXXX XXXXX XXXXX");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setPatient(null);
    setReports([]);
    
    try {
      // First, search for patient by UMID
      const patientResponse = await axios.get(`/api/hospital/patient/${trimmedUMID}`);
      
      if (patientResponse.data.success) {
        const patientData = patientResponse.data.patient;
        setPatient(patientData);
        
        // Add to recent searches if not already there
        if (!recentSearches.some(search => search.umid === trimmedUMID)) {
          const newRecentSearch = {
            umid: trimmedUMID,
            name: `${patientData.name} ${patientData.lastname}`,
            timestamp: new Date().toISOString()
          };
          
          // Keep only the most recent 5 searches
          const updatedSearches = [newRecentSearch, ...recentSearches].slice(0, 5);
          setRecentSearches(updatedSearches);
        }
        
        // Then get patient reports
        const reportsResponse = await axios.get(`/api/hospital/patient/${patientData._id}/reports`);
        
        if (reportsResponse.data.success) {
          setReports(reportsResponse.data.reports);
        }
        
        // Success notification
        toast.success(`Found patient: ${patientData.name} ${patientData.lastname}`);
      }
    } catch (error) {
      console.error("Error searching patient:", error);
      setError(error.response?.data?.message || "Failed to find patient information");
      toast.error(error.response?.data?.message || "Failed to find patient information");
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewReport = (report) => {
    setViewingReport(report);
    // Note: Opening the URL is now handled by the ReportCard component
  };

  // Handle refreshing an expired S3 URL
  const handleRefreshReportUrl = async (reportId) => {
    try {
      const response = await axios.get(`/api/reports/${reportId}/refresh-url`);
      
      if (response.data.success) {
        // Update the report in the state with the new URL
        const updatedReports = reports.map(report => {
          if (report._id === reportId) {
            return {
              ...report,
              fileUrl: response.data.fileUrl
            };
          }
          return report;
        });
        
        // Update reports in state and localStorage
        setReports(updatedReports);
        localStorage.setItem('currentPatientReports', JSON.stringify(updatedReports));
        
        toast.success("Successfully refreshed report access");
        return response.data.fileUrl;
      } else {
        throw new Error(response.data.message || "Failed to refresh URL");
      }
    } catch (error) {
      console.error("Error refreshing report URL:", error);
      toast.error(error.response?.data?.message || "Failed to refresh report access. Please try again.");
      throw error;
    }
  };

  // Format the UMID input as the user types
  const handleUMIDInput = (e) => {
    // Get the raw input value
    let input = e.target.value;
    
    // Store the original input to check if letters were entered after MED-
    const originalInput = input;
    
    // Process only digits, M, E, D, hyphen for the prefix part
    // After the prefix, only allow digits
    if (input.toUpperCase().startsWith("MED-")) {
      // Keep the MED- prefix untouched
      let prefix = input.substring(0, 4);
      // Get everything after the prefix and strip non-digits
      let afterPrefix = input.substring(4).replace(/[^0-9\s]/g, '');
      
      // Check if letters were entered after MED- prefix
      if (originalInput.substring(4) !== afterPrefix && originalInput.length > 4) {
        toast.error("Only numbers are allowed after MED- prefix");
      }
      
      input = prefix + afterPrefix;
    } else {
      // Allow only M, E, D, and hyphen at the beginning until the prefix is formed
      input = input.replace(/[^MEDmed0-9\s-]/g, '');
    }

    // Force "MED-" prefix for any input
    if (!input.toUpperCase().startsWith("MED-")) {
      if (input.toUpperCase().startsWith("MED")) {
        input = "MED-" + input.substring(3);
      } else if (input.toUpperCase().startsWith("ME")) {
        input = "MED-" + input.substring(2);
      } else if (input.toUpperCase().startsWith("M")) {
        input = "MED-" + input.substring(1);
      } else if (input.length > 0) {
        input = "MED-" + input;
      }
    }
    
    // Convert to uppercase for consistency
    input = input.toUpperCase();
    
    // Strip all spaces from the input
    let noSpaces = input.replace(/\s/g, '');
    
    // Create a formatted string with correct spacing
    let formatted = '';
    
    // Add the MED- prefix
    if (noSpaces.length >= 4) {
      formatted = noSpaces.substring(0, 4);
      
      // Extract all digits after the prefix
      let digits = noSpaces.substring(4);
      
      // Add first group of digits (up to 5)
      if (digits.length > 0) {
        formatted += digits.substring(0, Math.min(5, digits.length));
      }
      
      // Add second group with space (up to 5 more digits)
      if (digits.length > 5) {
        formatted += " " + digits.substring(5, Math.min(10, digits.length));
      }
      
      // Add third group with space (up to 5 more digits)
      if (digits.length > 10) {
        formatted += " " + digits.substring(10, Math.min(15, digits.length));
      }
      
      // Add fourth group with space (up to 5 more digits)
      if (digits.length > 15) {
        formatted += " " + digits.substring(15, Math.min(20, digits.length));
      }
    } else {
      formatted = noSpaces;
    }
    
    // Update the input value
    setSearchQuery(formatted);
  };

  // Handle selecting a recent search
  const handleSelectRecentSearch = (umid) => {
    setSearchQuery(umid);
    // Optionally auto-submit the search
    // handleSearch({ preventDefault: () => {} });
  };

  return (
    <HospitalDashboardLayout>
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Patient Lookup</h1>
            <p className="text-gray-500">Find and access patient medical records using their UMID</p>
          </div>
          
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            >
              <FiFileText className="w-4 h-4 mr-2 inline" />
              Bulk Lookup
            </button>
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            >
              <FiClipboard className="w-4 h-4 mr-2 inline" />
              Recent Activity
            </button>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 mb-8 overflow-hidden"
        >
          <div className="p-6 pb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Patient by UMID</h2>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-lg border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  placeholder="Enter patient UMID (e.g., MED-12345 67890 12345 67890)"
                  value={searchQuery}
                  onChange={handleUMIDInput}
                  maxLength={30}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className={`px-6 py-3 rounded-lg font-medium text-white shadow-sm flex items-center justify-center gap-2 ${
                  isSearching 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 transition-colors duration-300'
                }`}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FiSearch className="w-4 h-4" />
                    <span>Search Patient</span>
                  </>
                )}
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500">Format: MED-XXXXX XXXXX XXXXX XXXXX (where X is a digit)</p>
          </div>
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
                <button 
                  onClick={() => setRecentSearches([])}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Clear History
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectRecentSearch(search.umid)}
                    className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FiClock className="w-3 h-3 mr-1.5 text-gray-500" />
                    <span className="truncate max-w-[150px]">{search.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3"
          >
            <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Patient not found</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Patient Information */}
        {patient && <PatientInfo patient={patient} />}

        {/* Reports Section */}
        {patient && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Medical Reports</h2>
              
              {reports.length > 0 && (
                <div className="flex gap-2 items-center">
                  <select className="text-sm rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2">
                    <option value="">All Categories</option>
                    <option value="medical">Medical</option>
                    <option value="lab">Lab Results</option>
                    <option value="prescription">Prescriptions</option>
                  </select>
                  
                  <select className="text-sm rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-2">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              )}
            </div>
            
            {reports.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                <FiClipboard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">This patient doesn't have any medical reports available in the system.</p>
                <button className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <FiFile className="w-4 h-4" />
                  <span>Upload New Report</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <ReportCard 
                    key={report._id} 
                    report={report} 
                    onView={() => handleViewReport(report)} 
                    onRefreshUrl={handleRefreshReportUrl}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
        
        {/* Empty State (when no search has been performed yet) */}
        {!patient && !error && !isSearching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 rounded-xl p-10 text-center border border-gray-100 mt-10"
          >
            <img 
              src={handlogo} 
              alt="Medicare Logo" 
              className="w-20 h-20 mx-auto mb-6 opacity-80" 
            />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Search for a Patient</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Enter a patient's UMID in the search box above to access their medical records and reports.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 w-full">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Patient Records</h4>
                  <p className="text-sm text-gray-500">Access medical history</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 w-full">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Medical Reports</h4>
                  <p className="text-sm text-gray-500">View test results & notes</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </HospitalDashboardLayout>
  );
};

export default FindPatient;