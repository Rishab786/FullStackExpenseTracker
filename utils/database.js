const Sequelize = require("sequelize");
const sequelize = new Sequelize("userDb", "root", "pass", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
