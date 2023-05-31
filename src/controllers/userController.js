'use strict';
const { getUser, patchUser, postUserSupport, postUserCheckout } = require('../services/userServices.js');

/**
 * Read the user based on the id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function readUser(req, res, next) {
  const { id } = req.params;
  await getUser(id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Update the user based on the id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateUser(req, res, next) {
  const { id } = req.params;
  await patchUser(id, req.body)
    .then(() => {
      res.status(200).send('User updated');
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Create a support email for the user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function createUserSupportEmail(req, res, next) {
  const { id } = req.params;
  const { subject, text } = req.body;
  await postUserSupport(id, subject, text)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Create a checkout session for the user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function createUserCheckout(req, res, next) {
  const { id } = req.params;
  const { plan } = req.query;
  await postUserCheckout(id, plan)
    .then((session) => {
      res.status(200).send(session);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { readUser, updateUser, createUserSupportEmail, createUserCheckout };
