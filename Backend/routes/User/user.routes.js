import express from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import { getUserPrescriptions, getUserPrescriptionById } from "../../controllers/User/user.controller.js";

const router = express.Router();

// All routes are protected with verifyToken middleware
router.use(verifyToken);

// Get user's prescriptions
router.get("/digital-prescriptions", getUserPrescriptions);

// Get a specific prescription by ID
router.get("/digital-prescriptions/:prescriptionId", getUserPrescriptionById);

export default router;