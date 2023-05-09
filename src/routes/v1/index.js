'use strict';
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const trackingPixelRoute = require('./trackingPixelRoute');
const stripeRoute = require('./stripeRoute');

router.use('/users', userRoutes);
router.use('/tracking_pixel.png', trackingPixelRoute);
router.use('/stripe_webhooks', stripeRoute);

module.exports = router;
