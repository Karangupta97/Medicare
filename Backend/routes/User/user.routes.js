import express from "express";
import { verifyToken } from "../../middleware/User/verifyToken.js";
import { getUserPrescriptions, getUserPrescriptionById, getPrescriptionCount } from "../../controllers/User/user.controller.js";

const router = express.Router();

// All routes are protected with verifyToken middleware
router.use(verifyToken);

// Get user's prescriptions
router.get("/digital-prescriptions", getUserPrescriptions);

// Get prescription count for the logged-in user
router.get("/digital-prescriptions/count", getPrescriptionCount);

// Get a specific prescription by ID
router.get("/digital-prescriptions/:prescriptionId", getUserPrescriptionById);

export default router;