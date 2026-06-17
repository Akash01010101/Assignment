const express = require('express');
const router = express.Router();
const asyncHandler = require('../../middleware/asyncHandler');
const adminStatsController = require('../../controllers/admin/adminStatsController');
const authMiddleware = require('../../middleware/authMiddleware');
const requireOrganizerOrAdmin = require('../../middleware/requireOrganizerOrAdmin');

router.use(authMiddleware, requireOrganizerOrAdmin);

router.get('/', asyncHandler(adminStatsController.getStats));

module.exports = router;
