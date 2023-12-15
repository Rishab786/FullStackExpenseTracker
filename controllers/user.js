const User = require("../models/user");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.SECRET_KEY;

// SHOWING EXPENSE PAGE
exports.getUserDashboard = (request, response, next) => {

response.sendFile("addExpense.html", { root: "views" });
};
exports.getUserStatus = async (request,response,next)=>{
    
 const userId = request.headers.userid;
  try {
    const user=await User.findAll({
         attributes: ['ispremiumuser'],
        where: {
            email:userId
          }
      });
     
    if (user[0].ispremiumuser) {
      response.status(200).send("success");
    } else {
      response.status(401).send("failed");
    }
  } catch (error) {
    console.log(error);
  }

}

//REGISTERING NEW USER
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

// USER LOGIN AND STORING JWT TOKEN INSIDE CLIENT LOCAL STORAGE
exports.loginAuthentication = async (request, response, next) => {
  try {
    const { userEmail, userPassword } = request.body;
    const user = await User.findAll({
       
      where: {
        email: userEmail,
      },
    });
    if (user.length == 0) {
      response.status(404).send("not a valid user");
    } else {
      const isPasswordValid = await bcrypt.compare(
        userPassword,
        user[0].password
      );
      if (isPasswordValid) {
        const token = jwt.sign({ userId: user[0].email}, secretKey, {
          expiresIn: "1h",
        });
        response.status(200).json({ token: token, user: user[0]});
      } else {
        response.status(401).send("incorrect password");
      }
    }
  } catch (error) {
    console.log(error);
    response.status(500).send("Authentication failed");
  }
};

exports.getRegisteredSuccessfully = (request, response, next) => {

    response.sendFile("registeredSuccessfully.html", { root: "views" });
    };