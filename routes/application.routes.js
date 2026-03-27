const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/application.controller");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// 🔹 APPLY → only job seeker
router.post(
  "/apply/:jobId",
  auth,
  authorize("JOB_SEEKER"),
  applicationController.applyJob
);

// 🔹 MY APPLICATIONS → only job seeker
router.get(
  "/my",
  auth,
  authorize("JOB_SEEKER"),
  applicationController.getMyApplications
);

// 🔹 VIEW APPLICANTS → only recruiter
router.get(
  "/job/:jobId",
  auth,
  authorize("RECRUITER"),
  applicationController.getApplicationByJob
);

// 🔹 UPDATE STATUS → only recruiter
router.put(
  "/:id/status",
  auth,
  authorize("RECRUITER"),
  applicationController.updateStatus
);

module.exports = router;