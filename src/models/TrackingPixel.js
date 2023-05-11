const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubjectLine = require('./SubjectLines');

const TrackingPixelSchema = new Schema(
  {
    uuid: {
      type: String,
      required: [true, 'UUID is required'],
      minLength: [1, 'UUID must be at least 1 character long'],
    },
  },
  {
    timestamps: true,
    collection: 'tracking-pixels',
  }
);

// When a tracking pixel is saved, increment the opens count for the subject line that it is associated with.
TrackingPixelSchema.post('insertMany', function (docs) {
  TrackingPixel.find({ uuid: docs[0].uuid })
    .exec()
    .then((results) => {
      console.log(results.length);
      if (results.length === 1) {
        // If the tracking pixel event is the first time being logged for that uuid, then increment the unique opens count for the subject line.
        // This is because it is the first time this email has been opened.
        SubjectLine.updateOne({ pixels: { $eq: docs[0].uuid } }, { $inc: { uniqueOpens: 1 } }).exec();
      }
      SubjectLine.updateOne({ pixels: { $eq: docs[0].uuid } }, { $inc: { opens: 1 } }).exec();
    });
});

/**
 * Represents the SubjectLine model in the database that is created when a user generates a subject line.
 * @typedef TrackingPixel
 */
const TrackingPixel = mongoose.model('TrackingPixel', TrackingPixelSchema);

module.exports = TrackingPixel;
