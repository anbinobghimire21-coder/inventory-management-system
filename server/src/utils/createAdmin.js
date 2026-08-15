const bcrypt = require("bcryptjs");
const { User } = require("../models");

const createAdmin = async () => {
  try {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.log(
        "Admin credentials are not configured in environment variables."
      );
      return;
    }

    const existingUser = await User.findOne({
      where: { username },
    });

    if (existingUser) {
      console.log("Admin user already exists.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      username,
      passwordHash,
    });

    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Unable to create admin user:", error);
  }
};

module.exports = createAdmin;