const { post, get } = require("../controllers/subscriptionController");
const { Router } = require("express");
const authentication = require("../middlewares/authentication");
const router = Router();
router.post(
  "/user/subscription",
  authentication,
  post.getSubscriptionOfNetflix
);
router.get(
  "/user/subscriptionDetails",
  authentication,
  get.getSubscribtionDetail
);
router.post("/success", post.razor_pay_success);
module.exports = router;
