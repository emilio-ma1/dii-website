/**
 * @file categoryRoutes.js
 * @description
 * Defines API endpoints for querying project categories.
 * Provides public access to retrieve research lines for frontend filters and forms.
 */
const express = require('express');
const router = express.Router();

const { getAllCategories } = require('../controllers/categoryController');

/**
 * @route GET /api/categories
 * @description Public endpoint to list all available project categories.
 * @access Public
 */
router.get('/', getAllCategories);

module.exports = router;