const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

const { Product, Supplier } = require("../models");

const deleteImageFile = (imagePath) => {
  if (!imagePath) return;

  const fullPath = path.join(
    __dirname,
    "../..",
    imagePath
  );

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { search, supplierId } = req.query;

    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve products.",
    });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(
      req.params.id,
      {
        include: [
          {
            model: Supplier,
            as: "supplier",
            attributes: [
              "id",
              "name",
              "contactEmail",
              "phone",
            ],
          },
        ],
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve product.",
    });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      supplierId,
    } = req.body;

    const supplier = await Supplier.findByPk(
      supplierId
    );

    if (!supplier) {
      if (req.file) {
        deleteImageFile(
          `uploads/products/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Selected supplier does not exist.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      quantity,
      supplierId,
      imagePath: `uploads/products/${req.file.filename}`,
    });

    const createdProduct = await Product.findByPk(
      product.id,
      {
        include: [
          {
            model: Supplier,
            as: "supplier",
            attributes: ["id", "name"],
          },
        ],
      }
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: createdProduct,
    });
  } catch (error) {
    if (req.file) {
      deleteImageFile(
        `uploads/products/${req.file.filename}`
      );
    }

    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create product.",
    });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(
      req.params.id
    );

    if (!product) {
      if (req.file) {
        deleteImageFile(
          `uploads/products/${req.file.filename}`
        );
      }

      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const {
      name,
      description,
      price,
      quantity,
      supplierId,
    } = req.body;

    const supplier = await Supplier.findByPk(
      supplierId
    );

    if (!supplier) {
      if (req.file) {
        deleteImageFile(
          `uploads/products/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Selected supplier does not exist.",
      });
    }

    let imagePath = product.imagePath;

    if (req.file) {
      deleteImageFile(product.imagePath);

      imagePath = `uploads/products/${req.file.filename}`;
    }

    await product.update({
      name: name.trim(),
      description: description.trim(),
      price,
      quantity,
      supplierId,
      imagePath,
    });

    const updatedProduct = await Product.findByPk(
      product.id,
      {
        include: [
          {
            model: Supplier,
            as: "supplier",
            attributes: ["id", "name"],
          },
        ],
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update product.",
    });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    deleteImageFile(product.imagePath);

    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete product.",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};