import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getReports,
  uploadReport,
  deleteReport,
  getReportById
} from "../controllers/reports.controller.js";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
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
        message: 'File size too large. Maximum size is 10MB.',
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

// Get a specific report by ID
router.get("/:id", getReportById);

// Delete a report
router.delete("/:id", deleteReport);

export default router; 