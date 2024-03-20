const Sequelize = require(`sequelize`);
require("dotenv").config();
const sequelize = new Sequelize(process.env.db_name, process.env.db_Username,process.env.db_password, {
  dialect: `mysql`,
  host: process.env.db_host,
});
module.exports = sequelize;