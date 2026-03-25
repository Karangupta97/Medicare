import express from "express";
import {
  doctorSignup,
  doctorLogin,
  doctorLogout,
  getDoctorProfile,
  requestPasswordReset,
  checkDoctorAuth
} from "../../controllers/Doctor/doctorAuth.controller.js";
import {
  getDoctorEmergencyAccess,
} from "../../controllers/Doctor/doctorEmergency.controller.js";
import { verifyDoctor } from "../../middleware/Doctor/verifyDoctor.js";


const router = express.Router();

// Doctor Auth Routes
router.post("/signup", doctorSignup);
router.post("/login", doctorLogin);
router.post("/logout", doctorLogout);
router.post("/reset-password", requestPasswordReset);
router.get("/check-auth", verifyDoctor, checkDoctorAuth);

// Doctor Profile Routes
router.get("/profile", verifyDoctor, getDoctorProfile);

// Doctor Emergency Access Routes
router.get("/emergency/:umid", verifyDoctor, getDoctorEmergencyAccess);

export default router; 