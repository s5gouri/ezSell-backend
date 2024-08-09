const { USER } = require("../models/USER_MODEL");

const { sendmail } = require("../services/mail");
const {
  validate_token,
  create_token_for_user_for_submition,
} = require("../services/service");

const signup = async (req, res) => {
  const { FULLNAME, EMAIL, PHONE, PASSWORD, ROLE, ADDRESS } = req.body;
  const check_for_registered = await USER.find({ email: EMAIL });
  if (check_for_registered.length !== 0) {
    res.json(2);
  } else {
    try {
      let user = {};
      if (req.file === undefined) {
        user = {
          name: FULLNAME,
          email: EMAIL,
          phone: PHONE,
          password: PASSWORD,
          role: ROLE,
          address: ADDRESS,
          profile: "/images/defaultprofile.png",
        };
      } else {
        user = {
          name: FULLNAME,
          email: EMAIL,
          phone: PHONE,
          password: PASSWORD,
          role: ROLE,
          address: ADDRESS,
          profile: `/profile/${req.file.filename}`,
        };
      }
      const token_for_verify = create_token_for_user_for_submition(user);
      sendmail(token_for_verify, EMAIL);
      res.json(1);
    } catch (error) {
      console.log(error);
      return res.json(0);
    }
  }
};

const confirmation = async (req, res) => {
  const id = req.params.jwt;
  try {
    const user_data = validate_token(id);
    if (user_data) {
      const checking_for_double = await USER.find({ email: user_data.email });
      if (checking_for_double.length !== 0) {
        res.render("Confirm", {
          err: "You are Alredy a registered User please Go to this link",
        });
      } else {
        await USER.create({
          name: user_data.fullname,
          phone: user_data.phone,
          email: user_data.email,
          password: user_data.password,
          adderess: user_data.address,
          role: user_data.role,
          profileimg: user_data.profileimg,
        });
        res.render("Confirm");
      }
    } else {
      res.render("Confirm", {
        err: "UNABLE TO VERIFY TRY AGAIN IN SOME TIME",
      });
    }
  } catch (error) {
    console.log(error);
    res.render("confirm", { err: error });
  }
};

const signin = async (req, res) => {
  const { EMAIL, PASSWORD } = req.body;

  try {
    const user_token = await USER.match_password_and_generate_token(
      EMAIL,
      PASSWORD
    );
    console.log("----->", user_token);
    if (user_token.length !== 0) {
      res
        .cookie("authToken", user_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(1);
    } else {
      console.log("galat h ");
      res.json(10);
    }
  } catch (error) {
    return res.json(0);
  }
};

const createcookie = async (req, res) => {
  const { EMAIL, PASSWORD } = req.body;
  try {
    const user_token = await USER.match_password_and_generate_token(
      EMAIL,
      PASSWORD
    );

    res
      .cookie("authToken", user_token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(1);
  } catch (error) {
    console.log("----->22", error);

    return res.json(0);
  }
};

module.exports = { signup, signin, confirmation, createcookie };
