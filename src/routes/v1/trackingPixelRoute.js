const router = require('express').Router();
const { trackingPixelOpened } = require('../../controllers/trackingPixelController');

router.get('', trackingPixelOpened);

module.exports = router;
