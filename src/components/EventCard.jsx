import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { organizations } from '../data/mockData'
import { formatDate } from '../utils/format'
import StatusBadge from './StatusBadge'

export default function EventCard({ event, registrations = [] }) {
  const organization = organizations.find((item) => item.id === event.organizationId)
  const registered = registrations.some((registration) => registration.eventId === event.id)

  return (
    <article className="event-card">
      <Link className={`event-art art-${event.organizationId}`} to={`/events/${event.id}`} aria-label={`View ${event.title}`}>
        <img src={event.imageUrl} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} />
        <span className="event-category">{event.category}</span>
        <span className="event-art-mark">{organization?.acronym}</span>
      </Link>
      <div className="event-card-body">
        <div className="event-card-topline">
          <span className="organizer-name">{organization?.name ?? 'Campus event'}</span>
          {registered && <StatusBadge>Confirmed</StatusBadge>}
        </div>
        <h3><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
        <p className="event-summary">{event.summary}</p>
        <div className="event-card-meta">
          <span><CalendarDays aria-hidden="true" size={15} />{formatDate(event.startsAt, { month: 'short', day: 'numeric' })}</span>
          <span><MapPin aria-hidden="true" size={15} />{event.venue}</span>
          <span><Users aria-hidden="true" size={15} />{event.availableSeats} seats left</span>
        </div>
        <div className="event-card-bottom">
          <StatusBadge tone={event.registrationStatus === 'Open' ? 'success' : 'neutral'}>{event.registrationStatus}</StatusBadge>
          <Link className="event-details-link" to={`/events/${event.id}`}>View details <ArrowUpRight aria-hidden="true" size={15} /></Link>
        </div>
      </div>
    </article>
  )
}
