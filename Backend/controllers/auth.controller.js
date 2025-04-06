import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateTokenAndsendcookie } from "../utils/generateTokenAndsendcookie.js";
import { uploadFile } from "../services/s3.service.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from "../emails/emails.js";
import dotenv from "dotenv";

dotenv.config();

export const generateUID = () => {
  // Generate a random 16-digit number (divided into 4 groups)
  const randomNumbers = Array.from(
    { length: 4 },
    () => Math.floor(10000 + Math.random() * 90000) // Generates a number between 10000-99999
  ).join(" ");

  const uid = `MED-${randomNumbers}`;
  console.log("Generated UID:", uid);
  return uid;
};

export const signup = async (req, res) => {
  const { email, password, name, lastname, photoURL } = req.body;
  try {
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }
    const userAlreadyExists = await User.findOne({ email });
    console.log("userAlreadyExists", userAlreadyExists);
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    // Generate a Unique UID
    const uniqueUID = generateUID();

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      lastname,
      uid: uniqueUID,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000, // 10 min expiry
      photoURL,
    });
    await user.save();

    const token = await generateTokenAndsendcookie(res, user._id);
    // send Verification Email with otp
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  // 123456 ---- code
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    user.isverified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name); // Corrected function call
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in VerifyEmail", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = await generateTokenAndsendcookie(res, user._id);

    // Update last login
    user.lastLOGIN = new Date();
    await user.save();

    // Send response with token
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    console.log("Error in login", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Reset password link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Update user password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();
    await sendPasswordResetSuccessEmail(
      user.email,
      `${process.env.CLIENT_URL}/login`
    );
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in resetPassword", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
      token: req.headers.authorization?.split(" ")[1],
    });
  } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const userId = req.userId; // From verifyToken middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isverified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    user.verificationToken = otp;
    user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

    // Send email
    await sendVerificationEmail(user.email, otp);

    res.status(200).json({ message: "Verification code resent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, lastname, phone } = req.body;
    const userId = req.user.id;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (lastname) updateFields.lastname = lastname;
    if (phone) updateFields.phone = phone;

    // Handle profile photo upload
    if (req.file) {
      // Validate file presence and basic properties
      if (!req.file.buffer || !req.file.mimetype || !req.file.size) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file upload: Missing required file properties'
        });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(415).json({
          success: false,
          message: 'Invalid file type. Only JPEG, JPG and PNG images are allowed'
        });
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (req.file.size > maxSize) {
        return res.status(413).json({
          success: false,
          message: 'File too large. Maximum size is 5MB'
        });
      }

      try {
        // Upload to S3 with error handling
        const { fileUrl } = await uploadFile(req.file, userId, req.user.name);
        if (!fileUrl) {
          throw new Error('Failed to get file URL after upload');
        }
        updateFields.photoURL = fileUrl;
      } catch (uploadError) {
        console.error('Profile photo upload error:', {
          error: uploadError,
          userId,
          fileName: req.file.originalname
        });
        
        // Handle specific S3 errors
        if (uploadError.code === 'NoSuchBucket') {
          return res.status(500).json({
            success: false,
            message: 'Storage configuration error'
          });
        } else if (uploadError.code === 'AccessDenied') {
          return res.status(500).json({
            success: false,
            message: 'Storage access error'
          });
        }
        
        return res.status(500).json({
          success: false,
          message: 'Failed to upload profile photo. Please try again later.'
        });
      }
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Error in updateProfile:', {
      error: error.message,
      userId: req.user?.id,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to update profile. Please try again later.'
    });
  }
};
