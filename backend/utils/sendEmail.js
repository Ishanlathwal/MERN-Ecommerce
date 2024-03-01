const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // options user-auth-controler se jaha use ho rha h
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // eg. gmail,sendGrid
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,

    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
