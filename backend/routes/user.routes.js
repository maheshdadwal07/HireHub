const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const auth = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hirehub/users",
    resource_type: "auto", 
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx"]
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "resume") {
      if (file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        cb(null, true);
      } else {
        cb(new Error("Only .pdf, .doc and .docx formats are allowed for resume!"), false);
      }
    } else if (file.fieldname === "profilePhoto" || file.fieldname === "coverPhoto") {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed for profile/cover photos!"), false);
      }
    } else {
      cb(null, true);
    }
  }
});

router.get("/me", auth, userController.getProfile);

router.put("/profile", auth, upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
  { name: "coverPhoto", maxCount: 1 }
]), userController.updateProfile);

module.exports = router;