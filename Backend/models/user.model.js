import mongoose from "mongoose";

const geoLocationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number, 
    required: true
  }
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true, 
    },
    name: {
      type: String,
      required: true,
    },
    lastname: { 
      type: String, 
      required: false,
    },
    photoURL: {
      type: String,
      default: null,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    umid: { 
      type: String, 
      unique: true 
    },
    phone: {
      type: String,
      required: false,
    },
    dob: {
      type: String,
      required: false,
    },
    addressLine1: {
      type: String,
      required: false,
    },
    addressLine2: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    district: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: false,
    },
    addressValidated: {
      type: Boolean,
      default: false
    },
    geoLocation: {
      type: geoLocationSchema,
      required: false
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
    lastLOGIN: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
