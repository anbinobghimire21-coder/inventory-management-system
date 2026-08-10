const User = require("./User");
const Supplier = require("./Supplier");
const Product = require("./Product");

Supplier.hasMany(Product, {
  foreignKey: "supplierId",
  as: "products",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Product.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

module.exports = {
  User,
  Supplier,
  Product,
};