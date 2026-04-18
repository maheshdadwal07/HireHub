const Joi = require("joi");

exports.jobSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required(),

  skillsRequired: Joi.string()
    .trim()
    .allow("")
    .optional(),

  location: Joi.string()
    .trim()
    .required(),

  employmentType: Joi.string()
    .valid("FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT")
    .required(),

  experienceLevel: Joi.string()
    .valid("FRESHER", "JUNIOR", "MID", "SENIOR")
    .required(),

  salaryMin: Joi.number()
    .integer()
    .min(0)
    .required(),

  salaryMax: Joi.number()
    .integer()
    .min(Joi.ref("salaryMin"))
    .required()
    .messages({
      "number.min": "salaryMax must be greater than or equal to salaryMin",
    }),

  applicationDeadline: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.greater": "Deadline must be a future date",
    }),

  companyId: Joi.number()
    .integer()
    .positive()
    .required(),
});