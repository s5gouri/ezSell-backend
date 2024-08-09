const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const {
  create_token_for_user,
  create_token_for_user_for_submition,
} = require("../services/service");
const user_schema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      require: true,
      type: String,
      unique: true,
    },
    adderess: {
      require: true,
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
      require: true,
    },
    profileimg: {
      type: String,
      default: "/images/defaultprofile.png",
    },
    background: {
      type: Number,
      default: 8,
    },
    role: {
      type: String,
      enum: ["N_USER", "ADMIN", "BUYER"],
      default: "N_USER",
    },
    qrcode: {
      type: String,
      default: "null",
    },
  },
  { collection: "users", timestamps: true }
);

user_schema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }
  const salt = randomBytes(16).toString();
  const hash_password = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hash_password;
  next();
});

user_schema.static(
  "match_password_and_generate_token",
  async function (EMAIL, PASSWORD) {
    const user = await this.findOne({ email: EMAIL });
    if (!user) {
      throw new Error("USER NOT FOUND!!");
    }
    const salt = user.salt;
    const hashed_password = user.password;
    const provided_password = createHmac("sha256", salt)
      .update(PASSWORD)
      .digest("hex");
    if (provided_password !== hashed_password) {
      throw new Error("USER NOT FOUND!!");
    }
    const token = create_token_for_user(user);
    return token;
  }
);

const USER = model("USER_M", user_schema);
module.exports = { USER };
