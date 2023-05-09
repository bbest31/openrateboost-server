const router = require('express').Router();
const { processWebhook } = require('../../controllers/stripeController');

router.post('', processWebhook);

module.exports = router;
