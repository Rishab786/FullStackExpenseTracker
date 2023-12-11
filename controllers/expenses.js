const Expenses = require("../models/expenses");
exports.addExpenses = async (request, response, next) => {
  try {
    const user = request.user;
    const { category, price, userid, product } = request.body;
    user.createExpense({
      category: category,
      amount: price,
      userid: userid,
      product: product,
      UserEmail: userid,
    });
    response.status(200).json({ message: "Data succesfully added" });
  } catch (error) {
    console.log(error);
  }
};
exports.getAllExpenses = async (request, response, nex) => {
  try {
    const user = request.user;
    const expenses = await user.getExpenses({ include: ["User"] });

    response.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    return response
      .status(401)
      .json({ message: "Unauthorized relogin required" });
  }
};
exports.deletebyId = async (request, response, next) => {
  try {
    const ID = request.params.expenseId;
    const userId = request.user._previousDataValues.email;
    const result = await Expenses.destroy({
      where: { id: ID, userid: userId },
    });
    if (result == 0) {
      return response.status(401).json({ message: "You are not Authorized" });
    } else {
      response.status(200).json({ message: "Succeffully deleted" });
    }
  } catch (error) {
    console.log(error);
  }
};
