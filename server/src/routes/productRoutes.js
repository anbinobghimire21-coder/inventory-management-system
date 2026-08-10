const express = require("express");
const { body, param } = require("express-validator");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const validateRequest = require("../middleware/validateRequest");
const uploadProductImage = require("../middleware/uploadProductImage");

const router = express.Router();

const productValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ max: 100 })
    .withMessage("Product name must not exceed 100 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required."),

  body("price")
    .notEmpty()
    .withMessage("Product price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be 0 or greater.")
    .toFloat(),

  body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required.")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a whole number of 0 or greater.")
    .toInt(),

  body("supplierId")
    .notEmpty()
    .withMessage("Supplier is required.")
    .isInt({ min: 1 })
    .withMessage("Supplier ID must be a positive integer.")
    .toInt(),
];

const idValidationRule = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer."),
];

// READ ALL
router.get("/", getAllProducts);

// READ ONE
router.get(
  "/:id",
  idValidationRule,
  validateRequest,
  getProductById
);

// CREATE
router.post(
  "/",
  uploadProductImage.single("image"),
  productValidationRules,
  validateRequest,
  createProduct
);

// UPDATE
router.put(
  "/:id",
  uploadProductImage.single("image"),
  [...idValidationRule, ...productValidationRules],
  validateRequest,
  updateProduct
);

// DELETE
router.delete(
  "/:id",
  idValidationRule,
  validateRequest,
  deleteProduct
);

module.exports = router;