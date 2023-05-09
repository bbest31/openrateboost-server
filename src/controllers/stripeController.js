'use strict';
const { processStripeWebhook } = require('../services/stripeServices.js');

async function processWebhook(req, res, next) {
  await processStripeWebhook(req.headers['stripe-signature'], req.body, req.rawBody)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { processWebhook };
