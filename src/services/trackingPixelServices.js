const TrackingPixel = require('../models/TrackingPixel');

/**
 *
 * @param {String} uuid
 */
async function postTrackingPixel(uuid) {
  try {
    const docs = await TrackingPixel.insertMany([{ uuid }]).catch((err) => {
      throw err;
    });
    if (docs.length > 0) {
      docs[0].save().catch((err) => {
        throw err;
      });
    } else {
      throw new Error('No tracking pixel document was created!');
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  postTrackingPixel,
};
