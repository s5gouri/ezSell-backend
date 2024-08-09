//dependencies
const { createHmac, randomBytes } = require("crypto");

//from files
const { SELL } = require("../models/SELL_MODEL");
const { USER } = require("../models/USER_MODEL");
const { FEEDBACK } = require("../models/FEEDBACK_MODEL");
const { MSG } = require("../models/MESSAGE");
const { mail_for_password } = require("../services/mail");
const {
  validate_token,
  create_seperate_token,
  create_token_for_user,
} = require("../services/service");

//functions

const user_profile = async (req, res) => {
  try {
    const user = req.user.email;
    const userid = req.user.id;
    const user_data = await USER.findOne({ email: user });
    if (!user_data) {
      return res.json(0);
    }
    const sell_posts = await SELL.find({ user: userid });
    if (sell_posts !== null) {
     
      res.json({ user: user_data, allpost: sell_posts });
    }
  } catch {
    res.json(0);
  }
};

const post_for_sell = async (req, res) => {
  const { TITLE, DESCRIPTION, PRICE } = req.body;
  const img = `/uploads/${req.file.filename}`;
  try {
    const new_sell = await SELL.create({
      title: TITLE,
      description: DESCRIPTION,
      price: PRICE,
      user: req.user.id,
      image: img,
    });
    res.json(1);
  } catch {
    res.json(0);
  }
};

const all_posts = async (req, res) => {
  const user = req.user.id;
  try {
    const sell_data = await SELL.find({
      user: user,
      $or: [{ status: "--under process--" }, { status: "--buyer selected--" }],
    }).populate("user");

    res.json(sell_data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

const user_history = async (req, res) => {
  try {
    const history = await SELL.find({
      user: req.user.id,
      status: "--deal done--",
    });
    res.json(history);
  } catch (error) {
    res.json(0);
  }
};

const check = async (req, res) => {
  res.json(req.user).end();
};

const logout = async (req, res) => {
  res.clearCookie("authToken").json(1);
};

const feedback = async (req, res) => {
  const { FEEDBACK_HERE } = req.body;

  try {
    await FEEDBACK.create({
      feedback: FEEDBACK_HERE,
      user_name: req.user.name,
      user_id: req.user.id,
      user_email: req.user.email,
    });
    res.json(1);
  } catch {
    res.json(0);
  }
};

//updating functions

const updating = async (req, res) => {
  const { FULLNAME, EMAIL, PHONE, PASSWORD, ADDRESS, newbgno } = req.body;
  const check_for_registered = await USER.find({ email: req.user.email });
  if (check_for_registered.length === 1) {
    const updated_data = {};
    if (FULLNAME !== "") updated_data.name = FULLNAME;
    if (PHONE !== "") updated_data.phone = PHONE;
    if (ADDRESS !== "") updated_data.adderess = ADDRESS;
    if (newbgno !== check_for_registered.background)
      updated_data.background = newbgno;
    if (req.file !== undefined)
      updated_data.profileimg = `/profile/${req.file.filename}`;
    if (updated_data !== null) {
      const user = await USER.findOneAndUpdate(
        { email: req.user.email },
        { $set: updated_data },
        { new: true }
      );
      if (user.role === "BUYER") {
        const posts = await SELL.find({
          "final_buyer.0.email": req.user.email,
        });
        posts.forEach(async (post) => {
          await SELL.updateOne(
            { _id: post._id },
            { $set: { final_buyer: [user] } }
          );
        });
        const up_posts = await SELL.find({ status: "--under process--" });
        up_posts.forEach(async (up_post) => {
          let new_list = [];
          up_post.buyers.forEach(async (buyer) => {
            if (buyer.email === req.user.email) {
              buyer = user;
            }
            new_list.push(buyer);
          });
          await SELL.updateOne(
            { _id: up_post._id },
            { $set: { buyers: new_list } }
          );
        });
      }

      const user_token = create_token_for_user(user);
      return res
        .cookie("authToken", user_token, {
          httpOnly: true,
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(2);
    }
  }
};

const changebg = async (req, res) => {
  const { bgno } = req.body;
  const user = await USER.find({ email: req.user.email });
  if (user.length !== 0) {
    if (bgno !== user.background) {
      const updatedUser = await USER.findOneAndUpdate(
        { email: req.user.email },
        { $set: { background: bgno } },
        { new: true }
      );
      const user_token = create_token_for_user(updatedUser);
      res
        .cookie("authToken", user_token, {
          httpOnly: true,
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(1);
    }
  }
};

const upd_password = async (req, res) => {
  const { PASSWORD } = req.body;
  if (PASSWORD !== "") {
    try {
      const user_old_data = await USER.findOne({ email: req.user.email });
      if (user_old_data.length !== 0) {
        const salt = user_old_data.salt;
        const provided_password = createHmac("sha256", salt)
          .update(PASSWORD)
          .digest("hex");
        const new_data = {
          EMAIL: req.user.email,
          PASSWORD: provided_password,
        };
        const user_token = create_seperate_token(new_data);
        mail_for_password(user_token, req.user.email);
        res.json(1);
      } else {
        res.json(0);
      }
    } catch (error) {
      return res.json(0);
    }
  }
};

const forgot_pass = async (req, res) => {
  const { PASSWORD, EMAIL } = req.body;
  
  try {
    const user_old_data = await USER.findOne({ email: EMAIL });
    if (user_old_data.length !== 0) {
      const salt = user_old_data.salt;
      const provided_password = createHmac("sha256", salt)
        .update(PASSWORD)
        .digest("hex");
      const new_data = {
        EMAIL: EMAIL,
        PASSWORD: provided_password,
      };
      const user_token = create_seperate_token(new_data);
      mail_for_password(user_token, EMAIL);
      res.json(1);
    } else {
      res.json(0);
    }
  } catch (error) {
    return res.json(0);
  }
};

const pass_update = async (req, res) => {
  const token = req.params.jwt;
  try {
    const user_data = validate_token(token);
    if (user_data) {
      const user = await USER.findOne({ email: user_data.EMAIL });
      if (user.length !== 0) {
        await USER.findOneAndUpdate(
          { email: user.email },
          { $set: { password: user_data.PASSWORD } }
        );
        res.render("Confirm", {
          err: "PASSWORD CHANGED SUCCESFULLY U MAY CLOSE THIS TAB NOW!",
        });
      } else {
        res.render("Confirm", {
          err: "UNABLE TO CHANGE PASSWORD TRY AGAIN IN SOME TIME",
        });
      }
    }
  } catch (error) {
    res.render("confirm", { err: error });
  }
};

const view_full_post = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await SELL.findById(post_id);
    res.json(post);
  } catch (error) {
    res.json(0);
  }
};

const add_qrcode = async (req, res) => {
  try {
    const post = await USER.findOne({ email: req.user.email });
    const user = await USER.findOneAndUpdate(
      { email: req.user.email },
      { $set: { qrcode: `/paymentqrcode/${req.file.filename}` } },
      { new: true }
    );

    const new_token = create_token_for_user(user);
    res
      .cookie("authToken", new_token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(1);
  } catch {
    res.json(0);
  }
};

const message = async (req, res) => {
  const { msg, email } = req.body;
  try {
    await MSG.create({
      message: msg,
      user_email: email,
    });
    res.json(1);
  } catch {
    res.json(0);
  }
};
module.exports = {
  post_for_sell,
  user_profile,
  all_posts,
  user_history,
  check,
  logout,
  updating,
  pass_update,
  changebg,
  feedback,
  view_full_post,
  add_qrcode,
  upd_password,
  message,
  forgot_pass,
};
