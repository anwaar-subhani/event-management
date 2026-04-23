const express = require('express');
const { createTicketPurchase } = require('../controllers/ticketController');

const router = express.Router();

// Guest ticket purchase (no user login required)
router.post('/purchase', createTicketPurchase);

module.exports = router;
