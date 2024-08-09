const multer = require("multer");
const express = require("express");
const {
  signup,
  signin,
  confirmation,
  createcookie,
  updating,
} = require("../controllers/log_functions");
const rt1 = express.Router();

//for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./public/profile`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
rt1.post("/sign-up", upload.single("PROFILEIMG"), signup);
rt1.post("/sign-in", signin);
rt1.get("/confirm/:jwt", confirmation);
rt1.post("/cookie", createcookie);


module.exports = { rt1 };
