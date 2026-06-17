const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const validate = require('../../middleware/validate');
const asyncHandler = require('../../middleware/asyncHandler');
const adminSeatController = require('../../controllers/admin/adminSeatController');
const authMiddleware = require('../../middleware/authMiddleware');
const requireOrganizerOrAdmin = require('../../middleware/requireOrganizerOrAdmin');

router.use(authMiddleware, requireOrganizerOrAdmin);

router.patch(
  '/:seatId/release',
  [param('seatId').isMongoId().withMessage('Invalid seat ID')],
  validate,
  asyncHandler(adminSeatController.releaseSeat)
);

module.exports = router;
