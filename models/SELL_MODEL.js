const { Schema, model } = require("mongoose");

const sell_schema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "USER_M",
      require: true,
    },
    status: {
      type: String,
      default: "--under process--",
    },
    buyers: {
      type: [Schema.Types.Mixed], 
      default: [],
    },
    final_buyer: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true, collection: "sells" }
);
const SELL = model("SELL_M", sell_schema);
module.exports = { SELL };
