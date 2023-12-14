const Sequelize = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();
const sequelize = new Sequelize("userDb", "root", process.env.DB_PASS, {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
