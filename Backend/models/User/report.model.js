import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    reportType: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["medical", "lab", "prescription", "other"],
      default: "medical",
    },
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model("Report", reportSchema);