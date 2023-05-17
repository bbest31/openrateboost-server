'use strict';
const { managementAPI } = require('../apis/auth0Api.js');
const { sendEmail } = require('../apis/mailgunApi.js');

const UPDATABLE_USER_FIELDS = ['email', 'company', 'role'];

/**
 *
 * @param {string} userId
 * @returns {Object} user
 */
async function getUser(userId) {
  // Get user from Auth0 Management API
  const user = await managementAPI.getUser({ id: userId }).catch((err) => {
    throw err;
  });

  return user;
}

/**
 * Gets all users
 * @param {string} query
 * @returns
 */
async function getUsers(query = '') {
  // TODO: add pagination
  // Get user from Auth0 Management API
  const users = await managementAPI.getUsers({ q: query }).catch((err) => {
    throw err;
  });

  return users;
}

/**
 * Updates the user's metadata
 * @param {string} userId
 * @param {Object} newMetadata
 */
async function patchUserMetadata(userId, newMetadata) {
  await managementAPI.updateUserMetadata({ id: userId }, newMetadata);
}

/**
 * Updates the user's data
 * @param {string} userId
 * @param {Object} newUserData
 */
async function patchUser(userId, newUserData) {
  if (Object.keys(newUserData).length === 0) throw new Error('No data to update');

  Object.keys(newUserData).forEach((key) => {
    if (!UPDATABLE_USER_FIELDS.includes(key)) {
      throw new Error(`Cannot update ${key}`);
    }
  });

  const user = await getUser(userId);
  if (user.identities[0].isSocial === true && newUserData.email) {
    throw new Error('Cannot update email for social login');
  } else if (newUserData.email) {
    await managementAPI.updateUser({ id: userId }, { email: newUserData.email });
    delete newUserData.email;
  }
  if (newUserData !== {}) {
    await patchUserMetadata(userId, newUserData);
  }
}

/**
 * Gets the user's metadata
 * @param {string} userId
 * @returns
 */
async function getUserMetadata(userId) {
  try {
    const { user_metadata } = await getUser(userId);
    return user_metadata;
  } catch (error) {
    throw error;
  }
}

/**
 * Sends a support email to the company support email
 * @param {*} userId
 * @param {*} subject
 * @param {*} text
 */
async function postUserSupport(userId, subject, text) {
  try {
    const user = await getUser(userId);
    const { email } = user;
    await sendEmail(email, subject, text);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUser,
  getUsers,
  getUserMetadata,
  patchUserMetadata,
  patchUser,
  postUserSupport,
};
