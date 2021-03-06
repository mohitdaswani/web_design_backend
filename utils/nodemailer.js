const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  debug: process.env.NODE_ENV === "develop",
  auth: {
    user: "dummyprojectuser@gmail.com",
    pass: "Testpassword",
  },
});

let verify = async () => {
  try {
    let status = await transport.verify();
    //true is printing don't know why should be removed?????
  } catch (err) {
    console.log("asda", err);
  }
};
verify();

let send_mail = async (email, subject, html) => {
    try {
      let status = await transport.sendMail(
        {
          from: "dummyprojectuser@gmail.com",
          to: email,
          subject: subject,
          html: html,
        },
        function (error, info) {
          console.log("error : " + JSON.stringify(error));
          console.log("info : " + JSON.stringify(info));
        }
      );

      console.log("fds", status);
    } catch (err) {
      console.log("ere", err);
    }
};
module.exports = send_mail;
