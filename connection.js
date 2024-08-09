const mongoose = require("mongoose");
const connect = (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("MONGODB CONNECT!!");
    })
    .catch((err) => {
      console.log("THE ERR OCCURED IN MONGODB IS-->", err);
    });
};
module.exports = { connect };
