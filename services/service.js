require("dotenv").config();
const { USER } = require("../models/USER_MODEL");

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "sahilGlobalpass";
const create_token_for_user = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    name: user.name,
    back: user.background,
    profileimg: user.profileimg,
    qrcode: user.qrcode,
  };

  const token = jwt.sign(payload, secret);
  return token;
};
const create_seperate_token = (user) => {
  const token = jwt.sign(user, secret);
  return token;
};
const create_token_for_user_for_submition = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    fullname: user.name,
    profileimg: user.profileimg,
    address: user.address,
    back: user.background,
    password: user.password,
    qrcode: user.qrcode,
  };

  const token = jwt.sign(payload, secret);
  return token;
};
const validate_token = (token) => {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    console.log("verify error-->", error);
    return res.json(0);
  }
};

module.exports = {
  create_token_for_user,
  validate_token,
  create_token_for_user_for_submition,
  create_seperate_token,
};
