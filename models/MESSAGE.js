const { Schema, model } = require("mongoose");

const msg_schema = new Schema(
  {
    message: {
      type: String,
      require: true,
    },
    user_email: {
      type: String,
      require: true,
    },
  },
  { timestamps: true, collection: "msg" }
);
const MSG = model("MESSAGE_M", msg_schema);
module.exports = { MSG };
