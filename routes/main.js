// const path = require('path');

const express = require("express");

const { body, check } = require("express-validator");


const AuthController = require("../Controllers/Auth");

const router = express.Router();

const Users = require("../models/Users");


// router.post("/auth/registeruser", AuthController.registerUser);



module.exports = router;
