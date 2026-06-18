const Event = require('../models/Event');
const Seat = require('../models/Seat');
const ApiError = require('../utils/ApiError');

const getEvents = async (req, res) => {
  const events = await Event.find({ dateTime: { $gte: new Date() } }).sort({ dateTime: 1 });
  
  // Get available seat counts
  const eventsWithSeats = await Promise.all(
    events.map(async (event) => {
      const availableSeats = await Seat.countDocuments({ eventId: event._id, status: 'available' });
      return {
        id: event._id,
        name: event.name,
        venue: event.venue,
        dateTime: event.dateTime,
        totalSeats: event.totalSeats,
        imageUrl: event.imageUrl,
        availableSeats,
      };
    })
  );

  res.json({ events: eventsWithSeats });
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const seats = await Seat.find({ eventId: event._id }, { seatNumber: 1, status: 1, _id: 0 });

  res.json({
    event: {
      id: event._id,
      name: event.name,
      venue: event.venue,
      dateTime: event.dateTime,
      totalSeats: event.totalSeats,
      imageUrl: event.imageUrl,
    },
    seats,
  });
};

module.exports = {
  getEvents,
  getEventById,
};
