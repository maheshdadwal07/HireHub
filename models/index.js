const sequelize = require("../config/database");

const User = require("./user.model");
const Company = require("./company.model");

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Company = Company;

module.exports = db;