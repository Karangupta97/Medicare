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

// Get permanent (non-expiring) URL using bucket and key
// This creates a URL that doesn't expire but requires the object to be public or have appropriate permissions
const getPermanentUrl = (bucketName, key) => {
  // Format: https://<bucket-name>.s3.<region>.amazonaws.com/<object-key>
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const uploadFile = async (file, userId, userName, isPermanent = false) => {
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
    
    // Create appropriate folder based on file type
    const folderPath = isPermanent 
      ? `profile-pictures/${userId}` 
      : `user-reports/${userName}+${userId}`;
    
    const s3Key = `${folderPath}/${randomString}${fileExtension}`;

    console.log('Preparing to upload file to S3:', {
      bucket: process.env.AWS_S3_BUCKET,
      key: s3Key,
      contentType: file.mimetype,
      fileSize: file.size,
      isPermanent
    });

    // Validate AWS credentials and bucket
    if (!process.env.AWS_S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS configuration is incomplete');
    }

    try {
      // For permanent profile pictures, set public-read ACL
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      
      // Add ACL for public read access if it's a profile picture
      if (isPermanent) {
        uploadParams.ACL = 'public-read';
      }
      
      await s3Client.send(new PutObjectCommand(uploadParams));
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

    let fileUrl;
    
    if (isPermanent) {
      // Use permanent URL for profile pictures
      fileUrl = getPermanentUrl(process.env.AWS_S3_BUCKET, s3Key);
      console.log('Generated permanent URL for profile picture:', { fileUrl });
    } else {
      // Use pre-signed URL with expiration for regular files
      fileUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
        }),
        { expiresIn: 3600 }
      );
      console.log('Generated signed URL for uploaded file:', { fileUrl });
    }

    return {
      s3Key,
      fileUrl,
      formattedFilename,
      isPermanent
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
};export const getFileUrl = async (s3Key, isPermanent = false) => {
  try {
    if (isPermanent) {
      // Return permanent URL for profile pictures
      return getPermanentUrl(process.env.AWS_S3_BUCKET, s3Key);
    } else {
      // Return pre-signed URL with expiration for regular files
      const fileUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
        }),
        { expiresIn: 3600 } // URL expires in 1 hour
      );
      return fileUrl;
    }
  } catch (error) {
    console.error('S3 get URL error:', error);
    throw error;
  }
};

// Specific function for uploading profile pictures with permanent URLs
export const uploadProfilePicture = async (file, userId, userName) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('Invalid profile picture: File or file buffer is missing');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type for profile picture. Only JPEG, JPG and PNG images are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('Profile picture too large. Maximum size is 5MB');
    }

    // Use the uploadFile function with isPermanent=true for profile pictures
    const result = await uploadFile(file, userId, userName, true);
    
    console.log('Profile picture uploaded successfully with permanent URL:', {
      userId,
      s3Key: result.s3Key,
      fileUrl: result.fileUrl
    });
    
    return result;
  } catch (error) {
    console.error('Profile picture upload error:', {
      error: error.message,
      userId,
      fileName: file?.originalname,
    });
    throw error;
  }
};

