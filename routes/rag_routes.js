const express = require("express");
const { check_for_user } = require("../middlewares/authentication");
const rt3 = express.Router();
const {
  find_rag,
  requesting,
  set_buyer,
  requested_rags,
  cancle_buyer,
  completed,
  delete_post
} = require("../controllers/rag_functions");
rt3.post("/find-rag", check_for_user("authToken"), find_rag);
rt3.post("/requested/rags", check_for_user("authToken"), requested_rags);
rt3.post("/send-request", check_for_user("authToken"), requesting);
rt3.post("/accept-request", check_for_user("authToken"), set_buyer);
rt3.post("/cancle-request", check_for_user("authToken"), cancle_buyer);
rt3.post("/completed", check_for_user("authToken"), completed);
rt3.post("/delete-post",check_for_user("authToken"),delete_post);
module.exports = { rt3 };
