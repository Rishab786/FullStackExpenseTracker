const express = require("express");
const cors = require("cors");
const sequelize = require("./utils/database");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");

dotenv.config();
const PORT = process.env.PORT;

const path = require("path");
const Expenses = require("./models/expenses");
const User = require("./models/user");
const Orders = require("./models/orders");
const Forgotpasswords = require("./models/forgotPassword");
const Downloads = require("./models/downloads");

const homePageRouter = require("./routes/homePage");
const errorPageRouter = require("./routes/errorPage");
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expenses");
const purchaseRouter = require("./routes/purchase");
const premiumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");

const accessLogStream = fs.createWriteStream("./access.log", { flags: "a" });
const app = express();

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

User.hasMany(Expenses);
Expenses.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasMany(Orders);
Orders.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasMany(Forgotpasswords);
Forgotpasswords.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasMany(Downloads);
Downloads.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

app.use("", homePageRouter);
app.use("/user", userRouter);
app.use("/purchase", purchaseRouter);
app.use("/premium", premiumRouter);
app.use("/expenses", expenseRouter);
app.use("/password", passwordRouter);
app.use("/*", errorPageRouter);

async function runServer() {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log("Server is running");
    });
  } catch (error) {
    console.log(error);
  }
}
runServer();
