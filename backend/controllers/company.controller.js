const db = require("../models");

const Company = db.Company;


exports.createCompany = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    let { name, description, website, location } = req.body;
    let logoUrl = req.body.logoUrl || "";

    if (req.file) {
      logoUrl = req.file.path;
    }

    if (website && !website.startsWith('http')) {
      website = `https://${website}`;
    }

    const company = await Company.create({
      name,
      description,
      website: website || "",
      location,
      logoUrl,
      createdBy: req.user.id,
    }, { transaction: t });

   
    await db.CompanyMember.create({
      userId: req.user.id,
      companyId: company.id,
      role: 'COMPANY_ADMIN',
      status: 'APPROVED'
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: {
        id: company.id,
        name: company.name,
      },
    });

  } catch (error) {
    await t.rollback();
    next(error);
  }
};



exports.getCompanies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;
    const { createdBy } = req.query;
    const where = createdBy ? { createdBy } : {};

    const companies = await Company.findAndCountAll({
      where,
      limit,
      offset,

      attributes: ["id", "name", "location", "logoUrl", "createdAt"],

      include: [
        {
          model: db.User,
          as: "owner",
          attributes: ["id", "name"],
        },
        {
          model: db.Job,
          as: "jobs",
          attributes: ["id"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    const formatted = companies.rows.map(c => ({
      id: c.id,
      name: c.name,
      location: c.location,
      logoUrl: c.logoUrl,
      owner: c.owner
        ? {
            id: c.owner.id,
            name: c.owner.name,
          }
        : null,
      jobsCount: c.jobs ? c.jobs.length : 0,
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
      attributes: ["id", "name", "description", "website", "location", "logoUrl", "createdAt"],

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
        logoUrl: company.logoUrl || "",
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

exports.updateCompany = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description, website, location } = req.body;
    let logoUrl = req.body.logoUrl;

    if (req.file) {
      logoUrl = req.file.path;
    }

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    if (name) company.name = name;
    if (description) company.description = description;
    if (website !== undefined) company.website = website;
    if (location) company.location = location;
    if (logoUrl !== undefined) company.logoUrl = logoUrl;

    await company.save();

    res.json({
      success: true,
      message: "Company updated successfully",
      data: company
    });
  } catch (error) {
    next(error);
  }
};