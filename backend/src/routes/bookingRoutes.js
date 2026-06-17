const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

router.use(authMiddleware);

router.post(
  '/',
  [
    body('reservationId').isMongoId().withMessage('Invalid reservation ID'),
  ],
  validate,
  asyncHandler(bookingController.confirmBooking)
);

router.get('/me', asyncHandler(bookingController.getMyBookings));

module.exports = router;
