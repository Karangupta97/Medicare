import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  reportType: {
    type: String,
    enum: ['Image', 'PDF Document', 'Medical Report', 'Other Document'],
    default: 'Other Document'
  },
  fileUrl: {
    type: String,
    required: true
  },
  s3Key: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  contentType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  tags: [{
    type: String
  }]
}, { timestamps: true });

// Add a method to transform report into a simplified public object
reportSchema.methods.toPublicJSON = function() {
  const report = this.toObject();
  return {
    _id: report._id,
    userId: report.userId,
    filename: report.originalFilename,
    description: report.description,
    reportType: report.reportType,
    fileUrl: report.fileUrl,
    fileSize: report.fileSize,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    status: report.status,
    tags: report.tags
  };
};

// Create a text index for search functionality
reportSchema.index({ 
  filename: 'text', 
  originalFilename: 'text', 
  description: 'text', 
  tags: 'text' 
});

const Report = mongoose.model('Report', reportSchema);

export default Report; 