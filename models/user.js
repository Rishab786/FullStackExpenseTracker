const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const User = sequelize.define("User", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  totalexpenses:{
    type:Sequelize.FLOAT(),
    defaultValue:0.0 ,
},
ispremiumuser:{
    type: Sequelize.BOOLEAN,
    defaultValue:false,
},
  password: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

});
module.exports = User;
