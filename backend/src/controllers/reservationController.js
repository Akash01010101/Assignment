const reservationService = require('../services/reservationService');

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

module.exports = {
  reserveSeats,
};
