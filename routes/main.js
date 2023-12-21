// const path = require('path');

const express = require("express");

const { body, check } = require("express-validator");


const AuthController = require("../controllers/Auth");

const router = express.Router();

const Users = require("../Models/Users");


// router.post("/auth/registeruser", AuthController.registerUser);



module.exports = router;
