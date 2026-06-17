const mongoose = require('mongoose');
const Seat = require('../models/Seat');
const Reservation = require('../models/Reservation');
const ApiError = require('../utils/ApiError');

const confirmBooking = async (userId, reservationId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch Reservation
    const reservation = await Reservation.findById(reservationId).session(session);

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    if (reservation.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Forbidden');
    }

    if (reservation.status !== 'active') {
      throw new ApiError(409, 'Reservation is not active');
    }

    if (new Date(reservation.expiresAt) <= new Date()) {
      throw new ApiError(410, 'RESERVATION_EXPIRED');
    }

    // 2. Update Seat documents
    const result = await Seat.updateMany(
      {
        eventId: reservation.eventId,
        seatNumber: { $in: reservation.seatNumbers },
        status: 'reserved',
        reservationId: reservation._id,
      },
      {
        $set: { status: 'booked' },
      },
      { session }
    );

    if (result.modifiedCount !== reservation.seatNumbers.length) {
      throw new ApiError(409, 'Inconsistent seat state during booking');
    }

    // 3. Update Reservation
    reservation.status = 'confirmed';
    reservation.expiresAt = null; // Prevent TTL deletion
    await reservation.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      eventId: reservation.eventId,
      seatNumbers: reservation.seatNumbers,
      bookedAt: reservation.updatedAt,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  confirmBooking,
};
