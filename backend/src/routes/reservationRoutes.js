const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const reservationController = require('../controllers/reservationController');

router.get(
  '/me',
  authMiddleware,
  asyncHandler(reservationController.getMyReservations)
);

router.post(
  '/',
  authMiddleware,
  [
    body('eventId').isMongoId().withMessage('Invalid event ID'),
    body('seatNumbers').isArray({ min: 1, max: 10 }).withMessage('Must provide between 1 and 10 seat numbers'),
    body('seatNumbers.*').isString().withMessage('Seat numbers must be strings'),
  ],
  validate,
  asyncHandler(reservationController.reserveSeats)
);

module.exports = router;
