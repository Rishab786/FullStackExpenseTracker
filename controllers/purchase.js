const Order = require("../models/orders");
const User = require("../models/user");
const Razorpay = require("razorpay");
const key_id = "id";
const key_secret = "";

exports.premiummembership = async (request, response, next) => {
  try {
    const rzpintance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });
    var options = {
      amount: 900,
      currency: "INR",
    };
    const orderDetails = await rzpintance.orders.create(options);
    const user = request.user;
    const { id, status } = orderDetails;
    await user.createOrder({
      orderid: id,
      status: status,
    });
    response.status(200).json({ key_id: key_id, orderid: id, user: user });
  } catch (error) {
    console.log(error);
  }
};
exports.updatetransactionstatus = async (request, response, next) => {
  const userId = request.headers.userid;
  // console.log(request.headers);
  const { order_id, payment_id } = request.body;

  try {
    await Order.update(
      { paymentid: payment_id, status: "Successful" },
      { where: { orderid: order_id } }
    );
    await User.update({ ispremiumuser: true }, { where: { email: userId } });

    response.status(202).json({ success: true });
  } catch (error) {
    response.status(500).json({ success: false });
  }
};
