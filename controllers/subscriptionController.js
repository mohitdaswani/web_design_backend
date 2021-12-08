const SubscribeSchema = require("../models/subscriptionPlans");
const randomstring = require("randomstring");

const { RAZOR_PAY_KEY_ID, RAZOR_PAY_SECRET } = process.env;
const paymentSchema = require("../models/payment");
const Razorpay = require("razorpay");
let val = undefined;
let instance = new Razorpay({
  key_id: RAZOR_PAY_KEY_ID,
  key_secret: RAZOR_PAY_SECRET,
});

module.exports = {
  post: {
    async getSubscriptionOfNetflix(req, res) {
      try {
        const user = req.user;
        const { type, price } = req.body;
        let options = {
          amount: (price * 100).toString(), // amount in the smallest currency unit
          currency: "INR",
          receipt: randomstring.generate(7),
          payment_capture: 1,
        };
        await instance.orders
          .create(options, (err, order) => {
            if (err) throw err;
            val = order;
            console.log("order", val);
          })
          .then(() => {
            let paymentobj = {
              user_id: user._id,
              order_id: val.id,
              plan: type,
              razor_payment_id: null,
              razor_signature: null,
            };
            let yahoo = async () => {
              let order = await paymentSchema.create(paymentobj);
              order.save();

              res.json({ statusCode: 201, order });
            };
            yahoo();
          });
      } catch (err) {
        console.log(err);
        res.send("serverError");
      }
    },
    async razor_pay_success(req, res) {
      try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
          req.body;
        const paid = await paymentSchema.findOneAndUpdate(
          { order_id: razorpay_order_id },
          {
            $set: {
              razor_payment_id: razorpay_payment_id,
              razor_signature: razorpay_signature,
            },
          },
          { new: true }
        );
        if (paid) {
          const subscription = await SubscribeSchema.create({
            userId: paid.user_id,
            plan: paid.plan,
            planStartDate: Date(Date.now()).toString(),
            planExpiryDate:
              paid.plan === "Monthly"
                ? new Date(Date.now() + 2592000000).toString()
                : new Date(Date.now() + 31536000000).toString(),
          });
          await subscription.save();
          console.log(subscription);
          res.json({ statusCode: 200, message: "payment successfully made" });
        }
      } catch (err) {
        console.log(err);
        res.send("serverError");
      }
    },
  },

  get: {
    async getSubscribtionDetail(req, res) {
      const user = req.user;
      const detail = await SubscribeSchema.find({ userId: user.id });
      console.log(detail);
      res.json({ status: "passed", detail });
    },
  },
};
