const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// General middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make uploaded images accessible through the browser
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory Management API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);

app.use(
  "/api/suppliers",
  authMiddleware,
  supplierRoutes
);

app.use(
  "/api/products",
  authMiddleware,
  productRoutes
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Product image must not exceed 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (
    error.message ===
    "Only JPG, PNG and WEBP image files are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

module.exports = app;