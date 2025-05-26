import express from "express";
import {
  doctorSignup,
  doctorLogin,
  doctorLogout,
  getDoctorProfile,
  requestPasswordReset,
  checkDoctorAuth
} from "../../controllers/Doctor/doctorAuth.controller.js";
import { verifyDoctor } from "../../middleware/Doctor/verifyDoctor.js";
import { upload, handleMulterError } from "../../middleware/multer.middleware.js";

const router = express.Router();

// Doctor Auth Routes
router.post("/signup", upload.single("licenseDocument"), handleMulterError, doctorSignup);
router.post("/login", doctorLogin);
router.post("/logout", doctorLogout);
router.post("/reset-password", requestPasswordReset);
router.get("/check-auth", verifyDoctor, checkDoctorAuth);

// Doctor Profile Routes
router.get("/profile", verifyDoctor, getDoctorProfile);

export default router; 