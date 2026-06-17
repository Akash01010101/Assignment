const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'booked'],
      default: 'available',
      required: true,
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      default: null,
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate seat numbers per event
seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });

// Compound index for querying seats by event and status
seatSchema.index({ eventId: 1, status: 1 });

module.exports = mongoose.model('Seat', seatSchema);
