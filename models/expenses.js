const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Expenses = sequelize.define("Expenses", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING(),
    allowNull: false,
  },
  userid: {
    type: Sequelize.STRING(),
    allowNull: false,
  },
  product: {
    type: Sequelize.STRING(),
    allowNull: false,
  },

  amount: {
    type: Sequelize.DOUBLE(),
    allowNull: false,
  },
});
module.exports = Expenses;
