import { Link } from 'react-router-dom'
import './EventCard.css'

export default function EventCard({ event }) {
  return (
    <article className="event-card-item">
      <img src={event.image} alt={event.title} className="event-card-image" />

      <div className="event-card-content">
        <h4>{event.title}</h4>
        <p className="event-card-meta">{event.category}</p>
        <p className="event-card-meta">{event.dateLabel || event.date}</p>
        <p className="event-card-meta">{event.location}</p>

        <Link className="event-card-button" to={`/events/${event.id}`}>
          View Details
        </Link>
      </div>
    </article>
  )
}
