const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Title is required",
      },
      len: {
        args: [3, 100],
        msg: "Title must be between 3 and 100 characters",
      },
    },
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Description is required",
      },
      len: {
        args: [10, 2000],
        msg: "Description must be at least 10 characters",
      },
    },
  },

  skillsRequired: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "",
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Location is required",
      },
    },
  },

  employmentType: {
    type: DataTypes.ENUM(
      "FULL_TIME",
      "PART_TIME",
      "INTERNSHIP",
      "CONTRACT"
    ),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Employment type is required",
      },
    },
  },

  experienceLevel: {
    type: DataTypes.ENUM(
      "FRESHER",
      "JUNIOR",
      "MID",
      "SENIOR"
    ),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Experience level is required",
      },
    },
  },

  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: "Minimum salary must be a number",
      },
      min: {
        args: [0],
        msg: "Minimum salary cannot be negative",
      },
    },
  },

  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: "Maximum salary must be a number",
      },
      min: {
        args: [0],
        msg: "Maximum salary cannot be negative",
      },
      isGreaterThanMin(value) {
        if (value < this.salaryMin) {
          throw new Error("Maximum salary must be >= minimum salary");
        }
      },
    },
  },

  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: {
        msg: "Deadline must be a valid date",
      },
    },
  },

  status: {
    type: DataTypes.ENUM("OPEN", "CLOSED"),
    defaultValue: "OPEN",
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Company ID is required",
      },
    },
  },

  postedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "PostedBy user ID is required",
      },
    },
  },

}, {
  timestamps: true,
  tableName: "jobs",
  indexes: [
    {
      fields: ["companyId"],
    },
    {
      fields: ["postedBy"],
    },
  ],
});

module.exports = Job;