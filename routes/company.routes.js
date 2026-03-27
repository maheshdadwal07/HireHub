const express = require("express");
const router = express.Router();

const companyController = require("../controllers/company.controller");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// 🔹 CREATE COMPANY → recruiter only
router.post(
  "/",
  auth,
  authorize("RECRUITER"),
  companyController.createCompany
);

// 🔹 GET ALL COMPANIES → public
router.get("/", companyController.getCompanies);

// 🔹 GET COMPANY BY ID → public
router.get("/:id", companyController.getCompanyById);

module.exports = router;