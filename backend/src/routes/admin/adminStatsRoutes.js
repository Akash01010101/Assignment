const express = require('express');
const router = express.Router();
const asyncHandler = require('../../middleware/asyncHandler');
const adminStatsController = require('../../controllers/admin/adminStatsController');
const authMiddleware = require('../../middleware/authMiddleware');
const requireAdmin = require('../../middleware/requireAdmin');

router.use(authMiddleware, requireAdmin);

router.get('/', asyncHandler(adminStatsController.getStats));

module.exports = router;
