'use strict';

const MAX_FREE_USES = process.env.NODE_ENV === 'production' ? 10 : 1000;
const MAX_BASIC_USES = 25;
const MAX_PREMIUM_USES = 100;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const PLANS = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  FREE: 'free',
};

module.exports = { MAX_FREE_USES, MAX_BASIC_USES, MAX_PREMIUM_USES, STRIPE_WEBHOOK_SECRET, PLANS };
