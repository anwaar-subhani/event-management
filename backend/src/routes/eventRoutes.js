const express = require('express');
const {
  getAllEvents,
  getMyEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const requireOrganizerAuth = require('../middleware/requireOrganizerAuth');
const uploadEventPoster = require('../middleware/uploadEventPoster');

const router = express.Router();

// Public (for normal users browsing events)
router.get('/', getAllEvents);
router.get('/organizer/me', requireOrganizerAuth, getMyEvents);
router.get('/:eventId', getEventById);

// Organizer only
router.post('/', requireOrganizerAuth, uploadEventPoster, createEvent);
router.patch('/:eventId', requireOrganizerAuth, uploadEventPoster, updateEvent);
router.delete('/:eventId', requireOrganizerAuth, deleteEvent);

module.exports = router;
