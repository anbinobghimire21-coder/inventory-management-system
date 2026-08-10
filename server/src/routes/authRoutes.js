const express = require("express");
const { body } = require("express-validator");

const { login } = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const loginValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required."),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

router.post(
  "/login",
  loginValidationRules,
  validateRequest,
  login
);

module.exports = router;