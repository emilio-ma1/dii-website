/**
 * @file auditLogRoutes.js
 * @description API routes for the Audit Trail module. Read-only access.
 */
const express = require('express');
const router = express.Router();

const { getAuditLogs } = require('../controllers/auditLogController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * @route GET /api/audit-logs
 * @description Retrieves the system's activity history.
 * @access Private (Requires Admin privileges)
 */
router.get('/', verifyToken, verifyAdmin, getAuditLogs);

module.exports = router;