const express = require("express");
const expenseController = require("../controllers/expenses");
const authController = require("../middleware/authentication");
const router = express.Router();
router.post("/addExpense",authController.authorization,expenseController.addExpenses);
router.get( "/getAllExpenses",authController.authorization,expenseController.getAllExpenses);
router.delete("/delete/:expenseId",authController.authorization,expenseController.deletebyId);

module.exports = router;
