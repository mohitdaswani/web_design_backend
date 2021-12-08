const users = require("../models/user");
const email1 = require("../utils/nodemailer");
const { verify } = require("jsonwebtoken");
const { hash } = require("bcryptjs");
const { validationResult } = require("express-validator");
module.exports = {
  get: {
    // ----------------------email verification----------
    async verify_user_email(req, res) {
      try {
        let temp = req.params.token;
        console.log(temp);
        let user1 = await users.find_user_by_token(temp);
        console.log(user1);
        res.send("email verified");
      } catch (err) {
        console.log(err, "sdfsd");
        res.status(500).send("server error");
      }
    },
  },
  post: {
    //--------------------------------------------------------login user logic
    async login_user(req, res) {
      try {
        const { email, password } = req.body;
        if (!email || !password)
          return res.status(400).send("Incorrect Credentials1");
        const user = await users.find_by_email_and_password(email, password);
        if (user.verified_email === false) {
          return res.json({
            statusCode: 400,
            error: "Please verify your email first",
          });
        } else {
          const accesToken = await user.generateToken();
          res.status(201).json({
            statusCode: 201,
            token: accesToken,
            user,
          });
        }
      } catch (err) {
        if (err.message == "Invalid Credentials")
          return res.send({ statusCode: 400, error: "Invalid Credentials" });
        return res.send("ServerError");
      }
    },
    //--------------------------------------------------------register user logic
    async register_user(req, res) {
      {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        try {
          let user = req.body;
          const { email, password, name, phoneNo } = user;
          if (!email || !password || !name || !phoneNo)
            return res.status(400).send("ValidationError");
          const NewUser = await users.create(user);
          NewUser.resetToken = null;
          token = await NewUser.generateToken();
          let subject = `Welcome to Movies`;
          let html = `<h2>Thanks for Joining Us</h2>
                        <h3>Dear ${name} you are one step closer to become one of our prestigious family</h3>
                        <p>http://powerful-tor-09724.herokuapp.com/user/verify/${token}</p>           
                                  <p>Thank you!!!!</p>`;

          email1(email, subject, html); //////////////////////function to send email to the user
          res.status(201).json({ statusCode: 201, NewUser });
        } catch (err) {
          if (err.code === 11000) {
            if (err.keyValue.hasOwnProperty("email")) {
              return res.json({ error: { email: `Email already occupied` } });
            }
            if (err.keyValue.hasOwnProperty("phoneNo")) {
              return res.json({
                error: { phoneNo: `Phone Number already registered` },
              });
            }
          }
          if (err.name === "ValidationError")
            return res.status(400).send(`Validation Error: ${err.message}`);
          console.log(err);
          return res.status(500).send("Server Error");
        }
      }
    },
    //----------------------------------------------------------------------user forgot password logic
    async forgot_password(req, res) {
      try {
        let { email } = req.body;
        console.log(req.body);
        const user = await users.find_by_email(email);
        console.log(user);
        if (user.length != 0) {
          if (user[0].verified === false) {
            return res.json({
              statusCode: "403",
              error: "please verify your email first",
            });
          } else {
            const resetToken = await users.generate_reset_token(user);
            let subject = `Password Reset`;
            let html = `<h2>Thanks for Joining Us</h2>
                        <h3>Dear ${name} you are one step closer to become one of our prestigious family</h3>
                        <p>To verify your email Click <a href=http://powerful-tor-09724.herokuapp.com/user/verify/${token} >here</a></p>
                        <p>http://powerful-tor-09724.herokuapp.com/user/verify/${token}</p>           
                                  <p>Thank you!!!!</p>`;
            email1(user[0].email, subject, html);
            res.status(200).json({
              statusCode: 200,
              message: `We have send a reset password email to ${user[0].email}. Please click the reset password link to set a new password.`,
            });
          }
        } else
          return res.json({ statusCode: 403, error: "email ID not found" });
      } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
      }
    },
    async facebookLogin(req, res) {
      try {
        const { id, name, email, accessToken } = req.body;
        const currentuser = await users.find({ facebookid: id });
        console.log(currentuser);
        if (currentuser.length > 0) {
          let token = await currentuser[0].generateToken();
          res.status(201).json({
            statusCode: 201,
            token,
            user: currentuser[0],
          });
        } else {
          const user = await users.create({
            name,
            facebookid: id,
            email,
            password: "null",
            phoneNo: id,
            resetToken: accessToken,
            verified_email: true,
            isthirdparty: true,
          });
          let token = await user.generateToken();
          res.status(201).json({
            statusCode: 201,
            token: token,
            user,
          });
        }
      } catch (err) {
        // console.log(err);
        if (err.code === 11000) {
          if (err.keyValue.hasOwnProperty("email")) {
            return res.json({
              statusCode: 400,
              error: `Email already occupied for this account`,
            });
          }
        }
      }
    },
    async googleLogin(req, res) {
      try {
        const { profile, accessToken } = req.body;
        const currentuser = await users.find({ googleid: profile.googleId });
        if (currentuser.length > 0) {
          console.log(currentuser);
          let token = await currentuser[0].generateToken();
          res.status(201).json({
            statusCode: 201,
            token,
            user: currentuser[0],
          });
        } else {
          const user = await users.create({
            name: profile.name,
            googleid: profile.googleId,
            email: profile.email,
            password: "null",
            phoneNo: profile.googleId,
            resetToken: accessToken,
            verified_email: true,
            isthirdparty: true,
          });
          let token = await user.generateToken();
          res.status(201).json({
            statusCode: 201,
            token: token,
            user,
          });
        }
      } catch (err) {
        console.log(err);
        if (err.code === 11000) {
          if (err.keyValue.hasOwnProperty("email")) {
            return res.json({
              statusCode: 400,
              error: `Email already occupied for this account`,
            });
          }
        }
      }
    },
  },

  put: {
    async forgot_password(req, res) {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { resetToken } = req.params;
      const { newpassword, cpassword } = req.body;
      if (newpassword !== cpassword)
        return res.send({ statusCode: 400, error: "Password doesn't match" });
      try {
        const decoded = await verify(resetToken, process.env.secretkey);
        if (decoded) {
          const user = await users.find({ resetToken: resetToken });
          user[0].password = newpassword;
          user[0].save();
          res.send({
            statusCode: 201,
            message: "password successfully changed",
          });
        }
      } catch (err) {
        console.log(err.message);
        if (err.message === "jwt expired")
          return res.send({ statusCode: 400, error: "session expired" });
        res.send("serverError");
      }
    },
    async ChangePassword(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        const user = req.user;
        const { oldpassword, newpassword, cpassword } = req.body;
        const password = await users.findByPassword(user, oldpassword);

        if (password === "Invalid Credentials") {
          res.json({ status: "failed", error: "Bad request" });
        } else {
          console.log(newpassword, cpassword);
          if (newpassword === cpassword) {
            const hashedpassword = await hash(newpassword, 10);
            const resetPassword = await users.findOneAndUpdate(
              { token: user.token },
              { password: hashedpassword },
              { new: true }
            );
            res.status(200).json({
              statusCode: 201,
              user: resetPassword,
            });
          } else {
            res.json({ status: "failed", error: "Password doesn't match" });
          }
        }
      } catch (err) {
        console.log(err);
        if (err.message === "Invalid old password")
          return res.json({ status: "failed", error: err.message });

        res.status(500).send({ status: "failed", error: "Server Error" });
      }
    },
    async ChangeEmail(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        const user = req.user;
        const { password, email } = req.body;
        const checkPassword = await users.findByPasswordToChangeEmailAndPhoneNo(
          user,
          password
        );
        if (checkPassword === "Invalid Credentials")
          return res.json({ status: "failed", error: "Bad request" });
        const resetEmail = await users.findOneAndUpdate(
          { token: user.token },
          { email: email },
          { new: true }
        );
        res.status(200).json({
          statusCode: 201,
          user: resetEmail,
        });
      } catch (err) {
        console.log(err);
        if (err.message === "Invalid password")
          return res.json({ status: "failed", error: err.message });

        res.status(500).send({ status: "failed", error: "Server Error" });
      }
    },
    async ChangePhoneNumber(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        const user = req.user;
        const { password, newPhoneNo } = req.body;
        const checkPassword = await users.findByPasswordToChangeEmailAndPhoneNo(
          user,
          password
        );
        if (checkPassword === "Invalid Credentials")
          return res.json({ status: "failed", error: "Bad request" });
        const resetPhoneNo = await users.findOneAndUpdate(
          { token: user.token },
          { phoneNo: newPhoneNo },
          { new: true }
        );
        console.log(resetPhoneNo);
        res.status(200).json({
          statusCode: 201,
          user: resetPhoneNo,
        });
      } catch (err) {
        console.log(err);
        if (err.message === "Invalid password")
          return res.json({ status: "failed", error: err.message });

        res.status(500).send({ status: "failed", error: "Server Error" });
      }
    },
  },

  //-------------------------------------------------------------------------------start of delete request
  delete1: {
    //------------------------------------------------------------------------user logout logic
    async logout_user(req, res) {
      try {
        const token = req.header("Authorization");
        const user = await users.nullifyToken(token);
        res.json({ status: 201, user });
      } catch (err) {
        console.log(err);
        res.status(500).send("server error");
      }
    },
    //----------------------------------------------------------------------------end
  },
};
