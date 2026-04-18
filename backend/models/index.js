const sequelize = require("../config/database");

const User = require("./user.model");
const Company = require("./company.model");
const Job = require("./job.model");
const Application = require("./application.model");

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Company = Company;
db.Job = Job;
db.Application = Application;


User.hasMany(Job, {
  foreignKey: "postedBy",
  as: "postedJobs",
  onDelete: "CASCADE",
});
Job.belongsTo(User, {
  foreignKey: "postedBy",
  as: "recruiter",
});

Company.hasMany(Job, {
  foreignKey: "companyId",
  as: "jobs",
  onDelete: "CASCADE",
});
Job.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
});

User.hasMany(Application, {
  foreignKey: "applicantId",
  as: "applications",
  onDelete: "CASCADE",
});
Application.belongsTo(User, {
  foreignKey: "applicantId",
  as: "applicant",
});

Job.hasMany(Application, {
  foreignKey: "jobId",
  as: "applications",
  onDelete: "CASCADE",
});
Application.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
});

User.hasMany(Company, {
  foreignKey: "createdBy",
  as: "companies",
  onDelete: "CASCADE",
});
Company.belongsTo(User, {
  foreignKey: "createdBy",
  as: "owner",
});

module.exports = db;