import { User } from "../../models/User/user.model.js";
import Prescription from "../../models/Hospital/prescription.model.js";

// Get all prescriptions for the logged-in user
export const getUserPrescriptions = async (req, res) => {
  try {
    // Find prescriptions where the patient ID matches the logged-in user's ID
    const prescriptions = await Prescription.find({ patientId: req.user.id })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      prescriptions
    });
  } catch (error) {
    console.error("Error fetching user prescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
      error: error.message
    });
  }
};

// Get a specific prescription by ID for the logged-in user
export const getUserPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    // Find the prescription by ID
    const prescription = await Prescription.findById(prescriptionId);
    
    // If prescription not found, return 404
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }
    
    // Make sure the prescription belongs to the logged-in user
    if (prescription.patientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this prescription"
      });
    }
    
    return res.status(200).json({
      success: true,
      prescription
    });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescription",
      error: error.message
    });
  }
};

// Get user's digital prescription count
export const getPrescriptionCount = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Count prescriptions for this user
    const count = await Prescription.countDocuments({ patient: userId });
    
    return res.status(200).json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error("Error fetching prescription count:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescription count",
      error: error.message
    });
  }
};