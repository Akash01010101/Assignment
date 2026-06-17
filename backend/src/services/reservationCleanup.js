const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Seat = require('../models/Seat');
const logger = require('../utils/logger');

const cleanupExpiredReservations = async () => {
  try {
    const now = new Date();
    // 1. Find expired but still 'active' reservations
    const expiredReservations = await Reservation.find({
      status: 'active',
      expiresAt: { $lte: now },
    });

    if (expiredReservations.length === 0) return;

    for (const res of expiredReservations) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Revert seats to available
        await Seat.updateMany(
          {
            reservationId: res._id,
            status: 'reserved',
          },
          {
            $set: { status: 'available', reservationId: null },
          },
          { session }
        );

        // Update reservation status
        res.status = 'expired';
        await res.save({ session });

        await session.commitTransaction();
        session.endSession();
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error(`Error cleaning up reservation ${res._id}: ${error.message}`);
      }
    }
    logger.info(`Cleaned up ${expiredReservations.length} expired reservations`);
  } catch (error) {
    logger.error(`Error in cleanup job: ${error.message}`);
  }
};

const startCleanupJob = () => {
  // Run every 30 seconds
  setInterval(cleanupExpiredReservations, 30000);
  logger.info('Started reservation cleanup background job (30s interval)');
};

module.exports = {
  startCleanupJob,
  cleanupExpiredReservations,
};
