const Joi = require("joi");

exports.registerSchema = Joi.object({

  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email format",
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
    }),

  // 🔥 OPTIONAL (and safer)
  role: Joi.string()
    .valid("RECRUITER", "JOB_SEEKER")
    .optional(),

});