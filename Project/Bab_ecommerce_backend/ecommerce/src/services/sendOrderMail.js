const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP settings for your provider
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Your Store" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
