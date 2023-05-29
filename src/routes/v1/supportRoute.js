const router = require('express').Router();
const { createSupportEmail } = require('../../controllers/supportController');

router.post('', createSupportEmail);

module.exports = router;
