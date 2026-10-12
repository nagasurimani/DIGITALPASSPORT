import { CalendarDays, MapPin, ShieldCheck } from 'lucide-react'
import { formatDateTime } from '../utils/format'
import StatusBadge from './StatusBadge'
import ShowQr from './ShowQr'

export default function EventPass({ event, student, registration }) {
  const passUrl = typeof window === 'undefined'
    ? `/student/pass/${event.id}`
    : `${window.location.origin}/student/pass/${event.id}`

  return (
    <article className="event-pass">
      <div className="event-pass-top">
        <span><ShieldCheck aria-hidden="true" size={18} /> DIGITAL TECH PASSPORT</span>
        <StatusBadge>{registration.status}</StatusBadge>
      </div>
      <div className="event-pass-event">
        <p>EVENT ACCESS PASS</p>
        <h2>{event.title}</h2>
        <span>{event.organizationName}</span>
      </div>
      <div className="event-pass-details">
        <span><CalendarDays aria-hidden="true" size={16} />{formatDateTime(event.startsAt)}</span>
        <span><MapPin aria-hidden="true" size={16} />{event.venue}</span>
      </div>
      <div className="event-pass-person">
        <div><span>PASS HOLDER</span><strong>{student.name}</strong></div>
        <div><span>PASSPORT ID</span><strong>{student.passportId}</strong></div>
      </div>
      <div className="event-pass-code">
        <ShowQr value={passUrl} />
        <div className="event-pass-code-details"><strong>{registration.passCode}</strong><span>Scan to open this event pass</span></div>
      </div>
      <p className="event-pass-note">Present this pass to the event organizer for registration verification.</p>
    </article>
  )
}
