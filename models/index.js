const sequelize = require("../config/database");

const User = require("./user.model");
const Company = require("./company.model");
const Job = require("./job.model");

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Company = Company;
db.Job = Job;

/* Relationships */

User.hasMany(Job, { foreignKey: "postedBy" });
Job.belongsTo(User, { foreignKey: "postedBy" });

Company.hasMany(Job, { foreignKey: "companyId" });
Job.belongsTo(Company, { foreignKey: "companyId" });

module.exports = db;