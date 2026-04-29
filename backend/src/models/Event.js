const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
      required: true
    },
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    city: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    about: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    totalTicketsAvailable: { type: Number, required: true, min: 0 },
    ticketsSold: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
