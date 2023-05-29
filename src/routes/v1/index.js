'use strict';
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const trackingPixelRoute = require('./trackingPixelRoute');
const stripeRoute = require('./stripeRoute');
const supportRoute = require('./supportRoute');

router.use('/users', userRoutes);
router.use('/tracking_pixel.png', trackingPixelRoute);
router.use('/stripe_webhooks', stripeRoute);
router.use('/contact', supportRoute);

module.exports = router;
