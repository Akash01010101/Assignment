const Event = require('../../models/Event');
const Reservation = require('../../models/Reservation');
const Seat = require('../../models/Seat');

const getStats = async (req, res) => {
  const isOrganizer = req.user.role === 'organizer';
  const organizerQuery = isOrganizer ? { organizer: req.user.id } : {};

  const totalEvents = await Event.countDocuments(organizerQuery);

  // For totalBookings and seat stats, we need to filter by eventIds owned by organizer
  let eventIds = null;
  if (isOrganizer) {
    const events = await Event.find({ organizer: req.user.id }).select('_id');
    eventIds = events.map(e => e._id);
  }

  const bookingQuery = { status: 'confirmed' };
  const seatQuery = {};
  if (isOrganizer) {
    bookingQuery.eventId = { $in: eventIds };
    seatQuery.eventId = { $in: eventIds };
  }

  const totalBookings = await Reservation.countDocuments(bookingQuery);

  // Overall seat utilization
  const totalSeats = await Seat.countDocuments(seatQuery);
  const bookedSeats = await Seat.countDocuments({ ...seatQuery, status: 'booked' });
  const overallSeatUtilization = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;

  // Top events by bookings
  const aggregationPipeline = [
    {
      $lookup: {
        from: 'seats',
        localField: '_id',
        foreignField: 'eventId',
        as: 'seats',
      },
    },
    {
      $project: {
        name: 1,
        organizer: 1,
        bookedSeats: {
          $size: {
            $filter: {
              input: '$seats',
              as: 'seat',
              cond: { $eq: ['$$seat.status', 'booked'] },
            },
          },
        },
      },
    },
    { $sort: { bookedSeats: -1 } },
    { $limit: 5 },
  ];

  if (isOrganizer) {
    // Add match stage to filter top events by organizer
    aggregationPipeline.unshift({ $match: { organizer: require('mongoose').Types.ObjectId.createFromHexString(req.user.id) } });
  }

  const topEvents = await Event.aggregate(aggregationPipeline);

  res.json({
    totalEvents,
    totalBookings,
    totalRevenuePotential: null, // As specified in plan, we don't have a price field
    topEventsByBookings: topEvents.map(e => ({ eventId: e._id, name: e.name, bookedSeats: e.bookedSeats })),
    overallSeatUtilization: overallSeatUtilization.toFixed(2) + '%',
  });
};

module.exports = {
  getStats,
};
