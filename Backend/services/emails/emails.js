import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { FOUNDER_OTP_LOGIN_TEMPLATE } from "./emailTemplates.js";
import { FOUNDER_SENSITIVE_ACTION_OTP_TEMPLATE } from "./emailTemplates.js";
import { STAFF_WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { STAFF_PASSWORD_RESET_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { resend, sender } from "./email.config.js";
import { DOCTOR_APPROVAL_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { DOCTOR_REJECTION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { FAMILY_VAULT_INVITE_EMAIL_TEMPLATE } from "./emailTemplates.js";

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
      console.error(`Resend error (verification):`, { email, error });
      throw new Error(error?.message || "Failed to send verification email");
    }

    console.log("Verification email sent successfully", { email, id: data?.id });
    return data;
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
      console.error(`Resend error (welcome):`, { email, error });
      throw new Error(error?.message || "Failed to send welcome email");
    }

    console.log("Welcome email sent successfully", { email, id: data?.id });
    return data;
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
      console.error(`Resend error (password reset request):`, { email, error });
      throw new Error(error?.message || "Failed to send password reset email");
    }

    console.log("Password reset email sent successfully", { email, id: data?.id });
    return data;
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
      console.error(`Resend error (password reset success):`, { email, error });
      throw new Error(error?.message || "Failed to send password reset success email");
    }

    console.log("Password reset success email sent successfully", { email, id: data?.id });
    return data;
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

/**
 * Send approval email to a doctor whose account has been verified
 * @param {string} email - Doctor's email
 * @param {string} name - Doctor's name
 */
export const sendDoctorApprovalEmail = async (email, name) => {
  try {
    // Login URL (frontend doctor login page)
    const loginUrl = `${process.env.CLIENT_URL}/doctor/login`;
    
    // Replace template placeholders
    let emailContent = DOCTOR_APPROVAL_EMAIL_TEMPLATE
      .replace("{doctorName}", name)
      .replace("{loginUrl}", loginUrl);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Medicare - Your Doctor Account is Approved",
      html: emailContent,
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send doctor approval email");
    }

    console.log("Doctor approval email sent successfully", data);
  } catch (error) {
    console.error(`Error sending doctor approval email:`, error);
    throw new Error(`Error sending doctor approval email: ${error.message}`);
  }
};

/**
 * Send rejection email to a doctor whose account has been rejected
 * @param {string} email - Doctor's email
 * @param {string} name - Doctor's name
 * @param {string} rejectionReason - Reason for rejection
 */
export const sendDoctorRejectionEmail = async (email, name, rejectionReason) => {
  try {
    // Replace template placeholders
    let emailContent = DOCTOR_REJECTION_EMAIL_TEMPLATE
      .replace("{doctorName}", name)
      .replace("{rejectionReason}", rejectionReason);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Medicare - Doctor Account Application Status",
      html: emailContent,
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send doctor rejection email");
    }

    console.log("Doctor rejection email sent successfully", data);
  } catch (error) {
    console.error(`Error sending doctor rejection email:`, error);
    throw new Error(`Error sending doctor rejection email: ${error.message}`);
  }
};

/**
 * Send verification email to a doctor who just registered
 * @param {string} email - Doctor's email
 * @param {string} verificationToken - Verification token or code
 */
export const sendDoctorVerificationEmail = async (email, verificationToken) => {
  try {
    // Use the same template as regular verification emails
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Medicare - Doctor Registration Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send doctor verification email");
    }

    console.log("Doctor verification email sent successfully", data);
  } catch (error) {
    console.error(`Error sending doctor verification email:`, error);
    throw new Error(`Error sending doctor verification email: ${error.message}`);
  }
};

/**
 * Send Family Vault invitation email with OTP
 * @param {string} email - Invitee's email
 * @param {string} otpCode - 6-digit OTP
 * @param {string} headMemberName - Name of the head member
 * @param {string} vaultName - Name of the family vault
 * @param {string} relationship - Relationship type (child, parent, spouse, etc.)
 */
export const sendFamilyVaultInviteEmail = async (email, otpCode, headMemberName, vaultName, relationship) => {
  try {
    let emailContent = FAMILY_VAULT_INVITE_EMAIL_TEMPLATE
      .replace("{otpCode}", otpCode)
      .replace("{headMemberName}", headMemberName)
      .replace("{vaultName}", vaultName)
      .replace("{relationship}", relationship);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: `Medicare Family Vault - You've been invited to join "${vaultName}"`,
      html: emailContent,
    });

    if (error) {
      console.error(`Error:`, error);
      throw new Error("Failed to send Family Vault invite email");
    }

    console.log("Family Vault invite email sent successfully", data);
  } catch (error) {
    console.error(`Error sending Family Vault invite email:`, error);
    throw new Error(`Error sending Family Vault invite email: ${error.message}`);
  }
};
