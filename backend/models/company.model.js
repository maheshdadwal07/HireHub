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
        args: [50, 65000],
        msg: "Description must be at least 50 characters",
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

  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "Used to mark official companies to prevent impersonation",
  },

  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: "SEO friendly URL identifier",
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
  indexes: [
    {
      fields: ["createdBy"],
    },
    {
      fields: ["slug"],  
    },
  ],
  hooks: {
    beforeValidate: (company) => {
      if (company.name && !company.slug) {
        company.slug = company.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-') 
          .replace(/(^-|-$)+/g, ''); 
          
        
      }
    }
  }
});

module.exports = Company;