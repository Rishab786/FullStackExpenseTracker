const User = require('../models/user');
exports.getLeaderboard= async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ['email', 'name', 'totalExpenses'],
      order: [['totalExpenses', 'DESC']],
    });
    console.log(leaderboard);
    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized - please relogin' });
  }
}