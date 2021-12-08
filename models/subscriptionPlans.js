const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubscribeSchema = new Schema({
  userId: { type: String, required: true },
  plan: { type: String, required: true },
  planStartDate: { type: Date },
  planExpiryDate: { type: Date },
  // pricePaid:{type:Number}
});
const Subscriptions = mongoose.model("subscription", SubscribeSchema);
module.exports = Subscriptions;
