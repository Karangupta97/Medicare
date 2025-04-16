import express from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import {
  getPatientByUMID,
  getPatientReports,
  getRecentPatients
} from "../../controllers/Hospital/hospital.controller.js";
import {
  createPrescription,
  getPrescriptionById,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  generatePrescriptionPDF
} from "../../controllers/Hospital/prescription.controller.js";

const router = express.Router();

// All routes are protected with verifyToken middleware
router.use(verifyToken);

// Get recent patients for hospital dashboard
router.get("/recent-patients", getRecentPatients);

// Get patient by UMID
router.get("/patient/:umid", getPatientByUMID);

// Get patient reports
router.get("/patient/:patientId/reports", getPatientReports);

// Prescription routes
router.post("/digital-prescriptions", createPrescription);
router.get("/digital-prescriptions/:prescriptionId", getPrescriptionById);
router.get("/digital-prescriptions/patient/:patientId", getPatientPrescriptions);
router.get("/digital-prescriptions/doctor", getDoctorPrescriptions);
router.get("/digital-prescriptions/:prescriptionId/view", generatePrescriptionPDF);

export default router;