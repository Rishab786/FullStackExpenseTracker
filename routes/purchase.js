const express = require('express');
const purchaseController = require('../controllers/purchase');
const authController= require('../middleware/authentication');
const router = express.Router();

//CREATE A ROUTER FOR PURCHASINNG
router.get('/premiummembership',authController.authorization,purchaseController.premiummembership);
router.put('/updatetransactionstatus',authController.authorization,purchaseController.updatetransactionstatus); 
module.exports = router;