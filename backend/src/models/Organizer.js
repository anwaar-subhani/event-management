const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    organizationName: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
    loginCount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organizer', organizerSchema);
