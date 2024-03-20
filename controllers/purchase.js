const Razorpay = require("razorpay");
const Order = require("../moduls/orders");
const userController = require("../controllers/user");

const purchasepremium = async (req, res) => {
  try {
    const KEY_ID=process.env.RAZORPAY_KEY_ID;
    const KEY_SECRET=process.env.RAZORPAY_KEY_SECRET;
    var rzp = new Razorpay({
      key_id:KEY_ID,
      key_secret:KEY_SECRET,
     
    });
    console.log(rzp. key_id);
    const amount = 2000;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ ispremiumuser: true });
       Promise.all([promise1, promise2]).then(() => {
        return res.status(202).json({sucess: true, message: "Transaction Successful", token: userController.generateAccessToken(userId, undefined, true)});
      }).catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ errpr: err, message: "Sometghing went wrong" });
  }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};
