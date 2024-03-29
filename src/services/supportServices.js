const { sendContactEmail } = require('../apis/mailgunApi.js');

/**
 * Sends a support email to the company support email
 * @param {*} userId
 * @param {*} subject
 * @param {*} text
 */
async function postContactEmail(name, email, subject, message) {
  try {
    await sendContactEmail(name, email, subject, message);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  postContactEmail,
};
