import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   //  Gmail
    pass: process.env.EMAIL_PASS,   // app password (not  Gmail password)
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Transporter error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});


// Function to send email
// REPLACE IT WITH THIS NEW FUNCTION
// Update your sendEmail function
export const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: `"Society Admin" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    
    console.log(`Email sent to ${options.to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${options.to}:`, error);
    throw error;
  }
};