const User = require('../moduls/Signup');
const Expense = require('../moduls/Expense');
const sequelize = require('../utils/database');
const e = require('express');

const getUserLeaderBoard = async (req, res) => {
try {
    const result = await User.findAll({
      attributes: ["name", "totalExpense"],
      order: [[sequelize.literal("totalExpense"), "DESC"]],
    });
   
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
  }
}
module.exports = {
    getUserLeaderBoard
}