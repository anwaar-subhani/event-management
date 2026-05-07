const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

// Generate/Download ticket PDF by ticket purchase id
router.get('/tickets/:id/pdf', pdfController.generateTicketPdf);

module.exports = router;
