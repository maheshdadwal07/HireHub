const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const db = require("../models");

const User = db.User;

// 🔹 GET CURRENT USER
router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Authenticated user",
      data: user,
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;