const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    res.render('login')
});

router.get('/logout', authController.logout);
router.post('/login',authController.login);
router.post('/forgot_password',authController.forgot_password);
router.post('/change_password',authController.change_password);

module.exports = router;