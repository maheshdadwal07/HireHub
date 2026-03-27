const db = require("../models");

const Company = db.Company;

// CREATE COMPANY
exports.createCompany = async (req, res, next) => {
  try {
    const { name, description, website, location } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, description and location are required",
      });
    }

    const company = await Company.create({
      name,
      description,
      website: website || "",
      location,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: {
        id: company.id,
        name: company.name,
      },
    });

  } catch (error) {
    next(error);
  }
};


// GET ALL COMPANIES
exports.getCompanies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const companies = await Company.findAndCountAll({
      limit,
      offset,

      attributes: ["id", "name", "location", "createdAt"],

      include: [
        {
          model: db.User,
          as: "owner",
          attributes: ["id", "name"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    const formatted = companies.rows.map(c => ({
      id: c.id,
      name: c.name,
      location: c.location,
      owner: c.owner
        ? {
            id: c.owner.id,
            name: c.owner.name,
          }
        : null,
      createdAt: c.createdAt,
    }));

    res.json({
      success: true,
      total: companies.count,
      page,
      totalPages: Math.ceil(companies.count / limit),
      data: formatted,
    });

  } catch (error) {
    next(error);
  }
};


// GET COMPANY BY ID
exports.getCompanyById = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const company = await Company.findByPk(id, {
      attributes: ["id", "name", "description", "website", "location"],

      include: [
        {
          model: db.User,
          as: "owner",
          attributes: ["id", "name"],
        },
        {
          model: db.Job,
          as: "jobs",
          attributes: ["id", "title", "location", "salaryMin", "salaryMax"],
        },
      ],
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: company.id,
        name: company.name,
        description: company.description,
        website: company.website || "",
        location: company.location,
        owner: company.owner
          ? {
              id: company.owner.id,
              name: company.owner.name,
            }
          : null,
        jobs: (company.jobs || []).map(job => ({
          id: job.id,
          title: job.title,
          location: job.location,
          salary: {
            min: job.salaryMin,
            max: job.salaryMax,
          },
        })),
      },
    });

  } catch (error) {
    next(error);
  }
};