const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const eventController = require('../controllers/eventController');
const { param } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', asyncHandler(eventController.getEvents));

router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid event ID'),
  ],
  validate,
  asyncHandler(eventController.getEventById)
);

module.exports = router;
