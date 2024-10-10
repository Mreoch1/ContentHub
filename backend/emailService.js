const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport(config.emailConfig);

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${config.frontendURL}/verify-email/${token}`;
  
  const mailOptions = {
    from: config.emailConfig.auth.user,
    to: email,
    subject: 'Verify Your Email',
    html: `Please click this link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };