import { Report } from "../models/report.model.js";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';

// Initialize S3 client with additional configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Use path-style S3 URLs
});

// Valid categories
const VALID_CATEGORIES = ['xrays', 'lab', 'forms'];

// Get all reports for the authenticated user
export const getReports = async (req, res) => {
  try {
    console.log(`Fetching reports for user ID: ${req.user.id}`);
    
    if (!req.user || !req.user.id) {
      console.error('User ID is missing in the request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required. User ID is missing.',
      });
    }
    
    const reports = await Report.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${reports.length} reports for user ID: ${req.user.id}`);
    
    // Generate fresh signed URLs for each report
    const reportsWithUrls = await Promise.all(reports.map(async (report) => {
      try {
        console.log(`Generating signed URL for report ID: ${report._id}, S3 key: ${report.s3Key}`);
        
        const fileUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: report.s3Key,
          }),
          { expiresIn: 3600 } // URL expires in 1 hour
        );
        
        console.log(`Successfully generated signed URL for report ID: ${report._id}`);
        
        // Create a new object with the updated URL
        return {
          ...report.toObject(),
          fileUrl
        };
      } catch (error) {
        console.error(`Error generating signed URL for report ${report._id}:`, error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        return report;
      }
    }));
    
    console.log(`Successfully processed ${reportsWithUrls.length} reports with signed URLs`);
    
    res.json({ success: true, reports: reportsWithUrls });
  } catch (error) {
    console.error('Error fetching reports:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Upload a new report
export const uploadReport = async (req, res) => {
  try {
    const { description, category, title } = req.body;
    const file = req.file;

    console.log("Upload request received:", { 
      description, 
      category, 
      title, 
      userId: req.user?.id,
      userName: req.user?.name,
      file: file ? { 
        originalname: file.originalname, 
        mimetype: file.mimetype, 
        size: file.size 
      } : null 
    });

    if (!req.user || !req.user.id) {
      console.error("User information missing in request");
      return res.status(401).json({
        success: false,
        message: 'Authentication required. User information is missing.',
      });
    }

    if (!file) {
      console.error("No file provided in request");
      return res.status(400).json({
        success: false,
        message: 'Please upload a file.',
      });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/dicom'];
    if (!allowedTypes.includes(file.mimetype)) {
      console.error(`Invalid file type: ${file.mimetype}`);
      return res.status(415).json({
        success: false,
        message: 'Invalid file type. Only PDF, JPG, PNG, and DICOM files are allowed.',
      });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      console.error(`File size too large: ${file.size} bytes`);
      return res.status(413).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.',
      });
    }

    const fileExtension = path.extname(file.originalname);
    const randomString = crypto.randomBytes(16).toString('hex');
    
    // Create a formatted filename: name-originfilename-date-time
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    
    // Get the original filename without extension
    const originalNameWithoutExt = path.basename(file.originalname, fileExtension);
    
    // Create the formatted filename
    const formattedFilename = `${req.user.name}-${originalNameWithoutExt}-${dateStr}-${timeStr}${fileExtension}`;
    
    // Create a user-specific folder path using the user ID
    const userFolder = `user-reports/${req.user.name}+${req.user.id}`;
    const s3Key = `${userFolder}/${randomString}${fileExtension}`;

    try {
      console.log("Uploading to S3 with key:", s3Key);
      
      // Upload to S3
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      console.log("File uploaded to S3 successfully");

      // Generate a signed URL for the uploaded file
      const fileUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
        }),
        { expiresIn: 3600 } // URL expires in 1 hour
      );

      console.log("Generated signed URL for file");

      // Create report in database
      const report = new Report({
        userId: req.user.id,
        filename: formattedFilename, // Use the formatted filename
        originalFilename: title || file.originalname, // Use title if provided, otherwise use original filename
        description: description || `Uploaded on ${new Date().toLocaleDateString()}`,
        reportType: file.mimetype,
        fileUrl,
        s3Key,
        fileSize: file.size,
        contentType: file.mimetype,
        category: category || 'medical', // Add category field with default value
        tags: []
      });

      console.log("Saving report to MongoDB:", report);
      const savedReport = await report.save();
      console.log("Report saved successfully:", savedReport);

      res.status(201).json({
        success: true,
        message: 'Report uploaded successfully',
        report: savedReport,
      });
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw new Error('Failed to upload file to S3: ' + error.message);
    }
  } catch (error) {
    console.error('Error uploading report:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload report. Please try again.',
    });
  }
};

// Get a specific report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    // Generate a new signed URL for the file
    const fileUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: report.s3Key,
      }),
      { expiresIn: 3600 }
    );

    // Update the report with the new signed URL
    report.fileUrl = fileUrl;
    await report.save();

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report. Please try again.',
    });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    console.log(`Attempting to delete report with ID: ${req.params.id} for user: ${req.user.id}`);
    
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!report) {
      console.log(`Report not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    console.log(`Found report to delete: ${report.originalFilename}, S3 key: ${report.s3Key}`);

    try {
      // Delete file from S3
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: report.s3Key,
        })
      );
      console.log(`Successfully deleted file from S3: ${report.s3Key}`);
    } catch (s3Error) {
      console.error('Error deleting file from S3:', s3Error);
      // Continue with database deletion even if S3 deletion fails
      // This prevents orphaned database records
    }

    // Delete report from database
    await report.deleteOne();
    console.log(`Successfully deleted report from database: ${req.params.id}`);

    res.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: `Failed to delete report: ${error.message}`,
    });
  }
}; 