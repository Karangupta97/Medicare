import { mailjet, sender } from "./email.config.js";

const normalizeRecipients = ({ to, toEmail, toName }) => {
  if (Array.isArray(to) && to.length > 0) {
    return to.map((entry) => {
      const email = entry.Email || entry.email;
      if (!email) {
        throw new Error("Recipient email is required for Mailjet email.");
      }

      return {
        Email: email,
        Name: entry.Name || entry.name || "Recipient",
      };
    });
  }

  if (!toEmail) {
    throw new Error("toEmail is required for Mailjet email.");
  }

  return [
    {
      Email: toEmail,
      Name: toName || "Recipient",
    },
  ];
};

const normalizeSender = ({ fromEmail, fromName }) => {
  if (fromEmail) {
    return {
      Email: fromEmail,
      Name: fromName || "Medicare",
    };
  }

  return sender;
};

const stripHtml = (value) => {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

export const sendMailjetEmail = async ({
  to,
  toEmail,
  toName,
  subject,
  html,
  text,
  fromEmail,
  fromName,
  customId,
}) => {
  if (!subject) {
    throw new Error("subject is required for Mailjet email.");
  }

  if (!html) {
    throw new Error("html is required for Mailjet email.");
  }

  const message = {
    From: normalizeSender({ fromEmail, fromName }),
    To: normalizeRecipients({ to, toEmail, toName }),
    Subject: subject,
    HTMLPart: html,
    TextPart: text || stripHtml(html),
  };

  if (customId) {
    message.CustomID = customId;
  }

  const response = await mailjet
    .post("send", { version: "v3.1" })
    .request({ Messages: [message] });

  const result = response?.body?.Messages?.[0];
  const recipient = result?.To?.[0];

  if (!result || result.Status !== "success") {
    const errorMessage =
      result?.Errors?.[0]?.ErrorMessage ||
      response?.body?.ErrorMessage ||
      "Failed to send Mailjet email.";
    throw new Error(errorMessage);
  }

  return {
    id: recipient?.MessageID || recipient?.MessageUUID || null,
    status: result.Status,
    messageId: recipient?.MessageID || null,
    messageUUID: recipient?.MessageUUID || null,
    messageHref: recipient?.MessageHref || null,
  };
};
