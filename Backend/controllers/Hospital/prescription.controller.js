import Prescription from "../../models/prescription.model.js";
import { User } from "../../models/user.model.js";
import { createNotification } from "../notifications.controller.js";

// Create a new prescription
export const createPrescription = async (req, res) => {
  try {
    // Get data from request body
    const {
      patientId,
      patientName,
      patientUMID,
      diagnosis,
      medications,
      notes,
      createdAt
    } = req.body;

    // Validate required fields
    if (!patientId || !patientName || !patientUMID || !medications || medications.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patient information and medications are required"
      });
    }

    // Add doctor information from the logged-in user
    const doctorUser = await User.findById(req.user.id).select("name");
    
    // Create new prescription
    const prescription = new Prescription({
      patientId,
      patientName,
      patientUMID,
      doctorId: req.user.id,
      doctor: doctorUser ? `${doctorUser.name}` : "Medicare Doctor",
      diagnosis,
      medications,
      notes,
      createdAt: createdAt || new Date()
    });

    // Save prescription to database
    await prescription.save();

    // Create a notification for the patient
    await createNotification(
      patientId, 
      "New Prescription", 
      `Dr. ${doctorUser ? doctorUser.name : "Medicare Doctor"} has issued you a new prescription.`, 
      "info", 
      `/digital-prescriptions/${prescription._id}`
    );

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create prescription",
      error: error.message
    });
  }
};

// Get prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    const prescription = await Prescription.findById(prescriptionId);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
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

// Get all prescriptions for a patient
export const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const prescriptions = await Prescription.find({ patientId })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      prescriptions
    });
  } catch (error) {
    console.error("Error fetching patient prescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient prescriptions",
      error: error.message
    });
  }
};

// Get all prescriptions created by a doctor
export const getDoctorPrescriptions = async (req, res) => {
  try {
    // Get prescriptions created by the logged-in doctor
    const prescriptions = await Prescription.find({ doctorId: req.user.id })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      prescriptions
    });
  } catch (error) {
    console.error("Error fetching doctor prescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor prescriptions",
      error: error.message
    });
  }
};

// Generate a PDF view of the prescription
export const generatePrescriptionPDF = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    const prescription = await Prescription.findById(prescriptionId);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }
    
    // Here you would implement PDF generation logic
    // For now,just return the prescription data
    return res.status(200).json({
      success: true,
      message: "PDF generation endpoint (to be implemented)",
      prescription
    });
  } catch (error) {
    console.error("Error generating prescription PDF:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate prescription PDF",
      error: error.message
    });
  }
};