const bcrypt = require("bcryptjs");

const { User } = require("../models");

const createAdmin = async () => {
  try {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.warn(
        "ADMIN_USERNAME or ADMIN_PASSWORD is missing."
      );

      return;
    }

    const existingAdmin = await User.findOne({
      where: { username },
    });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(
        password,
        10
      );

      await User.create({
        username,
        passwordHash,
      });

      console.log(
        "Admin user created successfully."
      );

      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      existingAdmin.passwordHash
    );

    if (!passwordMatches) {
      const newPasswordHash = await bcrypt.hash(
        password,
        10
      );

      await existingAdmin.update({
        passwordHash: newPasswordHash,
      });

      console.log(
        "Admin password synchronized successfully."
      );
    } else {
      console.log(
        "Admin user already exists."
      );
    }
  } catch (error) {
    console.error(
      "Unable to create/update admin user:",
      error
    );

    throw error;
  }
};

module.exports = createAdmin;