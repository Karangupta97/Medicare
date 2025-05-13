import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { FOUNDER_OTP_LOGIN_TEMPLATE } from "./emailTemplates.js";
import { FOUNDER_SENSITIVE_ACTION_OTP_TEMPLATE } from "./emailTemplates.js";
import { STAFF_WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { STAFF_PASSWORD_RESET_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { resend, sender } from "./email.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send verification email");
    }

    console.log("Verification email sent successfully", data);
  } catch (error) {
    console.error(`Error sending verification email:`, error);
    throw new Error(`Error sending verification: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Welcome to Medicare",
      html: `<p>Welcome, ${name}!</p>`,
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send welcome email");
    }

    console.log("Welcome email sent successfully", data);
  } catch (error) {
    console.error(`Error sending welcome email:`, error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send password reset email");
    }

    console.log("Password reset email sent successfully", data);
  } catch (error) {
    console.error(`Error sending password reset email:`, error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send password reset success email");
    }

    console.log("Password reset success email sent successfully", data);
  } catch (error) {
    console.error(`Error sending password reset success email:`, error);
    throw new Error(`Error sending password reset success email: ${error.message}`);
  }
};

export const sendFounderLoginOTP = async (email, otpCode, ipAddress) => {
  try {
    // Create timestamp in a human-readable format
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Replace template placeholders
    let emailContent = FOUNDER_OTP_LOGIN_TEMPLATE
      .replace("{otpCode}", otpCode)
      .replace("{ipAddress}", ipAddress)
      .replace("{timestamp}", timestamp);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Medicare Founder Portal: Security Verification Code",
      html: emailContent,
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send founder login OTP");
    }

    console.log("Founder login OTP email sent successfully", data);
  } catch (error) {
    console.error(`Error sending founder login OTP:`, error);
    throw new Error(`Error sending founder login OTP: ${error.message}`);
  }
};

export const sendFounderSensitiveActionOTP = async (email, otpCode, actionType, actionDetails, ipAddress) => {
  try {
    // Create timestamp in a human-readable format
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Replace template placeholders
    let emailContent = FOUNDER_SENSITIVE_ACTION_OTP_TEMPLATE
      .replace("{otpCode}", otpCode)
      .replace("{actionType}", actionType)
      .replace("{actionDetails}", actionDetails)
      .replace("{timestamp}", timestamp)
      .replace("{ipAddress}", ipAddress);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "URGENT: Medicare Sensitive Action Verification Required",
      html: emailContent,
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send sensitive action OTP");
    }

    console.log("Sensitive action OTP email sent successfully", data);
  } catch (error) {
    console.error(`Error sending sensitive action OTP:`, error);
    throw new Error(`Error sending sensitive action OTP: ${error.message}`);
  }
};

/**
 * Send welcome email to a new staff member with login credentials
 * @param {string} email - Staff member's email
 * @param {string} name - Staff member's name
 * @param {string} temporaryPassword - Generated temporary password
 * @param {string} staffId - Generated staff ID
 */
export const sendStaffWelcomeEmail = async (email, name, temporaryPassword, staffId) => {
  try {
    // Get current year for copyright
    const currentYear = new Date().getFullYear();
    
    // Login URL (frontend staff login page)
    const loginUrl = `${process.env.CLIENT_URL}/staff/login`;
    
    // Replace template placeholders
    let emailContent = STAFF_WELCOME_EMAIL_TEMPLATE
      .replace("{staffName}", name)
      .replace("{staffEmail}", email)
      .replace("{staffId}", staffId)
      .replace("{temporaryPassword}", temporaryPassword)
      .replace("{loginUrl}", loginUrl)
      .replace("{currentYear}", currentYear);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Welcome to Medicare Staff - Your Account Details",
      html: emailContent,
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send staff welcome email");
    }

    console.log("Staff welcome email sent successfully", data);
  } catch (error) {
    console.error(`Error sending staff welcome email:`, error);
    throw new Error(`Error sending staff welcome email: ${error.message}`);
  }
};

/**
 * Send password reset email to a staff member
 * @param {string} email - Staff member's email
 * @param {string} name - Staff member's name
 * @param {string} temporaryPassword - Generated temporary password
 */
export const sendStaffPasswordResetEmail = async (email, name, temporaryPassword) => {
  try {
    // Login URL (frontend staff login page)
    const loginUrl = `${process.env.CLIENT_URL}/staff/login`;
    
    // Replace template placeholders
    let emailContent = STAFF_PASSWORD_RESET_EMAIL_TEMPLATE
      .replace("{staffName}", name)
      .replace("{temporaryPassword}", temporaryPassword)
      .replace("{loginUrl}", loginUrl);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Medicare Staff - Your Password Has Been Reset",
      html: emailContent,
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send staff password reset email");
    }

    console.log("Staff password reset email sent successfully", data);
  } catch (error) {
    console.error(`Error sending staff password reset email:`, error);
    throw new Error(`Error sending staff password reset email: ${error.message}`);
  }
};
