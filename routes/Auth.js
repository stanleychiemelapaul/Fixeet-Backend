const express = require("express");

const { body, check } = require("express-validator");

const AuthController = require("../Controllers/Auth");

const router = express.Router();


const Users = require("../Models/Users");

router.post(
  "/auth/registeruser",
  [
    body("userName", "Full Name should contain Letters and whitespace only")
      .isString()
      .isLength({ min: 5 })
      .trim(),
    check("emailAddress")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Users.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "userPassword",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body("repeatPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.userPassword) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  AuthController.registerUser
);


router.post(
  '/auth/userlogin',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  AuthController.postLogin
);

module.exports = router;