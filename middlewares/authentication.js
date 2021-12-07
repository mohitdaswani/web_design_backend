var users = require("../models/user");
module.exports = async (req, res, next) => {
  try {
    if (req.header("Authorization")) {
      const userToken = req.header("Authorization");
      const user = await users.find({ token: userToken });
      if (user) {
        if (user[0].verified_email == true) {
          req.user = user[0];
        } else return res.json("kindly verify your email first");
      }
    } else return res.json({ statusCode: 400, message: "kindly login first" });
    next();
  } catch (err) {
    console.log(err);
    res.json({ statusCode: 400, message: "kindly login first please" });
  }
};
