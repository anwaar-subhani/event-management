const mongoose = require('mongoose');
const Event = require('../models/Event');
const TicketPurchase = require('../models/TicketPurchase');

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

async function createTicketPurchase(req, res) {
  const {
    eventId,
    purchaserName,
    purchaserCnic,
    purchaserEmail,
    purchaserPhone,
    quantity
  } = req.body;

  if (!isValidObjectId(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event id',
      data: null
    });
  }

  const requiredValues = [
    purchaserName,
    purchaserCnic,
    purchaserEmail,
    purchaserPhone,
    quantity
  ];

  if (requiredValues.some((value) => value === undefined || value === null || value === '')) {
    return res.status(400).json({
      success: false,
      message: 'Missing required purchase fields',
      data: null
    });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 5) {
    return res.status(400).json({
      success: false,
      message: 'Ticket quantity must be between 1 and 5',
      data: null
    });
  }

  try {
    const event = await Event.findOne({
      _id: eventId,
      isActive: true,
      isPublished: true
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or unavailable',
        data: null
      });
    }

    const existingPurchases = await TicketPurchase.aggregate([
      {
        $match: {
          eventId: new mongoose.Types.ObjectId(eventId),
          purchaserCnic: purchaserCnic.trim(),
          paymentStatus: { $ne: 'failed' }
        }
      },
      {
        $group: {
          _id: null,
          totalPurchased: { $sum: '$quantity' }
        }
      }
    ]);

    const alreadyPurchased = existingPurchases[0] ? existingPurchases[0].totalPurchased : 0;
    if (alreadyPurchased + qty > 5) {
      return res.status(400).json({
        success: false,
        message: 'A CNIC can purchase at most 5 tickets for the same event',
        data: null
      });
    }

    const availableTickets = event.totalTicketsAvailable - event.ticketsSold;
    if (qty > availableTickets) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableTickets} tickets are available`,
        data: null
      });
    }

    const totalAmount = qty * event.ticketPrice;

    const ticketPurchase = await TicketPurchase.create({
      eventId,
      purchaserName,
      purchaserCnic,
      purchaserEmail,
      purchaserPhone,
      quantity: qty,
      totalAmount,
      paymentStatus: 'paid'
    });

    event.ticketsSold += qty;
    if (event.ticketsSold >= event.totalTicketsAvailable) {
      event.isActive = false;
    }
    await event.save();

    return res.status(201).json({
      success: true,
      message: 'Ticket purchase completed successfully',
      data: {
        purchase: ticketPurchase,
        remainingTickets: Math.max(0, event.totalTicketsAvailable - event.ticketsSold)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to complete ticket purchase',
      data: null
    });
  }
}

module.exports = {
  createTicketPurchase
};
