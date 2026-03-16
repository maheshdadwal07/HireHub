const Joi = require("joi");

exports.registerSchema = Joi.object({

  name: Joi.string().min(3).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  role: Joi.string()
    .valid("RECRUITER", "JOB_SEEKER")
    .required()

});