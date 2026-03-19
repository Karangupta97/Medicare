import express from "express";
import { verifyToken } from "../../middleware/User/verifyToken.js";
import {
  getReports,
  uploadReport,
  deleteReport,
  getReportById,
  moveReport,
  updateReport,
  refreshReportUrl,
} from "../../controllers/User/reports.controller.js";
import {
  analyzeReport,
  getAnalysisStatus,
} from "../../controllers/User/reportAnalysis.controller.js";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only specific file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/dicom'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG, and DICOM files are allowed.'));
    }
  },
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

// All routes are protected with verifyToken middleware
router.use(verifyToken);

// Get all reports for the authenticated user
router.get("/", getReports);

// Upload a new report
router.post("/upload", upload.single('file'), handleMulterError, uploadReport);

// Refresh the signed URL for a report (when URL expires)
router.get("/:id/refresh-url", refreshReportUrl);

// Get a specific report by ID
router.get("/:id", getReportById);

// Delete a report
router.delete("/:id", deleteReport);

// Move a report to a different category
router.patch("/:id/move", moveReport);

// Update report title and description
router.patch("/:id", updateReport);

// Analyze a report with OCR and AI
router.post("/:reportId/analyze", analyzeReport);

// Get analysis status for a report
router.get("/:reportId/analysis-status", getAnalysisStatus);

export default router;