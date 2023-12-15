const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

router.post('/signup',userController.signupAuthentication);
router.post('/login',userController.loginAuthentication); 
router.get('/dashboard',userController.getUserDashboard);
router.get('/userstatus',userController.getUserStatus);
router.get('/registeredSuccessfully',userController.getRegisteredSuccessfully);


module.exports = router;