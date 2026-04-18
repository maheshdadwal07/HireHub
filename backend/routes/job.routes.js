const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job.controller");
const validate = require("../middleware/validate.middleware");
const { jobSchema } = require("../validators/job.validator");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.post(
  "/",
  auth,
  authorize("RECRUITER"),
  validate(jobSchema),
  jobController.createJob
);

router.get("/", jobController.getJobs);

router.get("/:id", jobController.getJobById);

router.put(
  "/:id",
  auth,
  authorize("RECRUITER"),
  jobController.updateJob
);

router.delete(
  "/:id",
  auth,
  authorize("RECRUITER"),
  jobController.deleteJob
);

module.exports = router;