const transporter = require("../config/nodemailer");

const sendVerificationEmail = async (user, token) => {
  const verificationLink = `http://localhost:5001/api/auth/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify your RetroHub account",
    html: `
      <h2>Hello ${user.name},</h2>
      <p>Click below to verify your account (valid for 30 minutes):</p>
      <a href="${verificationLink}" target="_blank">Verify Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
