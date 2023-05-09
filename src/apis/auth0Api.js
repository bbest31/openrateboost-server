'use strict';
// const AuthenticationClient = require('auth0').AuthenticationClient;
const ManagementClient = require('auth0').ManagementClient;
const { AUTH0_CONFIG } = require('../configs/auth0Config.js');

const managementAPI = new ManagementClient({
  domain: AUTH0_CONFIG.domain,
  audience: AUTH0_CONFIG.audience,
  clientId: AUTH0_CONFIG.clientId,
  clientSecret: AUTH0_CONFIG.clientSecret,
  tokenProvider: {
    enableCache: true,
    cacheTTLInSeconds: 10,
  },
});

module.exports = { managementAPI };
