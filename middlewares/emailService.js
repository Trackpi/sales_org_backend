const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use other services like Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Use the environment variable for the email
    pass: process.env.EMAIL_PASS, // Use the environment variable for the password
  },
});

// Send email function
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use the environment variable for the sender email
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
