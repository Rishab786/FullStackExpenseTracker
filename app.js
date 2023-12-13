const express = require("express");
const cors = require("cors");
const sequelize = require("./utils/database");
const path = require("path");
const Expenses = require("./models/expenses");
const User = require("./models/user");
const homePageRouter = require("./routes/homePage");
const userRouter = require("./routes/user");
const Orders = require('./models/orders');
const expenseRouter = require("./routes/expenses");
const purchaseRouter=require("./routes/purchase");
const premiumRouter = require('./routes/premium');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

User.hasMany(Expenses);
Expenses.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasMany(Orders);
Orders.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});

app.use("", homePageRouter);

app.use("/user", userRouter);
app.use('/purchase',purchaseRouter);
app.use('/premium',premiumRouter);
app.use("/expenses", expenseRouter);

//app.use("/premium",premiumRouter);

async function runServer() {
  try {
    await sequelize.sync();
    app.listen(3000, () => {
      console.log("Server is running");
    });
  } catch (error) {
    console.log(error);
  }
}
runServer();
