/**
 * @file auditLogController.js
 * @description Thin controller for retrieving system audit logs.
 * Strictly read-only to guarantee audit trail integrity.
 */
const AuditLogModel = require('../models/auditLogModel');

/**
 * Retrieves recent activity logs for the admin dashboard.
 * Accepts an optional 'limit' query parameter.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response with the list of logs.
 */
const getAuditLogs = async (req, res) => {
  try {
    let limit = 50;
    
    if (req.query.limit) {
      const parsedLimit = parseInt(req.query.limit, 10);
      
      if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 500) {
        return res.status(400).json({ 
          message: 'Parámetro limit inválido. Debe ser un número entre 1 y 500.' 
        });
      }
      limit = parsedLimit;
    }

    const logs = await AuditLogModel.getRecentLogs(limit);

    return res.status(200).json(logs);

  } catch (error) {
    console.error('[ERROR] Failed to retrieve audit logs in controller:', error);
    return res.status(500).json({ 
      message: 'Error interno al obtener el registro de actividad.' 
    });
  }
};

module.exports = { getAuditLogs };