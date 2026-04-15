import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { eventsData } from '../data/eventsData'
import './EventDetails.css'

export default function EventDetails() {
  const { eventId } = useParams()
  const event = eventsData.find((item) => item.id === eventId)

  if (!event) {
    return (
      <>
        <Navbar />
        <main className="page event-details-page">
          <div className="event-details-container">
            <h2>Event not found</h2>
            <p>Sorry, we could not find details for this event.</p>
            <Link className="details-back-link" to="/events">
              Back to Events
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="page event-details-page">
        <section className="event-details-container">
          <div className="event-details-left">
            <h2>{event.title}</h2>
            <p className="details-meta">
              {event.category} • {event.date} • {event.location}
            </p>

            <h4>About</h4>
            <p>{event.about}</p>

            <h4>Details</h4>
            <p>{event.details}</p>

            <h4>Ticket Price</h4>
            <p className="ticket-price">{event.ticketPrice}</p>

            <div className="details-actions">
              <Link className="details-purchase-link" to="/login">
                Purchase Tikits
              </Link>

              <Link className="details-back-link" to="/events">
                Back to Events
              </Link>
            </div>
          </div>

          <div className="event-details-right">
            <img src={event.image} alt={event.title} className="event-details-image" />
          </div>
        </section>
      </main>
    </>
  )
}
