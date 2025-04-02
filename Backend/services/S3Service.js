import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

class S3Service {
  constructor() {
    // Debug environment variables
    console.log('AWS Environment Variables:');
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'DEFINED' : 'UNDEFINED');
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'DEFINED' : 'UNDEFINED');
    console.log('AWS_REGION:', process.env.AWS_REGION || 'us-east-1');
    console.log('AWS_S3_BUCKET_NAME:', process.env.AWS_S3_BUCKET_NAME || 'NOT DEFINED');
    
    // Configure AWS SDK
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    this.s3 = new aws.S3();
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    // Ensure bucket name is defined
    if (!this.bucketName) {
      console.error('AWS S3 BUCKET NAME is not defined in environment variables!');
    } else {
      console.log(`S3 bucket name set to: ${this.bucketName}`);
    }
  }

  /**
   * Upload a file to S3
   * @param {Buffer} fileBuffer - The file buffer
   * @param {String} fileName - Original file name
   * @param {String} contentType - File MIME type
   * @returns {Promise<Object>} - Upload result with URL
   */
  async uploadFile(fileBuffer, fileName, contentType) {
    try {
      // Generate a unique file name to prevent duplicates
      const fileExtension = fileName.split('.').pop();
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;
      const key = `reports/${uniqueFileName}`;

      // Verify bucket name again before upload
      if (!this.bucketName) {
        throw new Error('S3 bucket name is not defined. Check your environment variables.');
      }

      // Set upload parameters
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType
      };

      console.log('S3 upload params:', { ...params, Body: 'BUFFER_CONTENT' });

      // Upload to S3
      const uploadResult = await this.s3.upload(params).promise();

      return {
        key: uploadResult.Key,
        url: uploadResult.Location,
        fileName: uniqueFileName,
        originalName: fileName
      };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  /**
   * Delete a file from S3
   * @param {String} fileKey - The file key in S3
   * @returns {Promise<Object>} - Deletion result
   */
  async deleteFile(fileKey) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileKey
      };

      const result = await this.s3.deleteObject(params).promise();
      return result;
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error(`Failed to delete file from S3: ${error.message}`);
    }
  }

  /**
   * Get a signed URL for temporary access to a private file
   * @param {String} fileKey - The file key in S3
   * @param {Number} expirySeconds - URL expiry time in seconds
   * @returns {String} - Signed URL
   */
  getSignedUrl(fileKey, expirySeconds = 86400) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
        Expires: expirySeconds
      };

      return this.s3.getSignedUrl('getObject', params);
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }
}

const s3Service = new S3Service();
export default s3Service; 