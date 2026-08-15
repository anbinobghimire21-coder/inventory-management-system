const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
};

module.exports = {
  login,
};