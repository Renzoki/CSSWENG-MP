const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    res.render('login')
})

router.post('/login',authController.login);
router.post('/logout', authController.logout);
router.post('/forgot_password',authController.forgot_password);

module.exports = router;