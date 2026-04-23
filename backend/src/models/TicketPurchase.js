const mongoose = require('mongoose');

const ticketPurchaseSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    purchaserName: { type: String, required: true, trim: true },
    purchaserCnic: { type: String, required: true, trim: true },
    purchaserEmail: { type: String, required: true, lowercase: true, trim: true },
    purchaserPhone: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, max: 5 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TicketPurchase', ticketPurchaseSchema);
