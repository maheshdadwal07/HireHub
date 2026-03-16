const db = require("../models");

const Job = db.Job;
const Company = db.Company;


// CREATE JOB
exports.createJob = async (req, res) => {

  try {

    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        message: "Only recruiters can post jobs"
      });
    }

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
      companyId
    } = req.body;

    const job = await Job.create({
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
      postedBy: req.user.id
    });

    res.status(201).json({
      message: "Job posted successfully",
      job
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create job",
      error: error.message
    });

  }

};



// GET ALL JOBS (with filters)
exports.getJobs = async (req, res) => {

  try {

    const { location, employmentType, experienceLevel } = req.query;

    const filter = {};

    if (location) filter.location = location;
    if (employmentType) filter.employmentType = employmentType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    const jobs = await Job.findAll({
      where: filter,
       include: [
        {
          model: Company,
          attributes: ["id", "name", "location"]
        }
      ]

    });

    res.json(jobs);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching jobs"
    });

  }

};



// GET JOB BY ID
exports.getJobById = async (req, res) => {

  try {

    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.json(job);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching job"
    });

  }

};
