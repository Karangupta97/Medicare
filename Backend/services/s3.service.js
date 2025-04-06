import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Validate AWS credentials during initialization
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('AWS credentials are missing or invalid. Please check the .env file.');
  throw new Error('AWS credentials are not properly configured.');
}

if (!process.env.AWS_REGION) {
  console.error('AWS region is missing. Please check the .env file.');
  throw new Error('AWS region is not properly configured.');
}

if (!process.env.AWS_S3_BUCKET) {
  console.error('AWS S3 bucket name is missing. Please check the .env file.');
  throw new Error('AWS S3 bucket name is not properly configured.');
}

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
    if (!file || !file.buffer) {
      throw new Error('Invalid file: File or file buffer is missing');
    }

    if (!userId || !userName) {
      throw new Error('Invalid parameters: User ID and name are required');
    }

    const fileExtension = path.extname(file.originalname);
    const randomString = crypto.randomBytes(16).toString('hex');
    const now = Date.now();
    const originalNameWithoutExt = path.basename(file.originalname, fileExtension);
    const formattedFilename = `${originalNameWithoutExt}-${now}${fileExtension}`;
    const userFolder = `user-reports/${userName}+${userId}`;
    const s3Key = `${userFolder}/${randomString}${fileExtension}`;

    console.log('Preparing to upload file to S3:', {
      bucket: process.env.AWS_S3_BUCKET,
      key: s3Key,
      contentType: file.mimetype,
      fileSize: file.size,
    });

    // Validate AWS credentials and bucket
    if (!process.env.AWS_S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS configuration is incomplete');
    }

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      console.log('File successfully uploaded to S3:', { key: s3Key });
    } catch (uploadError) {
      console.error('S3 upload error details:', uploadError);
      if (uploadError.name === 'NoSuchBucket') {
        throw new Error('S3 bucket not found');
      } else if (uploadError.name === 'AccessDenied') {
        throw new Error('Access denied to S3 bucket');
      }
      throw new Error(`Failed to upload to S3: ${uploadError.message}`);
    }

    const fileUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
      }),
      { expiresIn: 3600 }
    );

    console.log('Generated signed URL for uploaded file:', { fileUrl });

    return {
      s3Key,
      fileUrl,
      formattedFilename,
    };
  } catch (error) {
    console.error('File upload error:', {
      error: error.message,
      userId,
      fileName: file?.originalname,
    });
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