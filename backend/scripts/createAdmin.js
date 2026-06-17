require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

const MONGODB_URI = process.env.MONGODB_URI;
const EMAIL = process.env.ADMIN_SEED_EMAIL;
const PASSWORD = process.env.ADMIN_SEED_PASSWORD;

const createAdmin = async () => {
  try {
    if (!EMAIL || !PASSWORD) {
      console.error('Error: ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be defined in .env');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    const existingAdmin = await User.findOne({ email: EMAIL });

    if (existingAdmin) {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`Admin role confirmed for existing user: ${EMAIL}`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(PASSWORD, salt);

      const user = new User({
        email: EMAIL,
        name: 'Admin User',
        role: 'admin',
        passwordHash,
      });
      await user.save();
      console.log(`Created new admin user: ${EMAIL}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
