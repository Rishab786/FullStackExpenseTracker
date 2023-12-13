const express = require('express');
const passwordController = require('../controllers/password');
const router = express.Router();
router.get('/forgotPassword', passwordController.forgotPassword);
router.post('/forgotPassword',passwordController.requestResetPassword);
router.get('/reset/:id', passwordController.resetpasswordform);
router.post('/reset',passwordController.resetpassword);


module.exports = router;