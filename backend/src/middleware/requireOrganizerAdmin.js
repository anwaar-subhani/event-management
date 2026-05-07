const Organizer = require('../models/Organizer');

async function requireOrganizerAdmin(req, res, next) {
  const organizerId = req.organizer && req.organizer.organizerId;

  if (!organizerId) {
    return res.status(401).json({
      success: false,
      message: 'Organizer authentication is required',
      data: null
    });
  }

  try {
    const organizer = await Organizer.findById(organizerId).select('isActive isAdmin');

    if (!organizer || !organizer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Organizer account is not available',
        data: null
      });
    }

    if (organizer.isAdmin === false) {
      return res.status(403).json({
        success: false,
        message: 'Admin access is required',
        data: null
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to verify admin access',
      data: null
    });
  }
}

module.exports = requireOrganizerAdmin;