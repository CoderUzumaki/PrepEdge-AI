/**
 * @module services/contactService
 * @description Contact form email delivery via Gmail SMTP.
 */

import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

/**
 * Sends a contact form message to the configured inbox.
 * @param {Object} data - Validated contact form payload
 * @returns {Promise<void>}
 */
export const sendContactEmail = async (data) => {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    throw AppError.fromCode(ERROR_CODES.UPSTREAM_FAILURE, "Email service not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: data.email,
    to: env.EMAIL_RECEIVER || env.EMAIL_USER,
    subject: `${data.category} - ${data.subject}`,
    html: `
      <h3>PrepEdge AI: New Message</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Category:</strong> ${data.category}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  });
};
