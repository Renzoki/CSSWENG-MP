const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();


router.post('/login',authController.login);

router.post('/forgot-password',authController.forgot-password);
