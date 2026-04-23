# MongoDB Schema Overview

## Organizer (auth needed)
- Name
- Email (unique)
- Password hash
- Organization name
- isActive
- createdAt/updatedAt

## Event (created by organizer)
- organizerId (ref Organizer)
- title, date, city, location, category
- about, details
- ticketPrice
- totalTicketsAvailable
- ticketsSold
- isPublished / isActive
- createdAt/updatedAt

## TicketPurchase (guest allowed)
- eventId (ref Event)
- purchaserName
- purchaserCnic
- purchaserEmail
- purchaserPhone
- quantity (1 to 5)
- totalAmount
- paymentStatus
- purchasedAt

### Important rule
Ticket purchase is guest-based. No user signup/login is required.
Only organizers authenticate for event management APIs.
