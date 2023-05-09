'use strict';
const { httpResponseMessage } = require('../utils/responseMessages');
const { getUserMetadata, patchUserMetadata } = require('../services/userServices.js');
const { MAX_FREE_USES, MAX_BASIC_USES, MAX_PREMIUM_USES } = require('../configs/config.js');

/**
 * Ensures that the user id in the url matches the user id in the JWT, such that the user can only access their own data.
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns
 */
function checkUserId(req, res, next) {
  const userIdClaim = req.auth.payload.sub;
  const userIdUrlParam = req.params.id;

  if (userIdClaim !== userIdUrlParam) {
    return res.status(401).send(httpResponseMessage[401]);
  } else {
    next();
  }
}

const checkPlanCancellation = async (req, res, next) => {
  try {
    const metadata = await getUserMetadata(req.auth.payload.sub);
    let now = new Date();
    if (metadata.cancelsAt && metadata.cancelsAt * 1000 <= now.getTime()) {
      // if the user's plan is cancelled, then set the plan to free
      await patchUserMetadata(req.auth.payload.sub, { plan: 'free', cancelsAt: null });
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * This middleware is used to gate access to certain routes based on the user's plan.
 * The user's plan must be at least basic or higher to access the route.
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
const basicPlanGate = async (req, res, next) => {
  try {
    const metadata = await getUserMetadata(req.auth.payload.sub);
    if (metadata.plan === 'free') {
      return res.status(403).send(httpResponseMessage[403]);
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * This middleware is used to gate access to certain routes based on the user's usage_count relative to their plan max usage allowed.
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
const usageConditionalGate = async (req, res, next) => {
  try {
    const metadata = await getUserMetadata(req.auth.payload.sub);
    let failed;
    if (metadata.plan === 'free' && metadata.usage_count >= MAX_FREE_USES) {
      failed = true;
    } else if (metadata.plan === 'basic' && metadata.usage_count >= MAX_BASIC_USES) {
      failed = true;
    } else if (metadata.plan === 'premium' && metadata.usage_count >= MAX_PREMIUM_USES) {
      failed = true;
    }
    if (failed) {
      return res.status(403).send(httpResponseMessage[403]);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkUserId, basicPlanGate, usageConditionalGate, checkPlanCancellation };
