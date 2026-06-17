const Seat = require('../../models/Seat');
const adminEventService = require('../../services/adminEventService');

const getEventSeats = async (req, res) => {
  const { id } = req.params; // eventId

  const seats = await Seat.find({ eventId: id }, { seatNumber: 1, status: 1, reservationId: 1, _id: 1 });
  res.json({ seats });
};

const releaseSeat = async (req, res) => {
  const { seatId } = req.params;

  const seat = await adminEventService.releaseSeat(seatId);

  res.json({ seat });
};

module.exports = {
  getEventSeats,
  releaseSeat,
};
