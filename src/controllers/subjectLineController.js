'use strict';
const { getUser } = require('../services/userServices.js');
const {
  getSubjectLines,
  getSubjectLineById,
  postSubjectLines,
  incrementSubjectLineUseCount,
  patchSubjectLineTrackingPixel,
} = require('../services/subjectLineServices.js');

/**
 * Gets subject lines for the user
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
async function readSubjectLines(req, res, next) {
  const { id } = req.params;
  const { limit, skip } = req.query;

  await getSubjectLines(id, limit, skip)
    .then((subjectLines) => {
      res.status(200).send(subjectLines);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Gets a subject line by its ID
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
async function readSubjectLineById(req, res, next) {
  const { id, subjectLineId } = req.params;

  await getSubjectLineById(id, subjectLineId)
    .then((subjectLines) => {
      res.status(200).send(subjectLines);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Increments the use count for a subject line
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function updateSubjectLineUseCount(req, res, next) {
  const { id } = req.params;
  const { subjectLine } = req.body;

  await incrementSubjectLineUseCount(id, subjectLine)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Updates the tracking pixel for a subject line
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
async function updateSubjectLinePixels(req, res, next) {
  const { id } = req.params;
  const { subjectLine, pixelId } = req.body;

  await patchSubjectLineTrackingPixel(id, subjectLine, pixelId)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
}

async function createSubjectLines(req, res, next) {
  const email = req.body.email || '';
  if (email.trim().length === 0) {
    res.status(400).send({ error: true, message: 'Email body is required' });
    return;
  }

  let options = {};

  let creativity = req.query.creativity;
  if (creativity !== undefined) {
    if (isNaN(creativity)) {
      res.status(400).send({ error: true, message: 'Invalid creativity value' });
      return;
    } else if (+creativity < 0 || +creativity > 100) {
      res.status(400).send({ error: true, message: 'Invalid creativity value' });
      return;
    } else {
      options.creativity = parseInt(creativity);
    }
  }

  let lowercase = req.query.lowercase;
  if (lowercase !== undefined) {
    if (lowercase !== 'true' && lowercase !== 'false') {
      res.status(400).send({ error: true, message: 'Invalid lowercase value' });
      return;
    } else {
      options.lowercase = lowercase === 'true';
    }
  } else {
    options.lowercase = false;
  }

  const { sub } = req.auth.payload;
  const user = await getUser(sub);

  options.plan = user.user_metadata.plan;
  options.usage_count = user.user_metadata.usage_count;

  await postSubjectLines(user, email, options)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  createSubjectLines,
  readSubjectLines,
  readSubjectLineById,
  updateSubjectLineUseCount,
  updateSubjectLinePixels,
};
