import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import DashboardLayout from "../../components/User/DashboardLayout";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  FiFileText,
  FiUser,
  FiCalendar,
  FiArrowLeft,
  FiDownload,
  FiPrinter,
  FiShare2,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiBriefcase} from "react-icons/fi";

const PrescriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prescriptionRef = useRef(null);

  // Fetch prescription details
  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`/api/user/digital-prescriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.success) {
          setPrescription(response.data.prescription);
        } else {
          setError("Failed to load prescription details");
          toast.error("Failed to load prescription details");
        }
      } catch (err) {
        console.error("Error fetching prescription details:", err);
        setError("An error occurred while fetching the prescription");
        toast.error("An error occurred while fetching the prescription");
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchPrescriptionDetails();
    }
  }, [token, id]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  };

  // Handle download prescription - Client-side PDF generation
  const handleDownload = async () => {
    if (!prescriptionRef.current) {
      toast.error("Cannot generate PDF. Please try again later.");
      return;
    }

    const toastId = toast.loading("Generating PDF...");
    
    try {
      // Optional: Add a class to style the content for PDF generation
      prescriptionRef.current.classList.add('generating-pdf');
      
      // Capture the prescription as an image
      const canvas = await html2canvas(prescriptionRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary class
      prescriptionRef.current.classList.remove('generating-pdf');
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions to fit the page
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`Prescription-${id}.pdf`);
      
      toast.success("PDF generated successfully!", { id: toastId });
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error(`PDF generation failed: ${err.message}`, { id: toastId });
    }
  };

  // Handle print prescription
  const handlePrint = () => {
    window.print();
  };

  // Handle share prescription
  const handleShare = () => {
    toast.success("Share functionality coming soon!");
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded w-full mb-6"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-red-100 h-16 w-16 flex items-center justify-center mb-6">
                <FiAlertTriangle className="text-red-500 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Prescription Not Found
              </h2>
              <p className="text-gray-600 max-w-md mb-6">
                {error || "We couldn't find the prescription you're looking for. It may have been removed or you might not have permission to view it."}
              </p>
              <div className="flex gap-4">
                <Link
                  to="/digital-prescriptions"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  <FiArrowLeft className="inline mr-2" />
                  Back to All Prescriptions
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!prescription) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="rounded-full bg-yellow-100 h-16 w-16 mx-auto flex items-center justify-center mb-6">
              <FiInfo className="text-yellow-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Prescription Found
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              The prescription you're looking for could not be found.
            </p>
            <Link
              to="/digital-prescriptions"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
            >
              <FiArrowLeft className="inline mr-2" />
              Back to All Prescriptions
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header/Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FiFileText className="mr-2 text-blue-600" /> 
              Digital Prescription
            </h1>
            <p className="text-gray-600 mt-1">
              Issued on {formatDate(prescription.createdAt)}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link
              to="/digital-prescriptions"
              className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              <FiArrowLeft className="mr-1" /> Back
            </Link>
          </div>
        </div>
        
        {/* Prescription Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-6" ref={prescriptionRef}>
          {/* Prescription Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                  <FiFileText className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Prescription #{prescription._id.substring(0, 8)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Issued: {formatDate(prescription.createdAt)} at {formatTime(prescription.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Download Prescription"
                >
                  <FiDownload />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Print Prescription"
                >
                  <FiPrinter />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Share Prescription"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="p-6">
            {/* Status banner */}
            <div className={`mb-6 p-3 rounded-lg flex items-center
              ${prescription.status === "Active" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-blue-50 text-blue-700 border border-blue-200"}`}
            >
              {prescription.status === "Active" ? (
                <FiCheckCircle className="mr-2" />
              ) : (
                <FiInfo className="mr-2" />
              )}
              <span className="text-sm font-medium">
                This prescription is currently {prescription.status || "Active"}
              </span>
            </div>
            
            {/* Doctor and Hospital Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Doctor Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm text-gray-500 mb-2 flex items-center">
                  <FiUser className="mr-2" /> Prescribed By
                </h3>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Dr. {prescription.doctor || "Not specified"}</p>
                    <p className="text-sm text-gray-600">{prescription.doctorSpecialty || "General Physician"}</p>
                    {prescription.doctorRegistrationNumber && (
                      <p className="text-xs text-gray-500 mt-1">Reg. No: {prescription.doctorRegistrationNumber}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Hospital Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm text-gray-500 mb-2 flex items-center">
                  <FiBriefcase className="mr-2" /> Hospital/Clinic
                </h3>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiBriefcase className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{prescription.hospitalName || "Medicare Hospital"}</p>
                    <p className="text-sm text-gray-600">{prescription.hospitalAddress || "Address not specified"}</p>
                    {prescription.hospitalPhone && (
                      <p className="text-xs text-gray-500 mt-1">Tel: {prescription.hospitalPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Patient Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Patient Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{user?.name || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Patient ID</p>
                    <p className="font-medium">{user?.umid || prescription.patientId || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age / Gender</p>
                    <p className="font-medium">{prescription.patientAge || "N/A"} / {prescription.patientGender || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{user?.phone || "Not available"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Diagnosis */}
            {prescription.diagnosis && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Diagnosis</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{prescription.diagnosis}</p>
                </div>
              </div>
            )}
            
            {/* Medications */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Medications</h3>
              
              {prescription.medications && prescription.medications.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {prescription.medications.map((medication, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{medication.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{medication.dosage || "As directed"}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{medication.frequency || "As needed"}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{medication.duration || "Until completed"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600">No medications specified</p>
                </div>
              )}
            </div>
            
            {/* Instructions */}
            {prescription.instructions && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Instructions</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{prescription.instructions}</p>
                </div>
              </div>
            )}
            
            {/* Additional Notes */}
            {prescription.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Additional Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{prescription.notes}</p>
                </div>
              </div>
            )}
            
            {/* Follow-up */}
            {prescription.followUp && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Follow-up</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-start">
                    <FiCalendar className="text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-gray-800">{prescription.followUp}</p>
                      {prescription.followUpDate && (
                        <p className="text-sm text-blue-600 mt-1">
                          {formatDate(prescription.followUpDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Digital Signature */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Digitally signed by</p>
                  <p className="font-medium text-gray-800">Dr. {prescription.doctor || "Physician"}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    on {formatDate(prescription.createdAt)} at {formatTime(prescription.createdAt)}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-center text-gray-600 mb-1">Digital Signature</div>
                  <div className="border-2 border-dashed border-blue-200 rounded p-2 text-center">
                    <p className="text-xs text-blue-800 font-medium">Electronically Verified</p>
                    <p className="text-xs text-gray-500">{prescription._id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiDownload className="mr-2" /> Download PDF
          </button>
          
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <FiPrinter className="mr-2" /> Print Prescription
          </button>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <FiShare2 className="mr-2" /> Share
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrescriptionDetail;