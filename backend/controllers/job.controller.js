const db = require("../models");
const { Op } = require("sequelize");
const authService = require("../services/authorization.service");

const Job = db.Job;
const Company = db.Company;


exports.createJob = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      title,
      description,
      skillsRequired,
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      applicationDeadline,
      companyId,
    } = req.body;

    // Verify recruiter owns the company
    await authService.verifyCompanyOwnership(req.user.id, companyId, { transaction: t });

    if (salaryMax < salaryMin) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "salaryMax must be >= salaryMin",
      });
    }

    const job = await Job.create({
      title,
      description,
      skillsRequired: skillsRequired || "",
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      applicationDeadline,
      companyId,
      postedBy: req.user.id,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      data: {
        id: job.id,
        title: job.title,
      },
    });

  } catch (error) {
    await t.rollback();
    next(error);
  }
};



exports.getJobs = async (req, res, next) => {
  try {
    const {
      location,
      employmentType,
      experienceLevel,
      search,
      postedBy,
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {};

    if (location) filter.location = location;
    if (employmentType) filter.employmentType = employmentType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    if (search) {
      filter[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const jobs = await Job.findAndCountAll({
      where: filter,
      limit,
      offset,

      attributes: [
        "id",
        "title",
        "description",
        "location",
        "employmentType",
        "experienceLevel",
        "salaryMin",
        "salaryMax",
        "skillsRequired",
        "postedBy",
        "createdAt",
      ],

      include: [
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "location"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    const formattedJobs = jobs.rows.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      salary: {
        min: job.salaryMin,
        max: job.salaryMax,
      },
      skillsRequired: job.skillsRequired || "",
      postedBy: job.postedBy,
      company: job.company
        ? {
            id: job.company.id,
            name: job.company.name,
            location: job.company.location || "",
          }
        : null,
      createdAt: job.createdAt,
    }));

    res.json({
      success: true,
      total: jobs.count,
      page,
      totalPages: Math.ceil(jobs.count / limit),
      data: formattedJobs,
    });

  } catch (error) {
    next(error);
  }
};



exports.getJobById = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findByPk(id, {
      attributes: [
        "id",
        "title",
        "description",
        "location",
        "employmentType",
        "experienceLevel",
        "salaryMin",
        "salaryMax",
        "skillsRequired",
        "postedBy",
        "createdAt",
      ],
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "location"],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        salary: {
          min: job.salaryMin,
          max: job.salaryMax,
        },
        skillsRequired: job.skillsRequired || "",
        postedBy: job.postedBy,
        company: job.company
          ? {
              id: job.company.id,
              name: job.company.name,
              location: job.company.location || "",
            }
          : null,
        createdAt: job.createdAt,
      },
    });

  } catch (error) {
    next(error);
  }
};


exports.updateJob = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;
    const updateData = req.body;

    const job = await authService.verifyJobOwnership(req.user.id, id, { transaction: t });

    await job.update(updateData, { transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Job updated successfully",
      data: {
        id: job.id,
        title: job.title,
      },
    });

  } catch (error) {
    await t.rollback();
    next(error);
  }
};


exports.deleteJob = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;

    const job = await authService.verifyJobOwnership(req.user.id, id, { transaction: t });

    await job.destroy({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    await t.rollback();
    next(error);
  }
};