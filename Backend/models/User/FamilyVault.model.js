import mongoose from "mongoose";
import { getPatientDB } from "../../DB/connections.js";

const familyVaultMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  relationship: {
    type: String,
    enum: ["child", "parent", "spouse", "sibling", "dependent", "other"],
    required: true,
  },
  permissions: {
    canViewReports: {
      type: Boolean,
      default: true,
    },
    canViewMedicalInfo: {
      type: Boolean,
      default: true,
    },
    canViewEmergencyFolder: {
      type: Boolean,
      default: true,
    },
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const familyVaultSchema = new mongoose.Schema({
  headMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: "My Family",
  },
  members: [familyVaultMemberSchema],
  planType: {
    type: String,
    enum: ["pro", "premium"],
    required: true,
  },
  maxMembers: {
    type: Number,
    required: true,
    default: 2,
  },
}, {
  timestamps: true,
});

// Set maxMembers based on planType before saving
familyVaultSchema.pre("save", function (next) {
  if (this.planType === "premium") {
    this.maxMembers = 6;
  } else {
    this.maxMembers = 2;
  }
  next();
});

export const FamilyVault = () => getPatientDB().model("FamilyVault", familyVaultSchema);
