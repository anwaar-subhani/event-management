const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organizer = require('../models/Organizer');

function getJwtSecret() {
  return process.env.JWT_SECRET;
}

function buildTokenPayload(organizer) {
  return {
    organizerId: organizer._id,
    email: organizer.email
  };
}

function buildOrganizerResponse(organizer) {
  return {
    id: organizer._id,
    name: organizer.name,
    email: organizer.email,
    organizationName: organizer.organizationName,
    isActive: organizer.isActive,
    createdAt: organizer.createdAt,
    updatedAt: organizer.updatedAt
  };
}

function signOrganizerToken(organizer) {
  const secret = getJwtSecret();

  if (!secret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign(buildTokenPayload(organizer), secret, { expiresIn: '7d' });
}

async function organizerSignup(req, res) {
  const { name, email, password, organizationName } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required',
      data: null
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
      data: null
    });
  }

  try {
    const existingOrganizer = await Organizer.findOne({ email: String(email).toLowerCase() });

    if (existingOrganizer) {
      return res.status(409).json({
        success: false,
        message: 'An organizer with this email already exists',
        data: null
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const organizer = await Organizer.create({
      name,
      email,
      passwordHash,
      organizationName
    });

    const token = signOrganizerToken(organizer);

    return res.status(201).json({
      success: true,
      message: 'Organizer signup successful',
      data: {
        organizer: buildOrganizerResponse(organizer),
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to signup organizer',
      data: null
    });
  }
}

async function organizerLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
      data: null
    });
  }

  try {
    const organizer = await Organizer.findOne({ email: String(email).toLowerCase() });

    if (!organizer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    const isPasswordValid = await bcrypt.compare(String(password), organizer.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    if (!organizer.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Organizer account is inactive',
        data: null
      });
    }

    const token = signOrganizerToken(organizer);

    return res.status(200).json({
      success: true,
      message: 'Organizer login successful',
      data: {
        organizer: buildOrganizerResponse(organizer),
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to login organizer',
      data: null
    });
  }
}

async function organizerProfile(req, res) {
  const organizerId = req.organizer && req.organizer.organizerId;

  if (!organizerId) {
    return res.status(401).json({
      success: false,
      message: 'Organizer authentication is required',
      data: null
    });
  }

  try {
    const organizer = await Organizer.findById(organizerId).select('-passwordHash -__v');

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Organizer profile fetched successfully',
      data: {
        organizer
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch organizer profile',
      data: null
    });
  }
}

module.exports = {
  organizerSignup,
  organizerLogin,
  organizerProfile
};
