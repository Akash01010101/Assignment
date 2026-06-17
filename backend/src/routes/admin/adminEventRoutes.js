const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');
const asyncHandler = require('../../middleware/asyncHandler');
const adminEventController = require('../../controllers/admin/adminEventController');
const adminSeatController = require('../../controllers/admin/adminSeatController');
const authMiddleware = require('../../middleware/authMiddleware');
const requireOrganizerOrAdmin = require('../../middleware/requireOrganizerOrAdmin');

router.use(authMiddleware, requireOrganizerOrAdmin);

router.get('/', asyncHandler(adminEventController.getAdminEvents));

router.get(
  '/:id/seats',
  [param('id').isMongoId().withMessage('Invalid event ID')],
  validate,
  asyncHandler(adminSeatController.getEventSeats)
);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('venue').notEmpty().withMessage('Venue is required'),
    body('dateTime').isISO8601().toDate().withMessage('Valid dateTime is required'),
    body('totalSeats').isInt({ min: 1, max: 500 }).withMessage('Total seats must be between 1 and 500'),
    body('seatsPerRow').optional().isInt({ min: 1 }),
  ],
  validate,
  asyncHandler(adminEventController.createEvent)
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid event ID'),
    body('name').optional().notEmpty(),
    body('venue').optional().notEmpty(),
    body('dateTime').optional().isISO8601().toDate(),
  ],
  validate,
  asyncHandler(adminEventController.updateEvent)
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid event ID')],
  validate,
  asyncHandler(adminEventController.deleteEvent)
);

module.exports = router;
