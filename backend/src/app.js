const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '10kb' }));

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/reserve', require('./routes/reservationRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Mount Admin Routes
app.use('/api/admin/events', require('./routes/admin/adminEventRoutes'));
app.use('/api/admin/seats', require('./routes/admin/adminSeatRoutes'));
app.use('/api/admin/bookings', require('./routes/admin/adminBookingRoutes'));
app.use('/api/admin/stats', require('./routes/admin/adminStatsRoutes'));
app.use('/api/admin', require('./routes/admin/adminBusinessRoutes'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

module.exports = app;
