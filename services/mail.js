const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "buss2005sg@gmail.com",
    pass: "ggnq hjnw lbcc glhp",
  },
});

const sendmail = async (token_for_verify, EMAIL) => {
  try {
    const info = await transporter.sendMail({
      from: "ezSell ",
      to: EMAIL, 
      subject: "Signup", 
      text: "Hello world?", 
      html: `http://localhost:8000/log/confirm/${token_for_verify}`, // html body
    });
    return 1;
  } catch (error) {
    console.log("nodemailer error---SG-->", error);
  }
};

const mail_for_password = async (token_for_verify, EMAIL) => {
  try {
    const info = await transporter.sendMail({
      from: "ezSell ",
      to: EMAIL, 
      subject: "Signup", 
      text: "Hello world?", 
      html: `http://localhost:8000/user/updatepass/${token_for_verify}`, // html body
    });
    return 1;
  } catch (error) {
    console.log("nodemailer error---SG-->", error);
  }
};
module.exports = { sendmail,mail_for_password };
