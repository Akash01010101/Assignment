const mongoose = require('mongoose');
const Seat = require('../models/Seat');
const Reservation = require('../models/Reservation');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const logger = require('../utils/logger');

const reserveSeats = async (userId, eventId, seatNumbers) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Verify all requested seats exist and are available
      const seats = await Seat.find({
        eventId,
        seatNumber: { $in: seatNumbers },
      }).session(session);

      if (seats.length !== seatNumbers.length) {
        throw new ApiError(400, 'One or more seat numbers do not exist for this event');
      }

      const unavailableSeats = seats
        .filter((seat) => seat.status !== 'available')
        .map((seat) => seat.seatNumber);

      if (unavailableSeats.length > 0) {
        throw new ApiError(409, 'SEATS_UNAVAILABLE', unavailableSeats);
      }

      // 2. Create the Reservation document
      const expiresAt = new Date(Date.now() + env.RESERVATION_TTL_MINUTES * 60 * 1000);
      const [reservation] = await Reservation.create(
        [
          {
            userId,
            eventId,
            seatNumbers,
            status: 'active',
            expiresAt,
          },
        ],
        { session }
      );

      // 3. Update Seat documents
      const result = await Seat.updateMany(
        {
          eventId,
          seatNumber: { $in: seatNumbers },
          status: 'available', // critical guard clause
        },
        {
          $set: {
            status: 'reserved',
            reservationId: reservation._id,
          },
        },
        { session }
      );

      if (result.modifiedCount !== seatNumbers.length) {
        // This means another transaction grabbed a seat between our read and write
        throw new ApiError(409, 'SEATS_UNAVAILABLE');
      }

      await session.commitTransaction();
      session.endSession();
      return reservation;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if (error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError') && attempt < maxRetries) {
        logger.warn(`TransientTransactionError on reservation, retrying attempt ${attempt}...`);
        continue;
      }
      throw error;
    }
  }
};

module.exports = {
  reserveSeats,
};
