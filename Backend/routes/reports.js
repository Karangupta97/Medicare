import express from 'express';
import multer from 'multer';
import Report from '../models/Report.js';
import S3Service from '../services/S3Service.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept images, PDFs and documents
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only images, PDFs, and Word documents are allowed.'), false);
    }
  },
});

/**
 * @route POST /api/reports/upload
 * @desc Upload a report to S3 and save details in MongoDB
 * @access Private
 */
router.post('/upload', auth, upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Debug logging
    console.log('User ID from token:', req.user.id);
    console.log('User ID from request:', req.body.userId);
    console.log('Token user object:', req.user);

    // Verify user ID match with updated auth pattern - convert both to strings for comparison
    if (String(req.body.userId) !== String(req.user.id)) {
      return res.status(403).json({ 
        message: 'User ID mismatch',
        tokenId: String(req.user.id),
        requestId: String(req.body.userId)
      });
    }

    // Upload file to S3
    const s3Result = await S3Service.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Generate a signed URL for the uploaded file
    const fileUrl = await S3Service.getSignedUrl(s3Result.key);

    // Create report record in database
    const report = new Report({
      userId: req.user.id,
      filename: s3Result.fileName,
      originalFilename: req.file.originalname,
      description: req.body.description || `Uploaded on ${new Date().toLocaleDateString()}`,
      reportType: req.body.reportType || determineReportType(req.file.mimetype, req.file.originalname),
      fileUrl: fileUrl,
      s3Key: s3Result.key,
      fileSize: req.file.size,
      contentType: req.file.mimetype,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    });

    await report.save();

    // Return the report data
    res.status(201).json(report.toPublicJSON());
  } catch (error) {
    console.error('Error in file upload:', error);
    res.status(500).json({ message: `Error uploading file: ${error.message}` });
  }
});

/**
 * @route GET /api/reports/user/:userId
 * @desc Get all reports for a user
 * @access Private
 */
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Debug logging
    console.log('User ID from token:', req.user.id);
    console.log('User ID from params:', req.params.userId);
    
    // Verify user ID match with updated auth pattern - convert both to strings for comparison
    if (String(req.params.userId) !== String(req.user.id)) {
      return res.status(403).json({ 
        message: 'Access denied',
        tokenId: String(req.user.id),
        requestId: String(req.params.userId)
      });
    }

    const reports = await Report.find({ 
      userId: req.params.userId,
      status: { $ne: 'deleted' }
    }).sort({ createdAt: -1 });

    res.json(reports.map(report => report.toPublicJSON()));
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

/**
 * @route GET /api/reports/:id
 * @desc Get a specific report
 * @access Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns this report with updated auth pattern
    if (report.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(report.toPublicJSON());
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

/**
 * @route GET /api/reports/:id/url
 * @desc Get a fresh signed URL for a report
 * @access Private
 */
router.get('/:id/url', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns this report
    if (String(report.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate a fresh signed URL with a longer expiry time (24 hours default)
    const freshUrl = await S3Service.getSignedUrl(report.s3Key, 86400);
    
    // Return only the URL
    res.json({ url: freshUrl });
  } catch (error) {
    console.error('Error refreshing signed URL:', error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

/**
 * @route GET /api/reports/:id/download
 * @desc Proxy download from S3 to bypass CORS issues
 * @access Private
 */
router.get('/:id/download', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns this report
    if (String(report.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log(`Processing download for report ${req.params.id}`);
    
    try {
      // Get the S3 object directly
      const params = {
        Bucket: S3Service.bucketName,
        Key: report.s3Key
      };
      
      console.log('Fetching S3 object with params:', params);
      
      // Get the object from S3
      const s3Object = await S3Service.s3.getObject(params).promise();
      
      // Set appropriate content type and filename
      res.set('Content-Type', s3Object.ContentType || report.contentType || 'application/octet-stream');
      res.set('Content-Length', s3Object.ContentLength);
      res.set('Content-Disposition', `attachment; filename="${report.originalFilename || report.filename || 'download'}"`);
      
      // Stream the file directly to the client
      console.log('Streaming file to client:', report.originalFilename);
      res.send(s3Object.Body);
      
      console.log('File sent successfully!');
    } catch (s3Error) {
      console.error('Error streaming from S3, falling back to redirect:', s3Error);
      
      // Fallback to redirect if direct streaming fails
      const s3Url = await S3Service.getSignedUrl(report.s3Key, 3600); // 1 hour expiry
      
      // Set content disposition headers for download
      res.set('Content-Disposition', `attachment; filename="${report.originalFilename || report.filename || 'download'}"`);
      
      // Proxy the request to S3 (redirect to the signed URL)
      res.redirect(s3Url);
    }
  } catch (error) {
    console.error('Error proxying download:', error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

/**
 * @route DELETE /api/reports/:id
 * @desc Delete a report and optionally remove from S3
 * @access Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns this report
    if (String(report.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const shouldDeleteFromS3 = req.query.deleteFromS3 === 'true';
    console.log(`Delete request for report ${req.params.id}, deleteFromS3=${shouldDeleteFromS3}`);
    
    // First try to delete from S3 if requested
    if (shouldDeleteFromS3 && report.s3Key) {
      try {
        console.log(`Attempting to delete file ${report.s3Key} from S3`);
        await S3Service.deleteFile(report.s3Key);
        console.log(`Successfully deleted file from S3: ${report.s3Key}`);
      } catch (s3Error) {
        console.error('Error deleting file from S3:', s3Error);
        // Don't fail the whole request if S3 deletion fails
        // Just log it and continue with DB deletion
      }
    }

    // Then delete from MongoDB (either mark as deleted or permanent delete)
    if (shouldDeleteFromS3) {
      // Permanently delete if we're also deleting from S3
      await Report.deleteOne({ _id: report._id });
      console.log(`Permanently deleted report ${report._id} from database`);
    } else {
      // Just mark as deleted otherwise
      report.status = 'deleted';
      await report.save();
      console.log(`Marked report ${report._id} as deleted in database`);
    }
    
    res.json({ 
      message: 'Report deleted successfully',
      deletedFromS3: shouldDeleteFromS3,
      reportId: report._id,
      s3Key: shouldDeleteFromS3 ? report.s3Key : null
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Helper function to determine report type
function determineReportType(mimeType, fileName) {
  if (mimeType.startsWith('image/')) {
    return 'Image';
  } else if (mimeType === 'application/pdf') {
    return 'PDF Document';
  } else if (mimeType === 'application/msword' || 
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'Medical Report';
  }
  
  // Fallback to checking file extension
  const extension = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
    return 'Image';
  } else if (extension === 'pdf') {
    return 'PDF Document';
  } else if (['doc', 'docx'].includes(extension)) {
    return 'Medical Report';
  }
  
  return 'Other Document';
}

export default router; 