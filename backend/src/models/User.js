const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'organizer'],
      default: 'user',
      required: true,
    },
    businessProfile: {
      companyName: { type: String, trim: true },
      businessType: { type: String, trim: true },
      location: { type: String, trim: true },
      phoneNumber: { type: String, trim: true },
      companyWebsite: { type: String, trim: true },
      status: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none',
      },
    },
  },
  { timestamps: true }
);

// Virtual for password to handle hashing before save
userSchema.virtual('password').set(function (password) {
  this._password = password;
});

// Pre-save hook to hash password
userSchema.pre('save', async function () {
  if (!this._password) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this._password, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // we need to make sure we query with +passwordHash to use this
  if (!this.passwordHash) {
    throw new Error('passwordHash is not selected in query');
  }
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
