const jwt = require('jsonwebtoken');

function requireOrganizerAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      success: false,
      message: 'JWT secret is not configured',
      data: null
    });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Organizer token is required',
      data: null
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.organizerId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid organizer token payload',
        data: null
      });
    }

    req.organizer = { organizerId: decoded.organizerId };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      data: null
    });
  }
}

module.exports = requireOrganizerAuth;
