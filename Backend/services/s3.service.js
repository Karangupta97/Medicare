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

export const uploadFile = async (file, userId, userName) => {
  try {
    const fileExtension = path.extname(file.originalname);
    const randomString = crypto.randomBytes(16).toString('hex');
    
    // Create a formatted filename: originalname-date.now
    const now = Date.now();
    
    // Get the original filename without extension
    const originalNameWithoutExt = path.basename(file.originalname, fileExtension);
    
    // Create the formatted filename
    const formattedFilename = `${originalNameWithoutExt}-${now}${fileExtension}`;
    
    // Create a user-specific folder path using the user ID
    const userFolder = `user-reports/${userName}+${userId}`;
    const s3Key = `${userFolder}/${randomString}${fileExtension}`;

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    // Generate a signed URL for the uploaded file
    const fileUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
      }),
      { expiresIn: 3600 } // URL expires in 1 hour
    );

    return {
      s3Key,
      fileUrl,
      formattedFilename
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

export const deleteFile = async (s3Key) => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
      })
    );
  } catch (error) {
    console.error('S3 delete error:', error);
    throw error;
  }
};

export const getFileUrl = async (s3Key) => {
  try {
    const fileUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
      }),
      { expiresIn: 3600 } // URL expires in 1 hour
    );
    return fileUrl;
  } catch (error) {
    console.error('S3 get URL error:', error);
    throw error;
  }
}; 