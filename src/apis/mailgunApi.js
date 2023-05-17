const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mg = mailgun.client({ username: 'api', key: API_KEY });

const sendEmail = (from, subject, text) => {
  const data = {
    from: `OpenRateBoost Support User <${from}>`,
    to: process.env.SUPPORT_EMAIL || 'thebrandonmbest@gmail.com',
    subject: `${subject} | ${from}`,
    text: text,
  };

  return mg.messages.create(DOMAIN, data);
};

module.exports = { sendEmail };
