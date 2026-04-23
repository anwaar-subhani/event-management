const jwt = require('jsonwebtoken');

function requireOrganizerAuth(req, res, next) {
  // Starter middleware. Teammate can complete this.
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Organizer token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.organizer = { organizerId: decoded.organizerId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = requireOrganizerAuth;
