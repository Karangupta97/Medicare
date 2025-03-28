import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

// Initialize Resend instance
export const resend = new Resend('re_nXNa5iHs_HZ99jkt9J4wGTPJbGtKFL7a3'); // Replace with process.env.RESEND_API_KEY later

// Sender format - as a string
export const sender = "Medicare <onboarding@resend.dev>";




 
