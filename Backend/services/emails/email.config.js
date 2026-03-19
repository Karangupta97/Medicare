import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error(
    "Email service misconfigured: RESEND_API_KEY is not set. " +
      "Set RESEND_API_KEY in your environment to enable email sending."
  );
}

// Initialize Resend instance
export const resend = new Resend(resendApiKey);


// Sender format - as a string
export const sender = process.env.RESEND_SENDER || "Medicare <noreply@medicares.in>";




 
