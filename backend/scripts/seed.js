require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../src/models/Event');
const Seat = require('../src/models/Seat');
const Reservation = require('../src/models/Reservation');

const MONGODB_URI = process.env.MONGODB_URI;

const seedEvents = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing collections
    await Event.deleteMany({});
    await Seat.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Cleared existing Events, Seats, and Reservations');

    const eventsData = [
      {
        name: 'React Conf 2026',
        venue: 'Tech Convention Center',
        dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        totalSeats: 30,
      },
      {
        name: 'Node.js Summit',
        venue: 'Grand Hotel',
        dateTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        totalSeats: 20,
      },
      {
        name: 'Legacy Tech Meetup',
        venue: 'Local Community Hall',
        dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (past event)
        totalSeats: 15,
      },
    ];

    const createdEvents = await Event.insertMany(eventsData);
    console.log(`Created ${createdEvents.length} events`);

    for (const event of createdEvents) {
      const seatDocs = [];
      const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const seatsPerRow = 10;
      
      for (let i = 0; i < event.totalSeats; i++) {
        const rowIndex = Math.floor(i / seatsPerRow);
        const seatNumIndex = (i % seatsPerRow) + 1;
        const rowLetter = rows[rowIndex];
        const seatNumber = `${rowLetter}${seatNumIndex}`;

        seatDocs.push({
          eventId: event._id,
          seatNumber,
          status: 'available',
        });
      }

      await Seat.insertMany(seatDocs);
      console.log(`Generated ${event.totalSeats} seats for event ${event.name}`);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedEvents();
