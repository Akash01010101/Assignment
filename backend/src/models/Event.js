const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
      validate : {
        validator : Number.isInteger,
        message   : '{VALUE} is not an integer value'
      }
    },
  },
  { timestamps: true }
);

// Index on dateTime for sorting
eventSchema.index({ dateTime: 1 });

module.exports = mongoose.model('Event', eventSchema);
