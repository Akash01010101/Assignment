const Reservation = require('../../models/Reservation');

const getBookings = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  let query = { status: 'confirmed' };
  
  if (req.user.role === 'organizer') {
    const Event = require('../../models/Event');
    const organizerEvents = await Event.find({ organizer: req.user.id }).select('_id');
    query.eventId = { $in: organizerEvents.map(e => e._id) };
  }

  if (req.query.eventId) {
    if (req.user.role === 'organizer') {
      // Ensure the requested eventId is one they own
      const ownsEvent = await require('../../models/Event').exists({ _id: req.query.eventId, organizer: req.user.id });
      if (!ownsEvent) {
        return res.status(403).json({ error: 'Not authorized to view bookings for this event' });
      }
    }
    query.eventId = req.query.eventId;
  }
  if (req.query.from || req.query.to) {
    query.updatedAt = {};
    if (req.query.from) query.updatedAt.$gte = new Date(req.query.from);
    if (req.query.to) query.updatedAt.$lte = new Date(req.query.to);
  }

  const bookings = await Reservation.find(query)
    .populate('userId', 'email name')
    .populate('eventId', 'name venue')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Reservation.countDocuments(query);

  const formattedBookings = bookings.map((b) => ({
    reservationId: b._id,
    user: b.userId ? { id: b.userId._id, email: b.userId.email, name: b.userId.name } : null,
    event: b.eventId ? { id: b.eventId._id, name: b.eventId.name } : null,
    seatNumbers: b.seatNumbers,
    bookedAt: b.updatedAt,
  }));

  res.json({
    bookings: formattedBookings,
    total,
    page,
    limit,
  });
};

module.exports = {
  getBookings,
};
