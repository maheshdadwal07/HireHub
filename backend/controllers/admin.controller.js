const db = require("../models");

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "User role updated",
      data: {
        id: user.id,
        role: user.role,
      },
    });

  } catch (error) {
    next(error);
  }
};