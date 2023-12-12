const Order = require("../models/orders");
const Razorpay = require("razorpay");
const key_id = "rzp_test_xVkMbYqSxtG9y5";
const key_secret = "xKSiyCyMEHyCiFmoqAfO5lx1";

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
  const { order_id, payment_id } = request.body;

  try {
    const user = request.user;
    user.ispremiumuser = true;
    await Promise.all([
      user.save(),
      Order.update(
        { paymentid: payment_id, status: "Successful" },
        { where: { orderid: order_id } }
      ),
    ]);
    response.status(202).json({ success: true });
  } catch (error) {
    response.status(500).json({ success: false });
  }
};
