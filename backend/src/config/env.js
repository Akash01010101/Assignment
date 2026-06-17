require('dotenv').config();

const requiredEnvs = ['MONGODB_URI', 'JWT_SECRET'];

requiredEnvs.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is missing.`);
    process.exit(1);
  }
});

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  RESERVATION_TTL_MINUTES: parseInt(process.env.RESERVATION_TTL_MINUTES, 10) || 10,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
