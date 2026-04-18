const express = require("express");
const router = express.Router();

const companyController = require("../controllers/company.controller");
const validate = require("../middleware/validate.middleware");
const { companySchema } = require("../validators/company.validator");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.post(
  "/",
  auth,
  authorize("RECRUITER"),
  validate(companySchema),
  companyController.createCompany
);

router.get("/", companyController.getCompanies);

router.get("/:id", companyController.getCompanyById);

module.exports = router;