const express = require('express');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const requireOrganizerAuth = require('../middleware/requireOrganizerAuth');

const router = express.Router();

// Public (for normal users browsing events)
router.get('/', getAllEvents);
router.get('/:eventId', getEventById);

// Organizer only
router.post('/', requireOrganizerAuth, createEvent);
router.patch('/:eventId', requireOrganizerAuth, updateEvent);
router.delete('/:eventId', requireOrganizerAuth, deleteEvent);

module.exports = router;
