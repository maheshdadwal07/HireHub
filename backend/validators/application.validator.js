const Joi = require("joi");

exports.applySchema = Joi.object({
  coverLetter: Joi.string().trim().max(5000).allow("", null).optional(),
  resumeUrl: Joi.string().uri().allow("", null).optional(),
});

exports.updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("SHORTLISTED", "REJECTED", "INTERVIEW", "HIRED")
    .required(),
});
