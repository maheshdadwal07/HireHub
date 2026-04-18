/**
 * Middleware to validate request body/params/query against a Joi schema.
 * @param {Object} schema - Joi schema object
 * @param {string} source - 'body', 'params', or 'query' (default: 'body')
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message.replace(/['"]/g, ""))
        .join(", ");

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessage,
      });
    }

    // Replace request data with validated/sanitized value
    req[source] = value;
    next();
  };
};

module.exports = validate;
