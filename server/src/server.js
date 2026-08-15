require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");
const createAdmin = require("./utils/createAdmin");

require("./models");

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log(
      "Database connection established successfully."
    );

    await sequelize.sync();

    console.log(
      "Database tables synchronized successfully."
    );

    await createAdmin();

    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    console.error("Unable to start the server:", error);
    process.exit(1);
  }
};

startServer();