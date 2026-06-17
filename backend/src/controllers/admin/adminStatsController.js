const Event = require('../../models/Event');
const Reservation = require('../../models/Reservation');
const Seat = require('../../models/Seat');

const getStats = async (req, res) => {
  const totalEvents = await Event.countDocuments();
  const totalBookings = await Reservation.countDocuments({ status: 'confirmed' });

  // Overall seat utilization
  const totalSeats = await Seat.countDocuments();
  const bookedSeats = await Seat.countDocuments({ status: 'booked' });
  const overallSeatUtilization = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;

  // Top events by bookings
  const topEvents = await Event.aggregate([
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
  ]);

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
