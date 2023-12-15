const User = require("../models/user");
const Awsservice = require("../services/awsServices");
const AWS = require("aws-sdk");

//SHOWING LEADERBOARD DATA TO PREMIUM USERS
exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ["email", "name", "totalExpenses"],
      order: [["totalExpenses", "DESC"]],
    });

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "please relogin" });
  }
};

//GENERATING FILE LINK SO THAT USER CAN DOWNLOAD THEIR EXPENSES FILE
exports.getDownloadURL = async (request, response, next) => {
  try {
    const user = request.user;
    const expenses = await user.getExpenses({
      attributes: ["category", "amount"],
    });
    const formattedExpenses = expenses.map((expense) => {
      return `Category: ${expense.category}
  
  Amount: ${expense.amount}
  
  `;
    });
    const textData = formattedExpenses.join("\n");
    const filename = `expense-data/user${user.id}/${
      user.name
    }${new Date()}.txt`;
    const URL = await Awsservice.uploadToS3(textData, filename);
    await user.createDownload({
      downloadUrl: URL,
    });
    response.status(200).json({ URL, success: true });
  } catch (error) {
    console.log("Error while creating download link: " + error);
    response.status(500).json({ message: "Unable to generate URL" });
  }
};
