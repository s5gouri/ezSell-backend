require("dotenv").config();

const { connect } = require("./connection");
const { rt1 } = require("./routes/log_routes");
const { rt2 } = require("./routes/user_routes");
const { rt3 } = require("./routes/rag_routes");
const { USER } = require("./models/USER_MODEL");

// console.log(process.env.MONGO_URL);

connect(process.env.MONGO_URL);

const PORT = process.env.PORT || 8000;

const bodyParser = require("body-parser");
const express = require("express");
const status = require("express-status-monitor");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(status());
app.use(express.static(path.resolve("./public")));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(status());
const websites = [
  "http://192.168.5.161:3000",
  "http://localhost:3000",
  "https://your-frontend-domain.com",
];
app.use(
  cors({
    origin: websites,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});
app.use("/log", rt1);
app.use("/user", rt2);
app.use("/rag", rt3);
app.get("/hello", (req, res) => {
  console.log("cookies here-----",req.cookies);
  res.send("hello");
});
app.listen(PORT, () => {
  console.log(`SERVER STARTED!! CPU--->${process.pid}`);
});
