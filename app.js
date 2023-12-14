const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const csrf = require("csrf");
const crypto = require("crypto");

const MONGODB_URI = "mongodb+srv://FixeetAdmin:vctGu5TQVIQnyR2S@fixeetcluster0.8vuptps.mongodb.net/?retryWrites=true&w=majority";


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes Here
const mainRoutes = require("./routes/main");
const AuthRoutes = require("./routes/Auth");

app.use(mainRoutes);
app.use(AuthRoutes);


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    let port = process.env.PORT;
    if (port == null || port == "") {
      port = 5000;
    }
    app.listen(port, () => {
      console.log(`Server Started.`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
