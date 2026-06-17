const express = require('express');
const router = express.Router();
const asyncHandler = require('../../middleware/asyncHandler');
const adminBookingController = require('../../controllers/admin/adminBookingController');
const authMiddleware = require('../../middleware/authMiddleware');
const requireAdmin = require('../../middleware/requireAdmin');

router.use(authMiddleware, requireAdmin);

router.get('/', asyncHandler(adminBookingController.getBookings));

module.exports = router;
