'use strict';
const logger = require('../utils/logger');
const { httpResponseMessage } = require('../utils/responseMessages');

const sendErrorResponse = (err, _, res, next) => {
  if (err) {
    let status = err?.status || 500;
    logger.error('error', err);
    res.status(status).send({ error: true, message: httpResponseMessage[status] });
  }
};

module.exports = sendErrorResponse;
