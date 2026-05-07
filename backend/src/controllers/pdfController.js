const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const Event = require('../models/Event');
const TicketPurchase = require('../models/TicketPurchase');

exports.generateTicketPdf = async (req, res) => {
  let browser;
  try {
    const id = req.params.id;
    console.log('PDF generation request for ticket:', id);
    
    const ticket = await TicketPurchase.findById(id).lean();
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    console.log('Found ticket:', ticket._id, 'for event:', ticket.eventId);

    const event = await Event.findById(ticket.eventId).lean();
    if (!event) {
      console.error('Event not found for eventId:', ticket.eventId);
      return res.status(404).json({ error: 'Event not found' });
    }
    console.log('Found event:', event._id, 'title:', event.title);

    const templatePath = path.join(__dirname, '..', 'views', 'ticket.ejs');

    // qrDataUrl can be provided on the ticket doc; otherwise leave empty
    const qrDataUrl = ticket.qrDataUrl || '';

    let html;
    try {
      html = await ejs.renderFile(templatePath, {
        event,
        ticket,
        qrDataUrl,
        logoUrl: (process.env.SERVER_URL || '') + '/public/logo.png'
      });
      console.log('EJS template rendered successfully, HTML length:', html.length);
    } catch (renderErr) {
      console.error('EJS rendering error:', renderErr);
      return res.status(500).json({ error: 'Failed to render ticket template', details: renderErr.message });
    }

    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
    const launchOptions = executablePath
      ? { executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox'], timeout: 30000 }
      : { args: ['--no-sandbox', '--disable-setuid-sandbox'], timeout: 30000 };

    console.log('Launching browser with timeout 30s...');
    browser = await puppeteer.launch(launchOptions);
    console.log('Browser launched successfully');
    
    try {
      const page = await browser.newPage();
      console.log('Creating new page...');
      
      // Set content with specific options
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });
      console.log('Page content set');
      
      console.log('Generating PDF...');
      const pdfBuffer = await page.pdf({ 
        format: 'A4', 
        printBackground: true, 
        margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
      });

      if (!pdfBuffer || pdfBuffer.length === 0) {
        console.error('PDF buffer is empty');
        return res.status(500).json({ error: 'PDF generation produced empty buffer' });
      }

      console.log('PDF generated successfully, size:', pdfBuffer.length);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.setHeader('Content-Disposition', `attachment; filename="${(event?.title || 'ticket').replace(/\s+/g, '_')}.pdf"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.end(pdfBuffer);
    } finally {
      if (browser) {
        console.log('Closing browser...');
        await browser.close();
        console.log('Browser closed');
      }
    }
  } catch (err) {
    console.error('PDF generation error:', err.message, err.stack);
    if (err.message && err.message.toLowerCase().includes('browser')) {
      return res.status(500).json({ error: 'Browser binary not available for PDF generation.' });
    }
    return res.status(500).json({ error: 'PDF generation failed', details: err.message });
  }
};
