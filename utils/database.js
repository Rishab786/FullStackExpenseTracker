const Sequelize = require("sequelize");
const sequelize = new Sequelize("userDb", "root", "yourpassword", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
