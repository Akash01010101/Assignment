const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '10kb' }));

// Routes will be mounted here later
// app.use('/api/auth', require('./routes/authRoutes'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

module.exports = app;
