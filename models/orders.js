const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  paymentid: {
    type: Sequelize.STRING(),
  },
  orderid: {
    type: Sequelize.STRING(),
  },
  status: {
    type: Sequelize.STRING(),
    defaultValue: "pending",
  },
});
module.exports = Order;
