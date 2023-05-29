const { postContactEmail } = require('../services/supportServices.js');

/**
 * Create a support email
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function createContactEmail(req, res, next) {
  const { name, email, subject, message } = req.body;
  await postContactEmail(name, email, subject, message)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  createContactEmail,
};
