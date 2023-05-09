const { postTrackingPixel } = require('../services/trackingPixelServices.js');

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function trackingPixelOpened(req, res, next) {
  const { uuid } = req.query;

  await postTrackingPixel(uuid)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  trackingPixelOpened,
};
