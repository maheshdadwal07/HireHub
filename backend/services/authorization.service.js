const db = require("../models");

/**
 * Service to handle ownership and authorization checks.
 */
class AuthorizationService {
  /**
   * Check if a user owns a company.
   * @param {number} userId 
   * @param {number} companyId 
   * @param {Object} options - Sequelize options (e.g. transaction)
   * @throws {Error} if not authorized
   */
  async verifyCompanyOwnership(userId, companyId, options = {}) {
    const company = await db.Company.findByPk(companyId, options);
    
    if (!company) {
      const error = new Error("Company not found");
      error.status = 404;
      throw error;
    }

    // Currently check createdBy. 
    // This structure can be expanded to check a 'Members' or 'Roles' table later.
    if (company.createdBy !== userId) {
      const error = new Error("You are not authorized to perform actions for this company");
      error.status = 403;
      throw error;
    }

    return company;
  }

  /**
   * Check if a user owns a job.
   * @param {number} userId 
   * @param {number} jobId 
   * @param {Object} options - Sequelize options (e.g. transaction)
   * @throws {Error} if not authorized
   */
  async verifyJobOwnership(userId, jobId, options = {}) {
    const job = await db.Job.findByPk(jobId, options);

    if (!job) {
      const error = new Error("Job not found");
      error.status = 404;
      throw error;
    }

    if (job.postedBy !== userId) {
      const error = new Error("You are not authorized to modify this job");
      error.status = 403;
      throw error;
    }

    return job;
  }
}

module.exports = new AuthorizationService();
