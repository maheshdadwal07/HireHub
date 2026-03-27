const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// 🔒 ADMIN ONLY ROUTE
router.put(
  "/user/:id/role",
  auth,
  authorize("ADMIN"),
  adminController.updateUserRole
);

module.exports = router;