const express = require("express");
const router = express.Router();

const companyController = require("../controllers/company.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, companyController.createCompany);

router.get("/", companyController.getCompanies);

router.get("/:id", companyController.getCompanyById);

module.exports = router;