/**
 * @file auditLogModel.js
 * @description DAO for the system's Audit Trail. Handles recording and retrieving user activities.
 */
const pool = require('../config/db');

const AuditLogModel = {
  /**
   * Records a new action in the audit log table.
   *
   * @param {number} userId - ID of the user performing the action.
   * @param {string} action - The action performed (e.g., 'CREATE', 'UPDATE', 'DELETE').
   * @param {string} entityType - The type of entity affected (e.g., 'professor', 'news', 'project').
   * @param {number|null} [entityId=null] - The ID of the affected entity.
   * @param {object|null} [details=null] - Additional JSON details about the action.
   * @returns {Promise<object>} The inserted audit log record.
   * @throws {Error} If required parameters are missing or the database query fails.
   */
  logAction: async (userId, action, entityType, entityId = null, details = null) => {
    if (!userId || !action || !entityType) {
      throw new Error('[FATAL] Missing required fields for audit log: userId, action, or entityType.');
    }

    try {
      const query = `
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
      const values = [userId, action, entityType, entityId, details];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('[CRITICAL] Failed to insert audit log record:', error);
      throw error; 
    }
  },

  /**
   * Retrieves the most recent activity logs, including the user's details.
   *
   * @param {number} [limit=50] - Maximum number of logs to retrieve.
   * @returns {Promise<Array<object>>} List of recent audit logs.
   * @throws {Error} If the database query fails.
   */
  getRecentLogs: async (limit = 50) => {
    try {
      const query = `
        SELECT 
            a.id, 
            a.action, 
            a.entity_type, 
            a.entity_id, 
            a.details, 
            a.created_at,
            a.user_id,
            u.full_name AS user_name, 
            u.email AS user_email
        FROM audit_logs a
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT $1;
      `;
      const { rows } = await pool.query(query, [limit]);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch recent audit logs:', error);
      throw error; 
    }
  }
};

module.exports = AuditLogModel;