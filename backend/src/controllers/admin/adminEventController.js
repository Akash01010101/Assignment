const adminEventService = require('../../services/adminEventService');
const Event = require('../../models/Event');
const Seat = require('../../models/Seat');

const getAdminEvents = async (req, res) => {
  const query = req.user.role === 'organizer' ? { organizer: req.user.id } : {};
  const events = await Event.find(query).sort({ dateTime: -1 });

  const eventsWithStats = await Promise.all(
    events.map(async (event) => {
      const seats = await Seat.find({ eventId: event._id });
      let available = 0, reserved = 0, booked = 0;
      
      seats.forEach(seat => {
        if (seat.status === 'available') available++;
        else if (seat.status === 'reserved') reserved++;
        else if (seat.status === 'booked') booked++;
      });

      return {
        id: event._id,
        name: event.name,
        venue: event.venue,
        dateTime: event.dateTime,
        totalSeats: event.totalSeats,
        imageUrl: event.imageUrl,
        availableSeats: available,
        reservedSeats: reserved,
        bookedSeats: booked,
      };
    })
  );

  res.json({ events: eventsWithStats });
};

const createEvent = async (req, res) => {
  const { name, venue, dateTime, totalSeats, seatsPerRow = 10 } = req.body;

  let imageUrl;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else {
    const defaultImages = [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1170&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1169&auto=format&fit=crop'
    ];
    imageUrl = defaultImages[Math.floor(Math.random() * defaultImages.length)];
  }

  const event = await adminEventService.createEventWithSeats(
    { name, venue, dateTime, totalSeats, imageUrl, organizer: req.user.id },
    seatsPerRow
  );

  res.status(201).json({
    event: {
      id: event._id,
      name: event.name,
      venue: event.venue,
      dateTime: event.dateTime,
      totalSeats: event.totalSeats,
      imageUrl: event.imageUrl,
    },
  });
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, venue, dateTime } = req.body;

  const event = await Event.findByIdAndUpdate(
    id,
    { $set: { ...(name && {name}), ...(venue && {venue}), ...(dateTime && {dateTime}) } },
    { new: true, runValidators: true }
  );

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json({ event });
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  await adminEventService.deleteEvent(id);
  res.status(204).send();
};

module.exports = {
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
