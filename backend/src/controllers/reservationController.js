const reservationService = require('../services/reservationService');
const Reservation = require('../models/Reservation');

const reserveSeats = async (req, res) => {
  const { eventId, seatNumbers } = req.body;
  const userId = req.user.id;

  const reservation = await reservationService.reserveSeats(userId, eventId, seatNumbers);

  res.status(201).json({
    reservation: {
      id: reservation._id,
      eventId: reservation.eventId,
      seatNumbers: reservation.seatNumbers,
      expiresAt: reservation.expiresAt,
      status: reservation.status,
    },
  });
};

const getMyReservations = async (req, res) => {
  const userId = req.user.id;

  const reservations = await Reservation.find({ userId, status: 'active' })
    .populate('eventId', 'name venue dateTime')
    .sort({ createdAt: -1 });

  const now = new Date();
  const formatted = reservations.map((r) => ({
    id: r._id,
    event: r.eventId,
    seatNumbers: r.seatNumbers,
    expiresAt: r.expiresAt,
    isExpired: r.expiresAt ? new Date(r.expiresAt) <= now : false,
    createdAt: r.createdAt,
  }));

  res.json({ reservations: formatted });
};

module.exports = {
  reserveSeats,
  getMyReservations,
};
