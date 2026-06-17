const bookingService = require('../services/bookingService');
const Reservation = require('../models/Reservation');

const confirmBooking = async (req, res) => {
  const { reservationId } = req.body;
  const userId = req.user.id;

  const booking = await bookingService.confirmBooking(userId, reservationId);

  res.status(201).json({
    booking,
  });
};

const getMyBookings = async (req, res) => {
  const userId = req.user.id;

  const bookings = await Reservation.find({ userId, status: 'confirmed' })
    .populate('eventId', 'name venue dateTime')
    .sort({ updatedAt: -1 });

  const formattedBookings = bookings.map((b) => ({
    reservationId: b._id,
    event: b.eventId,
    seatNumbers: b.seatNumbers,
    bookedAt: b.updatedAt,
  }));

  res.json({ bookings: formattedBookings });
};

module.exports = {
  confirmBooking,
  getMyBookings,
};
