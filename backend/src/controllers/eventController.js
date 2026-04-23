// TODO: implement event CRUD handlers
// Keep this file owned by Member B (Events).

async function getAllEvents(req, res) {
  return res.status(501).json({ message: 'getAllEvents not implemented yet' });
}

async function getEventById(req, res) {
  return res.status(501).json({ message: 'getEventById not implemented yet' });
}

async function createEvent(req, res) {
  return res.status(501).json({ message: 'createEvent not implemented yet' });
}

async function updateEvent(req, res) {
  return res.status(501).json({ message: 'updateEvent not implemented yet' });
}

async function deleteEvent(req, res) {
  return res.status(501).json({ message: 'deleteEvent not implemented yet' });
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
