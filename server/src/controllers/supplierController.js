const { Supplier, Product } = require("../models");

// GET /api/suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    console.error("Get suppliers error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve suppliers.",
    });
  }
};

// GET /api/suppliers/:id
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price", "quantity"],
        },
      ],
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error("Get supplier error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve supplier.",
    });
  }
};

// POST /api/suppliers
const createSupplier = async (req, res) => {
  try {
    const { name, contactEmail, phone } = req.body;

    const supplier = await Supplier.create({
      name: name.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      phone: phone.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Supplier created successfully.",
      data: supplier,
    });
  } catch (error) {
    console.error("Create supplier error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create supplier.",
    });
  }
};

// PUT /api/suppliers/:id
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found.",
      });
    }

    const { name, contactEmail, phone } = req.body;

    await supplier.update({
      name: name.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      phone: phone.trim(),
    });

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully.",
      data: supplier,
    });
  } catch (error) {
    console.error("Update supplier error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update supplier.",
    });
  }
};

// DELETE /api/suppliers/:id
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found.",
      });
    }

    const productCount = await Product.count({
      where: {
        supplierId: supplier.id,
      },
    });

    if (productCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This supplier cannot be deleted because products are assigned to it.",
      });
    }

    await supplier.destroy();

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully.",
    });
  } catch (error) {
    console.error("Delete supplier error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete supplier.",
    });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};