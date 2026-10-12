import { useMemo } from 'react'
import { ArrowRight, BadgeCheck, CalendarDays, CircleUserRound, Clock3, Fingerprint, QrCode, TicketCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import EventPass from '../components/EventPass'
import PassportCard from '../components/PassportCard'
import { EmptyState, MetricCard, PageHeader } from '../components/DashboardPrimitives'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/useApp'
import { organizations } from '../data/mockData'
import { formatDate, organizationName } from '../utils/format'

const currentTime = Date.now()

function useRegistrationEvents() {
  const { registrations, events, attendance } = useApp()
  return useMemo(() => registrations.map((registration) => ({
    registration,
    event: events.find((item) => item.id === registration.eventId),
    attended: attendance[registration.id] ?? registration.attended,
  })).filter((item) => item.event), [attendance, events, registrations])
}

function RegistrationTable({ rows, emptyTitle = 'No registrations yet' }) {
  if (!rows.length) return <EmptyState icon={TicketCheck} title={emptyTitle} description="Once you register for a campus event, it will appear here." action="Explore events" to="/events" />

  return (
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Event</th><th>Organization</th><th>Date</th><th>Status</th><th /></tr></thead><tbody>
      {rows.map(({ event, registration }) => (
        <tr key={registration.id}>
          <td><strong>{event.title}</strong><small>{event.category}</small></td>
          <td>{organizationName(organizations, event.organizationId)}</td>
          <td>{formatDate(event.startsAt)}</td>
          <td><StatusBadge>{registration.status}</StatusBadge></td>
          <td>{registration.status === 'Confirmed' && <Link className="table-action" to={`/student/pass/${event.id}`}>View Pass <ArrowRight aria-hidden="true" size={14} /></Link>}</td>
        </tr>
      ))}
    </tbody></table></div>
  )
}

export function StudentDashboard() {
  const { user, registrations, attendance } = useApp()
  const rows = useRegistrationEvents()
  const attended = registrations.filter((registration) => attendance[registration.id] ?? registration.attended).length
  const upcoming = rows.filter(({ event, registration }) => registration.status === 'Confirmed' && Date.parse(event.startsAt) >= currentTime).length

  return (
    <>
      <PageHeader eyebrow="STUDENT OVERVIEW" title={`Welcome back, ${user.name.split(' ')[0]}`} description="Your passport, campus events, and event passes at a glance." action={<Link to="/events" className="button button-primary">Explore events <ArrowRight aria-hidden="true" size={16} /></Link>} />
      <div className="dashboard-metrics">
        <MetricCard label="Registered" value={registrations.length} detail="Across your event list" icon={TicketCheck} />
        <MetricCard label="Attended" value={attended} detail="Verified check-ins" icon={BadgeCheck} tone="green" />
        <MetricCard label="Coming up" value={upcoming} detail="Confirmed future events" icon={CalendarDays} tone="cyan" />
      </div>
      <div className="student-home-grid">
        <section className="dashboard-panel passport-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> YOUR DIGITAL ID</span><h2>Student passport</h2></div><Link to="/student/passport" className="panel-link">Full view <ArrowRight aria-hidden="true" size={15} /></Link></div><PassportCard student={user} compact /></section>
        <section className="dashboard-panel next-event-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> NEXT UP</span><h2>Your next event</h2></div></div>
          {rows.filter(({ event, registration }) => registration.status === 'Confirmed' && Date.parse(event.startsAt) >= currentTime).sort((a, b) => Date.parse(a.event.startsAt) - Date.parse(b.event.startsAt)).slice(0, 1).map(({ event }) => <div className="next-event-card" key={event.id}><StatusBadge tone="info">{event.category}</StatusBadge><h3>{event.title}</h3><p><CalendarDays aria-hidden="true" size={15} />{formatDate(event.startsAt)}</p><p><Clock3 aria-hidden="true" size={15} />{event.venue}</p><Link to={`/student/pass/${event.id}`} className="button button-secondary button-wide">Open event pass <ArrowRight aria-hidden="true" size={15} /></Link></div>)}
          {!upcoming && <EmptyState icon={CalendarDays} title="Nothing on your calendar" description="Find a workshop or competition to get started." action="Browse events" to="/events" />}
        </section>
      </div>
      <section className="dashboard-panel table-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> YOUR ACTIVITY</span><h2>My registrations</h2></div><Link to="/student/registrations" className="panel-link">All registrations <ArrowRight aria-hidden="true" size={15} /></Link></div><RegistrationTable rows={rows.slice(0, 4)} /></section>
    </>
  )
}

export function StudentPassportPage() {
  const { user } = useApp()
  return <><PageHeader eyebrow="PERMANENT STUDENT IDENTIFIER" title="My Passport" description="Your Digital Passport ID is your permanent student identifier." /><div className="passport-page-grid"><PassportCard student={user} /><aside className="dashboard-panel passport-explainer"><span className="explainer-icon"><Fingerprint aria-hidden="true" size={21} /></span><h2>One student identity</h2><p>Your passport ID belongs to your student profile. Every event registration receives its own separate event pass.</p><div className="explainer-row"><span>Verification</span><StatusBadge>{user.verificationStatus}</StatusBadge></div><div className="explainer-row"><span>College roll number</span><strong>{user.rollNumber}</strong></div></aside></div></>
}

export function StudentRegistrationsPage() {
  const rows = useRegistrationEvents()
  return <><PageHeader eyebrow="YOUR EVENT ACTIVITY" title="My Registrations" description="Each confirmed registration has its own event-specific pass." action={<Link to="/events" className="button button-primary">Find an event <ArrowRight aria-hidden="true" size={16} /></Link>} /><section className="dashboard-panel table-panel"><RegistrationTable rows={rows} /></section></>
}

export function StudentAttendancePage() {
  const rows = useRegistrationEvents()
  const attendedRows = rows.filter(({ attended }) => attended)
  return <><PageHeader eyebrow="CHECK-IN HISTORY" title="Attendance" description="Review your event check-ins and attendance history." /><section className="dashboard-panel table-panel">
    {attendedRows.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Event</th><th>Organization</th><th>Date</th><th>Attendance</th></tr></thead><tbody>{attendedRows.map(({ event, registration }) => <tr key={registration.id}><td><strong>{event.title}</strong></td><td>{organizationName(organizations, event.organizationId)}</td><td>{formatDate(event.startsAt)}</td><td><StatusBadge>Present</StatusBadge></td></tr>)}</tbody></table></div> : <EmptyState icon={BadgeCheck} title="No verified attendance yet" description="After an organizer checks in your event pass, the attendance record will appear here." action="Explore events" to="/events" />}
  </section></>
}

export function StudentProfilePage() {
  const { user, notify } = useApp()
  return <><PageHeader eyebrow="STUDENT PROFILE" title="Profile" description="Review your student and college information." /><section className="dashboard-panel profile-panel"><div className="profile-summary"><span className="profile-avatar"><CircleUserRound aria-hidden="true" size={29} /></span><div><h2>{user.name}</h2><p>{user.branch} · Class of {user.graduationYear}</p></div><StatusBadge>{user.verificationStatus}</StatusBadge></div><dl className="profile-details"><div><dt>College roll number</dt><dd>{user.rollNumber}</dd></div><div><dt>Digital Passport ID</dt><dd>{user.passportId}</dd></div><div><dt>College email</dt><dd>{user.email}</dd></div></dl><button className="button button-secondary" type="button" onClick={() => notify('Please contact college administration to request a profile change.', 'info')}>Request a profile change</button></section></>
}

export function StudentPassPage() {
  const { eventId } = useParams()
  const { user, events, registrations } = useApp()
  const event = events.find((item) => item.id === eventId)
  const registration = registrations.find((item) => item.eventId === eventId)
  if (!event || !registration) return <><PageHeader eyebrow="EVENT ACCESS" title="Pass unavailable" description="A pass is created for each confirmed event registration." /><EmptyState icon={QrCode} title="No confirmed event pass" description="Register for an event to see its separate pass here." action="Explore events" to="/events" /></>
  const organization = organizations.find((item) => item.id === event.organizationId)
  return <><PageHeader eyebrow="EVENT-SPECIFIC ACCESS" title="Your event pass" description="Present this pass to the event organizer at check-in." /><div className="event-pass-wrap"><EventPass event={{ ...event, organizationName: organization?.name }} student={user} registration={registration} /></div><Link to="/student/registrations" className="back-link"><ArrowRight aria-hidden="true" size={15} /> Back to my registrations</Link></>
}
