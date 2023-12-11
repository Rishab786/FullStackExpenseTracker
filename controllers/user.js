const User = require("../models/user");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const secretKey = "rishab@5$";

exports.getUserDashboard = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "addExpense.html"));
};

exports.signupAuthentication = async (request, response, next) => {
  const { userName, userEmail, userPassword } = request.body;
  try {
    const user = await User.findAll({
      where: {
        email: userEmail,
      },
    });
    if (user == "") {
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      await User.create({
        name: userName,
        email: userEmail,
        password: hashedPassword,
      });
      response.status(200).send("Successfully registered");
    } else {
      response.status(401).send(user);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.loginAuthentication = async (req, res, next) => {
  try {
    const { userEmail, userPassword } = req.body;
    const user = await User.findAll({
      where: {
        email: userEmail,
      },
    });
    if (user.length == 0) {
      res.status(404).send("not a valid user");
    } else {
      const isPasswordValid = await bcrypt.compare(
        userPassword,
        user[0].password
      );
      if (isPasswordValid) {
        const token = jwt.sign({ userId: user[0].email }, secretKey, {
          expiresIn: "1h",
        });
        res.status(200).json({ token: token, user: user[0] });
      } else {
        res.status(401).send("incorrect password");
      }
    }
  } catch (error) {
    console.log(error);
    response.status(500).send("Authentication failed");
  }
};
