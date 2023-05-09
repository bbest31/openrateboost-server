const { openAI } = require('../apis/openAIApi.js');
const { generateSubjectLinePrompt, promptStyles } = require('../utils/prompts.js');
const SubjectLine = require('../models/SubjectLines');
const { managementAPI } = require('../apis/auth0Api.js');
const mixpanel = require('../apis/mixpanelAPI.js');
const logger = require('../utils/logger');

/**
 * Gets subject lines for the user
 * @returns {Array} subjectLines
 */
async function getSubjectLines(userId, limit, skip = 0) {
  try {
    const subjectLines = await SubjectLine.find({ userId }, null, { limit, skip }).exec();
    return subjectLines;
  } catch (error) {
    throw error;
  }
}

/**
 * Gets a subject line by its ID
 * @param {String} userId
 * @param {String} subjectLineId
 * @returns {Object} subjectLine
 */
async function getSubjectLineById(userId, subjectLineId) {
  try {
    const subjectLine = await SubjectLine.findOne({ _id: subjectLineId, userId }).exec();
    return subjectLine;
  } catch (error) {
    throw error;
  }
}

/**
 * Increments the use count for a subject line
 * @param {String} userId
 * @param {String} subjectLine
 * @returns
 */
async function incrementSubjectLineUseCount(userId, subjectLine) {
  try {
    const doc = await SubjectLine.findOne({ userId, text: subjectLine }).exec();
    doc.$inc('useCount', 1);
    await doc.save();
    mixpanel.track('Subject Line Used', {
      distinct_id: userId,
      subjectLineId: doc._id,
    });
    return true;
  } catch (err) {
    throw err;
  }
}

/**
 * Generates subject lines for the user.
 * @param {Object} user
 * @param {Object} email
 * @param {Object} options
 * @returns
 */
async function postSubjectLines(user, email, options) {
  try {
    let result = [];
    const styles = Object.values(promptStyles);
    for (const style of styles) {
      const completion = await openAI.createCompletion({
        model: 'text-davinci-003',
        prompt: generateSubjectLinePrompt(email, style),
        temperature: options?.creativity / 100 || 0.85,
        n: 1,
        max_tokens: 40,
        user: user.user_id,
      });
      // strip extraneous characters from the completion text
      let text = completion.data.choices[0].text;
      text = text.replace(/\n/g, '').replace(/"/g, '').trim();
      result.push({ style, text, userId: user.user_id, useCount: 0, opens: 0, uniqueOpens: 0 });
    }

    // persist the subject lines to the database
    const subjectLines = await SubjectLine.insertMany(result).catch((err) => {
      throw err;
    });

    subjectLines.forEach((doc) => {
      doc.save().catch((err) => {
        throw err;
      });
    });

    managementAPI.updateUserMetadata({ id: user.user_id }, { usage_count: options.usage_count + 1 }, (err, user) => {
      if (err) {
        logger.error('error incrementing user usage_count', err);
      }
    });

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Adds a tracking pixel to a subject line
 * @param {String} userId
 * @param {String} text
 * @param {String} pixelId
 * @returns
 */
async function patchSubjectLineTrackingPixel(userId, text, pixelId) {
  try {
    await SubjectLine.updateOne({ userId, text }, { $push: { pixels: pixelId } }).exec();
    return true;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getSubjectLines,
  getSubjectLineById,
  incrementSubjectLineUseCount,
  postSubjectLines,
  patchSubjectLineTrackingPixel,
};
