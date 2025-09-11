import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail
    pass: process.env.EMAIL_PASS,   // app password (not your Gmail password)
  },
});

// Function to send email
export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Society Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
