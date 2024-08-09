//from files
const { SELL } = require("../models/SELL_MODEL");
const { USER } = require("../models/USER_MODEL");

const find_rag = async (req, res) => {
  const rags = await SELL.find({ status: "--under process--" }).populate(
    "user"
  );
  res.json(rags);
};

const requested_rags = async (req, res) => {
  
  const rags = await SELL.find({
    status: "--buyer selected--",
    "final_buyer.0.email": req.user.email,
  }).populate("user");
  
  res.json(rags);
};
const requesting = async (req, res) => {
  const { item_id, buyer } = req.body;
  try {
    const a = await SELL.findById(item_id);
    const buyerExists = a.buyers.some((person) => person.email === buyer.email);
    if (buyerExists) {
      return res.json(2);
    } else {
      a.buyers.push(buyer);
      await a.save();
      return res.json(1);
    }
  } catch (error) {
    res.json(0);
  }
};

const set_buyer = async (req, res) => {
  const { item_id, buyer } = req.body;
  
  try {
    const item = await SELL.findById(item_id);
    if (item.final_buyer.length === 0) {
      item.final_buyer.push(buyer);
      item.buyers = ["selected"];
      item.status = "--buyer selected--";
      await item.save();
      return res.json(1);
    } else {
      return res.json(2);
    }
  } catch (error) {
    return res.json(0);
  }
};

const cancle_buyer = async (req, res) => {
  const { item_id, buyer } = req.body;
  
  try {
    const item = await SELL.findById(item_id);
    item.buyers = item.buyers.filter((person) => person.email !== buyer.email);
    await item.save();
    return res.json(1);
  } catch (error) {
    return res.json(0);
  }
};
const completed = async (req, res) => {
  const { item_id } = req.body;
  try {
    const item = await SELL.findById(item_id);
    item.status = "--deal done--";
    await item.save();
    return res.json(1);
  } catch (error) {
    return res.json(0);
  }
};

const delete_post = async (req, res) => {
  const { item_id } = req.body;
  
  try {
    const item = await SELL.findByIdAndDelete(item_id);
    return res.json(1);
  } catch (error) {
    return res.json(0);
  }
};

module.exports = {
  find_rag,
  requesting,
  set_buyer,
  requested_rags,
  cancle_buyer,
  completed,
  delete_post,
};
