var Stripe = require('stripe');
var stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;