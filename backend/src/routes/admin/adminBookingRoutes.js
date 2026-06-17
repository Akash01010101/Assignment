const express = require('express');
const router = express.Router();
const asyncHandler = require('../../middleware/asyncHandler');
const adminBookingController = require('../../controllers/admin/adminBookingController');
const authMiddleware = require('../../middleware/authMiddleware');
const requireOrganizerOrAdmin = require('../../middleware/requireOrganizerOrAdmin');

router.use(authMiddleware, requireOrganizerOrAdmin);

router.get('/', asyncHandler(adminBookingController.getBookings));

module.exports = router;
