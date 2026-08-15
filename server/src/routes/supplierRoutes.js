const express = require("express");
const { body, param } = require("express-validator");

const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const supplierValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Supplier name is required.")
    .isLength({ max: 100 })
    .withMessage("Supplier name must not exceed 100 characters."),

  body("contactEmail")
    .trim()
    .notEmpty()
    .withMessage("Contact email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .isLength({ max: 150 })
    .withMessage("Contact email must not exceed 150 characters."),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage("Please provide a valid phone number."),
];

const idValidationRule = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Supplier ID must be a positive integer."),
];

// Get all suppliers
router.get("/", getAllSuppliers);

// Get one supplier
router.get(
  "/:id",
  idValidationRule,
  validateRequest,
  getSupplierById
);

// Create supplier
router.post(
  "/",
  supplierValidationRules,
  validateRequest,
  createSupplier
);

// Update supplier
router.put(
  "/:id",
  [...idValidationRule, ...supplierValidationRules],
  validateRequest,
  updateSupplier
);

// Delete supplier
router.delete(
  "/:id",
  idValidationRule,
  validateRequest,
  deleteSupplier
);

module.exports = router;