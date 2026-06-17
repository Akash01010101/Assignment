const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    seatNumbers: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A reservation must have at least one seat',
      },
    },
    status: {
      type: String,
      enum: ['active', 'confirmed', 'expired', 'cancelled'],
      default: 'active',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
reservationSchema.index({ userId: 1 });
reservationSchema.index({ eventId: 1 });
// TTL index for automatic expiration deletion. 
// Note: TTL index doesn't filter by status, so we clear expiresAt on confirm
reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Reservation', reservationSchema);
