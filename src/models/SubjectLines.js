const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectLineSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      minLength: [1, 'User ID must be at least 1 character long'],
    },
    text: {
      type: String,
      required: [true, 'Subject line is required'],
      minLength: [1, 'Subject line must be at least 1 character long'],
    },
    style: {
      type: String,
      required: [true, 'Style is required'],
    },
    useCount: {
      type: Number,
      default: 0,
      min: [0, 'Use count must be greater than or equal to 0'],
    },
    opens: {
      type: Number,
      default: 0,
      min: [0, 'Opens must be greater than or equal to 0'],
    },
    uniqueOpens: {
      type: Number,
      default: 0,
      min: [0, 'Unique opens must be greater than or equal to 0'],
    },
    pixels: {
      type: [String],
    },
  },
  {
    virtuals: {
      openRate: {
        get() {
          if (this.useCount === 0) {
            return 0;
          }
          return (this.uniqueOpens / this.useCount) * 100;
        },
      },
    },
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      getters: true,
    },
    collection: 'subject-lines',
  }
);

/**
 * Represents the SubjectLine model in the database that is created when a user generates a subject line.
 * @typedef SubjectLine
 */
const SubjectLine = mongoose.model('SubjectLine', SubjectLineSchema);

module.exports = SubjectLine;
