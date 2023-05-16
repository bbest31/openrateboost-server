'use strict';
const LOGGER_CONFIG = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'error',
  NODE_ENV: process.env.NODE_ENV,
};

module.exports = LOGGER_CONFIG;
