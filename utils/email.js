import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail
    pass: process.env.EMAIL_PASS,   // app password (not your Gmail password)
  },
});

// Function to send email
// REPLACE IT WITH THIS NEW FUNCTION
export const sendEmail = async (options) => {
  await transporter.sendMail({
    from: `"Society Admin" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html, // This also adds support for HTML emails
  });
};
