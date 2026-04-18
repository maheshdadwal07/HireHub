const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Application = sequelize.define("Application", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: "Job ID must be an integer",
      },
      min: {
        args: [1],
        msg: "Job ID must be positive",
      },
    },
  },

  applicantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: "Applicant ID must be an integer",
      },
      min: {
        args: [1],
        msg: "Applicant ID must be positive",
      },
    },
  },

  status: {
    type: DataTypes.ENUM(
      "APPLIED",
      "SHORTLISTED",
      "INTERVIEW",
      "REJECTED",
      "HIRED"
    ),
    allowNull: false,
    defaultValue: "APPLIED",
    validate: {
      isIn: {
        args: [[
          "APPLIED",
          "SHORTLISTED",
          "INTERVIEW",
          "REJECTED",
          "HIRED"
        ]],
        msg: "Invalid application status",
      },
    },
  },

   coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isValidUrl(value) {
        if (value && !/^https?:\/\/.+/.test(value)) {
          throw new Error("Resume must be a valid URL");
        }
      },
    },
  },

}, {
  timestamps: true,
  tableName: "applications",

  indexes: [
    {
      unique: true,
      fields: ["jobId", "applicantId"],
    },
    {
      fields: ["jobId"],
    },
    {
      fields: ["applicantId"],
    },
  ],

});

module.exports = Application;