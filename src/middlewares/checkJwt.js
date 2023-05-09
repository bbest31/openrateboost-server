'use strict';
const { auth } = require('express-oauth2-jwt-bearer');
const { AUTH0_CONFIG } = require('../configs/auth0Config.js');

const checkJwt = auth({
  audience: AUTH0_CONFIG.audience,
  issuerBaseURL: AUTH0_CONFIG.issuerBaseURL,
});

module.exports = checkJwt;
