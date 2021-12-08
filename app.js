const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const fetch = require("isomorphic-fetch");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 20,
});
app.use(apiLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
    app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });

  next();
// });

const userRoute = require('./Routes/userRoute')

const adminRoute = require("./Routes/adminRoute");
const movieRoute = require("./Routes/moviesRoute")
const subscriptionRoute=require("./Routes/SubscriptionRoute")
// const movieRoute = require("./Routes/moviesRoute")
// const subscriptionRoute=require("./Routes/SubscriptionRoute")

app.use(userRoute)
app.use(adminRoute)

app.use(movieRoute)
app.use(subscriptionRoute)

// app.use(movieRoute)
// app.use(subscriptionRoute)

const handleSend = (req, res) => {
  const secret_key = process.env.SECRET_KEY_RECAPTCHA;
  const token = req.body.token;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
  fetch(url, {
    method: "post",
  })
    .then(response => response.json())
    .then(google_response => res.json({ google_response }))
    .catch(error => res.json({ error }));
};
app.get("/", (req, res) => {
  res.send("edfsa");
});
app.post("/send", handleSend);
dotenv.config();
require("./db");
module.exports = app;
