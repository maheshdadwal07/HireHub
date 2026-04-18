const db = require("../models");
const authService = require("../services/authorization.service");

const Application = db.Application;
const Job = db.Job;

exports.applyJob = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    const job = await Job.findByPk(jobId, { transaction: t });
    if (!job || job.status !== "OPEN") {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Job not available",
      });
    }

    const existing = await Application.findOne({
      where: {
        jobId,
        applicantId: req.user.id,
      },
      transaction: t,
    });

    if (existing) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "You already applied to this job",
      });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
      coverLetter,
      resumeUrl,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: {
        id: application.id,
        jobId: application.jobId,
        status: application.status,
      },
    });

  } catch (error) {
    await t.rollback();
    next(error);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      where: { applicantId: req.user.id },
      include: [
        {
          model: Job,
          as: "job",
          attributes: [
            "id",
            "title",
            "location",
            "salaryMin",
            "salaryMax",
          ],
          include: [
            {
              model: db.Company,
              as: "company",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = applications.map(app => ({
      id: app.id,
      status: app.status,
      appliedAt: app.createdAt,
      job: app.job
        ? {
            id: app.job.id,
            title: app.job.title,
            location: app.job.location,
            salary: {
              min: app.job.salaryMin,
              max: app.job.salaryMax,
            },
            company: app.job.company
              ? {
                  id: app.job.company.id,
                  name: app.job.company.name,
                }
              : null,
          }
        : null,
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });

  } catch (error) {
    next(error);
  }
};

exports.getApplicationByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Verify recruiter posted this job
    await authService.verifyJobOwnership(req.user.id, jobId);

    const applications = await Application.findAll({
      where: { jobId },
      include: [
        {
          model: db.User,
          as: "applicant",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = applications.map(app => ({
      id: app.id,
      status: app.status,
      applicant: app.applicant
        ? {
            id: app.applicant.id,
            name: app.applicant.name,
            email: app.applicant.email,
          }
        : null,
      appliedAt: app.createdAt,
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });

  } catch (error) {
    next(error);
  }
};

const VALID_TRANSITIONS = {
  APPLIED: ["SHORTLISTED", "REJECTED"],
  SHORTLISTED: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["HIRED", "REJECTED"],
};

exports.updateStatus = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    let { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    status = status.toUpperCase();

    const application = await Application.findByPk(id, { transaction: t });
    if (!application) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Verify recruiter posted this job
    await authService.verifyJobOwnership(req.user.id, application.jobId, { transaction: t });

    const currentStatus = application.status;

    if (
      !VALID_TRANSITIONS[currentStatus] ||
      !VALID_TRANSITIONS[currentStatus].includes(status)
    ) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Invalid transition from ${currentStatus} to ${status}`,
      });
    }

    application.status = status;
    await application.save({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Application status updated",
      data: {
        id: application.id,
        status: application.status,
      },
    });

  } catch (error) {
    await t.rollback();
    next(error);
  }
};