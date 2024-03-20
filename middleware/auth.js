const jwt = require("jsonwebtoken");
const User = require("../moduls/Signup");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, "secretkey");
    console.log("REQUESTED USER IS : ", user);
    User.findByPk(user.userId).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).json({ success: false });
  }
};
module.exports = { authenticate };
