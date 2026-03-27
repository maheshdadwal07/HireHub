module.exports = (err, req, res, next) => {

  console.error(err);

  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  // 🔹 Sequelize Validation Error
  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(", ");
  }

  // 🔹 Sequelize Unique Constraint
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = "Duplicate entry detected";
  }

  // 🔹 JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });

};