const Expenses = require("../models/expenses");
const sequelize = require("../utils/database");
const User = require("../models/user");
exports.addExpenses = async (request, response, next) => {
  const transaction = await sequelize.transaction();
  try {
    let user = request.user;
    const { category, price, userid, product } = request.body;
    user.createExpense(
      {
        category: category,
        amount: price,
        userid: userid,
        product: product,
        UserEmail: userid,
      },
      { transaction }
    );

    user = await User.findAll(
      {
        attributes: ["totalexpenses"],
        where: {
          email: userid,
        },
      },
      { transaction }
    );
    const totalExpenses = Number(user[0].totalexpenses) + Number(price);

    await User.update(
      { totalexpenses: totalExpenses },
      {
        where: {
          email: userid,
        },
        transaction,
      }
    );
    await transaction.commit();
    response.status(200).json({ message: "Data succesfully added" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
  }
};
exports.getAllExpenses = async (request, response, nex) => {
  try {
    const page = Number(request.query.page);
    const totalItems = await Expenses.count();
    const user = request.user;
    const limit = 3;
    const offset = (page - 1) * limit;
    const expenses = await user.getExpenses({
      offset: offset,
      limit: limit,
    });
    const e = expenses;
    response.status(200).json({
      expenses: expenses,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log(error);
    return response
      .status(401)
      .json({ message: "Unauthorized relogin required" });
  }
};
exports.deletebyId = async (request, response, next) => {
  const transaction = await sequelize.transaction();
  try {
    const ID = request.params.expenseId;
    const userId = request.user._previousDataValues.email;
    const currentExpense = await Expenses.findAll(
      {
        attributes: ["amount"],
        where: {
          id: ID,
        },
      },
      { transaction }
    );
    const currentExpenseAmount = currentExpense[0].amount;
    const result = await Expenses.destroy(
      {
        where: { id: ID, userid: userId },
      },
      { transaction }
    );
    if (result == 0) {
      return response.status(401).json({ message: "You are not Authorized" });
    } else {
      const totalExpenses = await User.findAll(
        {
          attributes: ["totalexpenses"],
          where: {
            email: userId,
          },
        },
        { transaction }
      );

      const updatedTotalExpense =
        totalExpenses[0].totalexpenses - currentExpenseAmount;

      await User.update(
        { totalexpenses: updatedTotalExpense },
        {
          where: {
            email: userId,
          },
        },
        { transaction }
      );
      await transaction.commit();
      response.status(200).json({ message: "Succeffully deleted" });
    }
  } catch (error) {
    await transaction.rollback();

    console.log(error);
  }
};
