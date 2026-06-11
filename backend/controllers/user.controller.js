const db = require("../models");
const User = db.User;

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "phone", "bio", "skills", "resumeUrl", "resumeName", "profilePhotoUrl", "coverPhotoUrl", "socialLinks", "education", "experience", "updatedAt"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, skills, socialLinks, education, experience } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (skills) {
        user.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }
    if (socialLinks) {
        user.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    }
    if (education) {
        user.education = typeof education === 'string' ? JSON.parse(education) : education;
    }
    if (experience) {
        user.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
    }

    if (req.files) {
      if (req.files.resume) {
        user.resumeUrl = req.files.resume[0].path;
        user.resumeName = req.files.resume[0].originalname;
      }
      if (req.files.profilePhoto) {
        user.profilePhotoUrl = req.files.profilePhoto[0].path;
      }
      if (req.files.coverPhoto) {
        user.coverPhotoUrl = req.files.coverPhoto[0].path;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
