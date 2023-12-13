const express = require('express');
const passwordController = require('../controllers/password');
const router = express.Router();
router.get('/forgotPassword', passwordController.resetPasswordForm);
router.post('/forgotPassword',passwordController.requestResetPassword);

module.exports = router;