const express = require('express');
const router = express.Router();
const { analyzeProject } = require('../controllers/analyzeController');

/**
 * @route   POST /api/analyze
 * @desc    Analyze project requirements and get tech stack recommendations
 * @access  Public
 */
router.post('/', analyzeProject);

module.exports = router;
