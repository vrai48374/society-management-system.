import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL,  // e.g. "Society Admin <onboarding@resend.dev>"
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(` Email sent to ${options.to}`);
    return data;
  } catch (error) {
    console.error(` Failed to send email to ${options.to}:`, error.message);
    throw error;
  }
};
