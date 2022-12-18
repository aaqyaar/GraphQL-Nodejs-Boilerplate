const nodemailer = require('nodemailer');

const validateENV = () => {
  if (!process.env.SMTP_SERVER) {
    throw new Error('SMTP_SERVER is not defined');
  }
  if (!process.env.SMTP_PORT) {
    throw new Error('SMTP_PORT is not defined');
  }
  if (!process.env.SMTP_USER) {
    throw new Error('SMTP_USER is not defined');
  }
  if (!process.env.SMTP_PASS) {
    throw new Error('SMTP_PASS is not defined');
  }
};

export const sendEmail = (options: any) => {
  validateENV();
  const smtpTransparent = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    service: 'gmail',
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as any);

  const mailOptions = {
    from: options.from || `"From " <${process.env.SMTP_USER}>`,
    to: options.to || `"To " <${process.env.SMTP_USER}>`,
    subject: options.subject,
    html: options.text,
  };

  return smtpTransparent.sendMail(mailOptions);
};
