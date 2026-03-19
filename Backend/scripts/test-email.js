import dotenv from "dotenv";

dotenv.config();

import { resend, sender } from "../services/emails/email.config.js";

const to = process.argv[2];

if (!to) {
  console.error("Usage: node scripts/test-email.js <recipient-email>");
  process.exit(1);
}

const subject = `Medicare email test (${new Date().toISOString()})`;
const html = `
  <div style="font-family: Arial, sans-serif">
    <h2>Medicare email test</h2>
    <p>If you received this, your Resend integration is working.</p>
    <p><strong>Time:</strong> ${new Date().toString()}</p>
  </div>
`;

try {
  const { data, error } = await resend.emails.send({
    from: sender,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    process.exit(2);
  }

  console.log("Sent OK:", data);
} catch (err) {
  console.error("Send failed:", err);
  process.exit(3);
}

