const crypto = require("crypto");
const jwt = require('jsonwebtoken');

const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

const Users = require("../Models/Users");

exports.registerUser = (req, res, next) => {
  const formData = req.body;

  // const token = formData._csrf;
  // console.log(req.session.csrfToken);
  // if (token !== req.session.csrfToken) {
  //   return res.status(403).json({ message: "Invalid CSRF token" });
  // }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  bcrypt
    .hash(formData.userPassword, 12)
    .then((hashedPassword) => {
      const user = new Users({
        fullName: formData.userName,
        email: formData.emailAddress,
        password: hashedPassword,
        invitedby: formData.invitedby,
        DateRegistered: formData.todaydate,
      });
      return user.save();
    })
    .then((result) => {
      return res
        .status(200)
        .json({ message: "Registration was successful. Continue to Login" });
      // return transporter.sendMail({
      //   to: email,
      //   from: 'shop@node-complete.com',
      //   subject: 'Signup succeeded!',
      //   html: '<h1>You successfully signed up!</h1>'
      // });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  Users.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ message: "Invalid email or password." });
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(req.session.user);
              // res.redirect('/');
              const token = jwt.sign({ sub: user.id }, "secretkey");

              res.status(200).json({ token: token, userdata: user, role: "User", message: "Login Successful" });
            });
          }

          return res
            .status(422)
            .json({ message: "Invalid email or password." });
        })
        .catch((err) => {
          return res
            .status(422)
            .json({ message: "Unable to process request. Please try again" });
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return res
        .status(422)
        .json({ message: "An error occurred, please try again" });
    });
};
