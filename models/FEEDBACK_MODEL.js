const { Schema, model } = require("mongoose");

const feed_schema = new Schema(
  {
    feedback: {
      type: String,
      require: true,
    },
    user_name: {
      type: String,
      require: true,
    },
    user_email: {
      type: String,
      require: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "USER_M",
      require: true,
    },
  },
  { timestamps: true, collection: "feedback" }
);
const FEEDBACK = model("FEEDBACK_M", feed_schema);
module.exports = { FEEDBACK };
