const mixpanel = require('../apis/mixpanelAPI.js');
const stripe = require('../apis/stripeApi');
const { STRIPE_WEBHOOK_SECRET, PLANS } = require('../configs/config.js');
const { getUserMetadata, patchUserMetadata } = require('./userServices.js');
const logger = require('../utils/logger');

async function getCustomer(customerId) {
  const customer = stripe.customers.retrieve(customerId);
  return customer;
}

async function processStripeWebhook(sig, event, rawBody) {
  //verify signature
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (STRIPE_WEBHOOK_SECRET) {
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      logger.log(`⚠️  Webhook signature verification failed.`, err.message);
      throw err;
    }
  }

  // handle event
  switch (event.type) {
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      const cust = await getCustomer(subscription.customer);
      let userMetaData = await getUserMetadata(cust.metadata.id);
      const oldPlan = userMetaData.plan;
      const plan = subscription.items.data[0].plan;
      const newProduct = await stripe.products.retrieve(plan.product);
      const newPlan = newProduct.name.toLowerCase();

      // check if the subscription is canceled
      if (subscription.cancel_at_period_end === true) {
        userMetaData.cancelsAt = subscription.current_period_end;
        await patchUserMetadata(cust.metadata.id, userMetaData);
        mixpanel.track('Subscription Canceled', {
          distinct_id: cust.metadata.id,
          from: oldPlan,
        });
        break;
      } else {
        // check if the subscription is renewed
        if (userMetaData.cancelsAt) {
          userMetaData.cancelsAt = null;
          userMetaData.plan = newPlan;
          await patchUserMetadata(cust.metadata.id, userMetaData);
          mixpanel.track('Subscription Renewed', {
            distinct_id: cust.metadata.id,
            plan: newPlan,
          });
          break;
        }
      }

      let upgrade = false;
      // determine if the user is upgrading or downgrading
      if (oldPlan === PLANS.FREE && (newPlan === PLANS.BASIC || newPlan === PLANS.PREMIUM)) {
        upgrade = true;
      } else if (oldPlan === PLANS.BASIC && newPlan === PLANS.PREMIUM) {
        upgrade = true;
      }
      // log the event
      if (upgrade) {
        mixpanel.track('Subscription Upgraded', {
          distinct_id: cust.metadata.id,
          from: oldPlan,
          to: newPlan,
        });
      } else {
        mixpanel.track('Subscription Downgraded', {
          distinct_id: cust.metadata.id,
          from: oldPlan,
          to: newPlan,
        });
      }

      // change the plan in the user's metadata
      if (oldPlan !== newPlan) {
        userMetaData.plan = newPlan;
        userMetaData.cancelsAt = null;
        await patchUserMetadata(cust.metadata.id, userMetaData);
      }

      break;
    case 'billing_portal.session.created':
      const portalSession = event.data.object;
      let customer = await getCustomer(portalSession.customer);
      mixpanel.track('Billing Portal Session Created', {
        distinct_id: customer.metadata.id,
      });
      break;
    default:
      // console.log(`Unhandled event type ${event.type}`);
      break;
  }

  return true;
}

module.exports = {
  processStripeWebhook,
};
