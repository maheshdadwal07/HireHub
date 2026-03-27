const db = require("../models");

const Application = db.Application;
const Job = db.Job;

// APPLY TO JOB
exports.applyJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findByPk(jobId);
    if (!job || job.status !== "OPEN") {
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
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already applied to this job",
      });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
    });

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
    next(error);
  }
};

// GET MY APPLICATIONS
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

// GET APPLICATIONS BY JOB
exports.getApplicationByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job || job.postedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

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

// UPDATE APPLICATION STATUS
const VALID_TRANSITIONS = {
  APPLIED: ["SHORTLISTED", "REJECTED"],
  SHORTLISTED: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["HIRED", "REJECTED"],
};

exports.updateStatus = async (req, res, next) => {
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

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const job = await Job.findByPk(application.jobId);
    if (!job || job.postedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const currentStatus = application.status;

    if (
      !VALID_TRANSITIONS[currentStatus] ||
      !VALID_TRANSITIONS[currentStatus].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition from ${currentStatus} to ${status}`,
      });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: "Application status updated",
      data: {
        id: application.id,
        status: application.status,
      },
    });

  } catch (error) {
    next(error);
  }
};