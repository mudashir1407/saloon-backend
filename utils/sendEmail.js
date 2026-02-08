const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Google App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"Salon & Spa ✂️" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:");
    console.log("➡️ To:", to);
    console.log("📨 Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(error.message);
    throw error;
  }
};

module.exports = sendEmail;
