const users = require("../models/user");
const { sign } = require("jsonwebtoken");
const { get, post, put, delete1 } = require("../controllers/userController");
const { Router } = require("express");
const router = Router();
const authentication = require("../middlewares/authentication");
const { check } = require("express-validator");

router.post("/facebook", post.facebookLogin);
router.post("/google", post.googleLogin);

//-------------------------------------------------------Get Request Route
router.get("/user/verify/:token", get.verify_user_email);
//-------------------------------------------------------Post Request Route

router.post(
  "/user/register",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Must be at least 3 chars long"),
    check("email").isEmail(),
    check("password")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .withMessage("Must have symbol lowercase uppercase and number")
      .isLength({ min: 8 })
      .withMessage("Must be at least 8 chars long"),
    check("phoneNo").isLength(10).withMessage("Invalid phone number"),
  ],
  post.register_user
);
router.post("/user/login", post.login_user);
router.post("/user/forgot_password", post.forgot_password);
//-------------------------------------------------------Put Request Route
router.put(
  "/user/forgot_password/:resetToken",
  [
    check("newpassword")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .withMessage("Must have symbol lowercase uppercase and number")
      .isLength({ min: 8 })
      .withMessage("Must be at least 8 chars long"),
  ],
  put.forgot_password
);
router.put(
  "/user/changePassword",
  authentication,
  [
    check("newpassword")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .withMessage("Must have symbol lowercase uppercase and number")
      .isLength({ min: 8 })
      .withMessage("Must be at least 8 chars long"),
  ],
  put.ChangePassword
);
router.put(
  "/user/changePhoneNumber",
  authentication,
  [check("newPhoneNo").isLength(10).withMessage("Invalid phone number")],
  put.ChangePhoneNumber
);
router.put(
  "/user/changeEmail",
  authentication,
  [check("email").isEmail().withMessage("Invalid Email")],
  put.ChangeEmail
);
//-------------------------------------------------------Delete Request Route
router.delete("/user/logout", delete1.logout_user);

module.exports = router;
