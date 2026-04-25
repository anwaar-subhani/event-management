const mongoose = require('mongoose');
const Event = require('../models/Event');

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

async function getAllEvents(req, res) {
  try {
    const events = await Event.find({ isActive: true, isPublished: true })
      .sort({ date: 1, createdAt: -1 })
      .select('-__v');

    return res.status(200).json({
      success: true,
      message: 'Public events fetched successfully',
      data: { events }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      data: null
    });
  }
}

async function getEventById(req, res) {
  const { eventId } = req.params;

  if (!isValidObjectId(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event id',
      data: null
    });
  }

  try {
    const event = await Event.findOne({
      _id: eventId,
      isActive: true,
      isPublished: true
    }).select('-__v');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event details fetched successfully',
      data: { event }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch event details',
      data: null
    });
  }
}

async function createEvent(req, res) {
  const organizerId = req.organizer && req.organizer.organizerId;

  if (!organizerId || !isValidObjectId(organizerId)) {
    return res.status(401).json({
      success: false,
      message: 'Organizer authentication is required',
      data: null
    });
  }

  const {
    title,
    date,
    city,
    location,
    category,
    about,
    details,
    ticketPrice,
    totalTicketsAvailable,
    isPublished,
    isActive
  } = req.body;

  const requiredValues = [
    title,
    date,
    city,
    location,
    category,
    about,
    details,
    ticketPrice,
    totalTicketsAvailable
  ];

  if (requiredValues.some((value) => value === undefined || value === null || value === '')) {
    return res.status(400).json({
      success: false,
      message: 'Missing required event fields',
      data: null
    });
  }

  if (Number(ticketPrice) < 0 || Number(totalTicketsAvailable) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Ticket price and total tickets must be non-negative',
      data: null
    });
  }

  try {
    const event = await Event.create({
      organizerId,
      title,
      date,
      city,
      location,
      category,
      about,
      details,
      ticketPrice: Number(ticketPrice),
      totalTicketsAvailable: Number(totalTicketsAvailable),
      isPublished: isPublished === undefined ? true : Boolean(isPublished),
      isActive: isActive === undefined ? true : Boolean(isActive)
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create event',
      data: null
    });
  }
}

async function updateEvent(req, res) {
  const organizerId = req.organizer && req.organizer.organizerId;
  const { eventId } = req.params;

  if (!organizerId || !isValidObjectId(organizerId)) {
    return res.status(401).json({
      success: false,
      message: 'Organizer authentication is required',
      data: null
    });
  }

  if (!isValidObjectId(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event id',
      data: null
    });
  }

  const allowedFields = [
    'title',
    'date',
    'city',
    'location',
    'category',
    'about',
    'details',
    'ticketPrice',
    'totalTicketsAvailable',
    'isPublished',
    'isActive'
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (updates.ticketPrice !== undefined && Number(updates.ticketPrice) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Ticket price must be non-negative',
      data: null
    });
  }

  if (updates.totalTicketsAvailable !== undefined && Number(updates.totalTicketsAvailable) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Total tickets must be non-negative',
      data: null
    });
  }

  try {
    const existingEvent = await Event.findById(eventId);

    if (!existingEvent || !existingEvent.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        data: null
      });
    }

    if (String(existingEvent.organizerId) !== String(organizerId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this event',
        data: null
      });
    }

    if (
      updates.totalTicketsAvailable !== undefined &&
      Number(updates.totalTicketsAvailable) < existingEvent.ticketsSold
    ) {
      return res.status(400).json({
        success: false,
        message: 'Total tickets cannot be less than tickets already sold',
        data: null
      });
    }

    if (updates.ticketPrice !== undefined) {
      updates.ticketPrice = Number(updates.ticketPrice);
    }

    if (updates.totalTicketsAvailable !== undefined) {
      updates.totalTicketsAvailable = Number(updates.totalTicketsAvailable);
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update event',
      data: null
    });
  }
}

async function deleteEvent(req, res) {
  const organizerId = req.organizer && req.organizer.organizerId;
  const { eventId } = req.params;

  if (!organizerId || !isValidObjectId(organizerId)) {
    return res.status(401).json({
      success: false,
      message: 'Organizer authentication is required',
      data: null
    });
  }

  if (!isValidObjectId(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event id',
      data: null
    });
  }

  try {
    const event = await Event.findById(eventId);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        data: null
      });
    }

    if (String(event.organizerId) !== String(organizerId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to delete this event',
        data: null
      });
    }

    event.isActive = false;
    await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: { eventId: event._id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      data: null
    });
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
