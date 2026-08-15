const express = require("express");
const cors = require("cors");
const multer = require("multer");

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");

const {
  uploadsDirectory,
} = require("./config/storage");

const app = express();

// --------------------------------------------------
// CORS configuration
// --------------------------------------------------

const clientOrigin =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
  })
);

// --------------------------------------------------
// General middleware
// --------------------------------------------------

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// --------------------------------------------------
// Uploaded product images
// --------------------------------------------------

// Locally:
// server/uploads/
//
// Railway:
// persistent volume/uploads/
app.use(
  "/uploads",
  express.static(uploadsDirectory)
);

// --------------------------------------------------
// Public health-check route
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Inventory Management API is running",
  });
});

// --------------------------------------------------
// Public authentication routes
// --------------------------------------------------

app.use("/api/auth", authRoutes);

// --------------------------------------------------
// Protected supplier routes
// --------------------------------------------------

app.use(
  "/api/suppliers",
  authMiddleware,
  supplierRoutes
);

// --------------------------------------------------
// Protected product routes
// --------------------------------------------------

app.use(
  "/api/products",
  authMiddleware,
  productRoutes
);

// --------------------------------------------------
// API 404 handler
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// --------------------------------------------------
// Global error handler
// --------------------------------------------------

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  // Multer-specific errors
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "Product image must not exceed 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Invalid image type
  if (
    error.message ===
    "Only JPG, PNG and WEBP image files are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // General server error
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

module.exports = app;