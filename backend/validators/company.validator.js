const Joi = require("joi");

exports.companySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  website: Joi.string().uri().allow("", null).optional(),
  location: Joi.string().trim().required(),
});
