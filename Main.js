const express = require("express");
var cors = require("cors");
const morgan = require('morgan');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

const sequelize = require("./utils/database");
const User = require("./moduls/Signup");
const Expense = require("./moduls/Expense");
const Order = require("./moduls/orders");
const Forgotpassword = require("./moduls/forgotpassword");
const DownloadedFile = require("./moduls/DownloadFile");


const bodyParser = require("body-parser");

const userRoutes = require("./router/user");
const expenseRoutes = require("./router/expense");
const purchaseRoutes = require("./router/purchase");
const premiumFeatureRoutes = require('./router/premiumFeature');
const resetPasswordRoutes = require('./router/resetpassword')


const app = express();

//write stream for access log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {flags: 'a'});

require("dotenv").config();

app.use(express.json());
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(morgan('combined', {stream: accessLogStream}));
app.use(compression());

app.use("/expense", expenseRoutes);
app.use("/user", userRoutes);
app.use("/purchase", purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);


sequelize.sync().then((result) => {
    console.log("Database Connected ....");
    app.listen(3000, () => {
      console.log(`Server running on port 3000 `);
    });
  })
  .catch((err) => {
    console.log(err);
  });
