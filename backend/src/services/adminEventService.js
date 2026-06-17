const mongoose = require('mongoose');
const Event = require('../models/Event');
const Seat = require('../models/Seat');
const Reservation = require('../models/Reservation');
const ApiError = require('../utils/ApiError');

const createEventWithSeats = async (eventData, seatsPerRow = 10) => {
  const { name, venue, dateTime, totalSeats } = eventData;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [event] = await Event.create(
      [{ name, venue, dateTime, totalSeats }],
      { session }
    );

    const seatDocs = [];
    const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < totalSeats; i++) {
      const rowIndex = Math.floor(i / seatsPerRow);
      const seatNumIndex = (i % seatsPerRow) + 1;
      const rowLetter = rowIndex < rows.length ? rows[rowIndex] : `R${rowIndex}`;
      const seatNumber = `${rowLetter}${seatNumIndex}`;

      seatDocs.push({
        eventId: event._id,
        seatNumber,
        status: 'available',
      });
    }

    await Seat.insertMany(seatDocs, { session });

    await session.commitTransaction();
    session.endSession();
    return event;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteEvent = async (eventId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const activeReservations = await Reservation.countDocuments({
      eventId,
      status: { $in: ['active', 'confirmed'] },
    }).session(session);

    if (activeReservations > 0) {
      throw new ApiError(409, 'EVENT_HAS_ACTIVE_BOOKINGS', { activeCount: activeReservations });
    }

    const event = await Event.findByIdAndDelete(eventId).session(session);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    await Seat.deleteMany({ eventId }).session(session);
    await Reservation.deleteMany({ eventId, status: { $in: ['expired', 'cancelled'] } }).session(session);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const releaseSeat = async (seatId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const seat = await Seat.findById(seatId).session(session);
    if (!seat) {
      throw new ApiError(404, 'Seat not found');
    }

    if (seat.status === 'available') {
      await session.abortTransaction();
      session.endSession();
      return seat; // no-op
    }

    if (seat.status === 'booked') {
      throw new ApiError(409, 'Cannot release a booked seat');
    }

    const reservationId = seat.reservationId;
    seat.status = 'available';
    seat.reservationId = null;
    await seat.save({ session });

    if (reservationId) {
      const reservation = await Reservation.findById(reservationId).session(session);
      if (reservation) {
        reservation.seatNumbers = reservation.seatNumbers.filter(sn => sn !== seat.seatNumber);
        if (reservation.seatNumbers.length === 0) {
          reservation.status = 'cancelled';
        }
        await reservation.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();
    return seat;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  createEventWithSeats,
  deleteEvent,
  releaseSeat,
};
