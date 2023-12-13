const express = require('express');
const premiumController = require('../controllers/premium');
const authController= require('../middleware/authentication');
const router = express.Router();
router.get('/leaderboard',authController.authorization,premiumController.getLeaderboard);
module.exports = router;