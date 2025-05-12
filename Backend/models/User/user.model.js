import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
    default: "",
  },
  photoURL: {
    type: String,
    default: "",
  },
  umid: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "hospital", "medical", "admin", "founder", "patient"],
    default: "user",
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  lastLOGIN: {
    type: Date,
    default: Date.now,
  },
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report"
  }],
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription"
  }],
}, {
  timestamps: true,
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema); 