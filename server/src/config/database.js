const { Sequelize } = require("sequelize");
const path = require("path");

const {
  dataDirectory,
} = require("./storage");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(
    dataDirectory,
    "inventory.sqlite"
  ),
  logging: false,
});

module.exports = sequelize;