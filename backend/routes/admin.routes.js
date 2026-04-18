const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const validate = require("../middleware/validate.middleware");
const { updateUserRoleSchema } = require("../validators/auth.validator");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");


router.put(
  "/user/:id/role",
  auth,
  authorize("ADMIN"),
  validate(updateUserRoleSchema),
  adminController.updateUserRole
);

module.exports = router;