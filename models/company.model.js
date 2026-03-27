const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Company = sequelize.define("Company", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Company name is required",
      },
      len: {
        args: [2, 100],
        msg: "Company name must be between 2 and 100 characters",
      },
    },
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Company description is required",
      },
      len: {
        args: [10, 2000],
        msg: "Description must be at least 10 characters",
      },
    },
  },

  website: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
    validate: {
      isUrl: {
        msg: "Website must be a valid URL",
      },
    },
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Company location is required",
      },
    },
  },

  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Creator user ID is required",
      },
    },
  },

}, {
  timestamps: true,
  tableName: "companies",
});

module.exports = Company;