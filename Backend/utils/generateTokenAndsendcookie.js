import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const generateTokenAndsendcookie = async (res, userid) => {
  // Get the full user object
  const user = await User.findById(userid).select('-password');
  if (!user) {
    throw new Error('User not found');
  }

  // Create token with user data
  const token = jwt.sign(
    { 
      id: user._id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      uid: user.uid
    }, 
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
