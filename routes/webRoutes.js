const express = require('express');
const router = express.Router();
const webController = require('../controllers/webController');

router.post('/contact', webController.handleContactSubmission);

module.exports = router;
