import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";

export const sendContactEmail = async (data) => {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    throw new AppError("Email service not configured", 503);
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
