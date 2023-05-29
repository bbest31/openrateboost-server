const { sendSupportEmail } = require('../apis/mailgunApi.js');

/**
 * Sends a support email to the company support email
 * @param {*} userId
 * @param {*} subject
 * @param {*} text
 */
async function postSupport(name, email, subject, message) {
  try {
    await sendSupportEmail(name, email, subject, message);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  postSupport,
};
