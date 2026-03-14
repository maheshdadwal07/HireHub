const db = require("../models");

const Company = db.Company;


// CREATE COMPANY
exports.createCompany = async (req, res) => {

  try {

    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        message: "Only recruiters can create companies"
      });
    }

    const { name, description, website, location } = req.body;

    const company = await Company.create({
      name,
      description,
      website,
      location,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Company created successfully",
      company
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create company",
      error: error.message
    });

  }

};


// GET ALL COMPANIES
exports.getCompanies = async (req, res) => {

  try {

    const companies = await Company.findAll();

    res.json(companies);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching companies"
    });

  }

};


// GET COMPANY BY ID
exports.getCompanyById = async (req, res) => {

  try {

    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    res.json(company);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching company"
    });

  }

};