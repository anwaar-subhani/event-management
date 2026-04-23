const express = require('express');
const {
  organizerSignup,
  organizerLogin,
  organizerProfile
} = require('../controllers/organizerAuthController');
const requireOrganizerAuth = require('../middleware/requireOrganizerAuth');

const router = express.Router();

router.post('/signup', organizerSignup);
router.post('/login', organizerLogin);
router.get('/me', requireOrganizerAuth, organizerProfile);

module.exports = router;
