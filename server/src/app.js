const express = require("express");
const cors = require("cors");

const supplierRoutes = require("./routes/supplierRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory Management API is running",
  });
});

// API routes
app.use("/api/suppliers", supplierRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

module.exports = app;