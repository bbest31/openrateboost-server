const router = require('express').Router();
const { createContactEmail } = require('../../controllers/supportController');

router.post('', createContactEmail);

module.exports = router;
