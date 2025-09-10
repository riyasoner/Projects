require("dotenv").config();
const nodemailer = require("nodemailer");

const emailService = async (otp, name, email, yourName, yourPosition, yourCompany,link) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: "smtp.gmail.com",
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: process.env.sendmailer, // from
      to: email, // user email
      subject: "OTP Verification Mail for dating", // email subject
      html: `Your OTP for verifcation is ${otp}`, // HTML content of the email
    };

    // Send the email
    const info = await transporter.sendMail(message);
    console.log("Email sent:", info.response);
    return info.response;
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};

module.exports = emailService;



