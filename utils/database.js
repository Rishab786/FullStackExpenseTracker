const Sequelize = require("sequelize");
const sequelize = new Sequelize("userDb", "root", "Rishab@123", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
