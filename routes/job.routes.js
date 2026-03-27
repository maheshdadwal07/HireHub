const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job.controller");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// 🔹 CREATE JOB → recruiter only
router.post(
  "/",
  auth,
  authorize("RECRUITER"),
  jobController.createJob
);

// 🔹 GET ALL JOBS → public
router.get("/", jobController.getJobs);

// 🔹 GET JOB BY ID → public
router.get("/:id", jobController.getJobById);

module.exports = router;