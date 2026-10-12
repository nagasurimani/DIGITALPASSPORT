import { useMemo, useState } from 'react'
import { ArrowRight, BadgeCheck, CalendarDays, ClipboardList, Clock3, Eye, Pencil, Plus, Users } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { EmptyState, MetricCard, PageHeader } from '../components/DashboardPrimitives'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/useApp'
import { mockAttendees, organizations } from '../data/mockData'
import { formatDate } from '../utils/format'

function localDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

function useAssignedEvents() {
  const { events, user } = useApp()
  return useMemo(() => events.filter((event) => event.organizationId === user.organizationId), [events, user.organizationId])
}

function OrganizerTable({ events }) {
  if (!events.length) return <EmptyState icon={CalendarDays} title="No events yet" description="Create your first event for your assigned organization." action="Create event" to="/organizer/events/new" />
  return <div className="table-wrap"><table className="data-table"><thead><tr><th>Event</th><th>Date</th><th>Registrations</th><th>Status</th><th>Actions</th></tr></thead><tbody>
    {events.map((event) => {
      const count = mockAttendees.filter((attendee) => attendee.eventId === event.id).length
      return <tr key={event.id}><td><strong>{event.title}</strong><small>{event.category}</small></td><td>{formatDate(event.startsAt)}</td><td>{count} / {event.capacity}</td><td><StatusBadge>{event.registrationStatus === 'Open' ? 'Published' : event.registrationStatus}</StatusBadge></td><td><span className="table-actions"><Link className="icon-action" to={`/organizer/events/${event.id}/edit`} aria-label={`Edit ${event.title}`}><Pencil aria-hidden="true" size={16} /></Link><Link className="table-action" to={`/organizer/registrations?eventId=${event.id}`}>Registrations <ArrowRight aria-hidden="true" size={14} /></Link></span></td></tr>
    })}
  </tbody></table></div>
}

export function OrganizerDashboard() {
  const events = useAssignedEvents()
  const registrations = mockAttendees.filter((attendee) => events.some((event) => event.id === attendee.eventId))
  const openEvents = events.filter((event) => event.registrationStatus === 'Open').length
  return <>
    <PageHeader eyebrow="ASSIGNED CLUB WORKSPACE" title="Organizer dashboard" description="Manage events only for your assigned organization." action={<Link className="button button-primary" to="/organizer/events/new"><Plus aria-hidden="true" size={16} /> Create event</Link>} />
    <div className="assigned-notice"><BadgeCheck aria-hidden="true" size={18} /><span>Managing <strong>{organizations.find((organization) => organization.id === 'ieee')?.name}</strong>. Club access is limited to this assigned organization.</span></div>
    <div className="dashboard-metrics"><MetricCard label="My events" value={events.length} detail="Assigned club only" icon={CalendarDays} /><MetricCard label="Open for registration" value={openEvents} detail="Published events" icon={Clock3} tone="cyan" /><MetricCard label="Registrations" value={registrations.length} detail="Attendee registrations" icon={Users} tone="green" /></div>
    <section className="dashboard-panel table-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> EVENT MANAGEMENT</span><h2>Recent events</h2></div><Link className="panel-link" to="/organizer/events">All my events <ArrowRight aria-hidden="true" size={15} /></Link></div><OrganizerTable events={events.slice(0, 4)} /></section>
  </>
}

export function OrganizerEventsPage() {
  const events = useAssignedEvents()
  return <><PageHeader eyebrow="ASSIGNED CLUB ONLY" title="My Events" description="Create and manage events owned by your assigned organization." action={<Link className="button button-primary" to="/organizer/events/new"><Plus aria-hidden="true" size={16} /> Create event</Link>} /><section className="dashboard-panel table-panel"><OrganizerTable events={events} /></section></>
}

export function OrganizerEventFormPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { user, addEvent, updateEvent, notify } = useApp()
  const events = useAssignedEvents()
  const event = eventId ? events.find((item) => item.id === eventId) : null
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState(() => ({
    title: event?.title ?? '',
    category: event?.category ?? 'Workshop',
    startsAt: localDateTime(event?.startsAt) || '2027-03-10T09:00',
    endsAt: localDateTime(event?.endsAt) || '2027-03-10T16:00',
    status: event ? (event.registrationStatus === 'Open' ? 'Published' : event.registrationStatus) : 'Draft',
    venue: event?.venue ?? '',
    capacity: event?.capacity ?? 40,
    availableSeats: event?.availableSeats ?? 40,
    summary: event?.summary ?? '',
    description: event?.description ?? '',
    imageUrl: event?.imageUrl ?? '',
  }))

  if (eventId && !event) return <EmptyState icon={CalendarDays} title="Event not available" description="This event is not assigned to your club workspace." action="Back to my events" to="/organizer/events" />

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault()
    if (new Date(form.endsAt) <= new Date(form.startsAt)) {
      setFormError('The end time must be after the start time.')
      return
    }
    if (Number(form.availableSeats) > Number(form.capacity)) {
      setFormError('Available seats cannot exceed event capacity.')
      return
    }
    setFormError('')
    const organization = organizations.find((item) => item.id === user.organizationId)
    const { status, ...eventFields } = form
    const payload = {
      ...eventFields,
      id: event?.id ?? `event-${Date.now().toString(36)}`,
      organizationId: user.organizationId,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
      capacity: Number(form.capacity),
      availableSeats: Number(form.availableSeats),
      registrationStatus: status === 'Published' ? 'Open' : status,
      imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82',
      takeaways: event?.takeaways ?? ['Explore a technical topic', 'Learn from club mentors', 'Connect with other students'],
      eligibility: event?.eligibility ?? 'Current students of Sir C. R. Reddy College of Engineering.',
      organizationName: organization?.name,
    }
    if (event) updateEvent(event.id, payload)
    else addEvent(payload)
    notify(`Saved under ${organization?.name}.`)
    navigate('/organizer/events')
  }

  return <><PageHeader eyebrow="CLUB EVENT MANAGEMENT" title={event ? 'Edit event' : 'Create an event'} description="This event will belong to your assigned club and cannot be published for another organization." />
    <section className="dashboard-panel event-form-panel">
      <div className="locked-organization"><span><BadgeCheck aria-hidden="true" size={18} /> Assigned organization</span><strong>{organizations.find((item) => item.id === user.organizationId)?.name}</strong><small>Club selector is locked to your organizer role.</small></div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field-span-2">Event title *<input required value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="e.g. Introduction to Embedded Linux" /></label>
        <label>Category *<select value={form.category} onChange={(event) => updateField('category', event.target.value)}>{['Workshop', 'Hackathon', 'Seminar', 'Competition'].map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Venue *<input required value={form.venue} onChange={(event) => updateField('venue', event.target.value)} placeholder="Lab or campus venue" /></label>
        <label>Starts *<input required type="datetime-local" value={form.startsAt} onChange={(event) => updateField('startsAt', event.target.value)} /></label>
        <label>Ends *<input required type="datetime-local" value={form.endsAt} onChange={(event) => updateField('endsAt', event.target.value)} /></label>
        <label>Event status *<select value={form.status} onChange={(event) => updateField('status', event.target.value)}>{['Draft', 'Published', 'Completed'].map((status) => <option key={status}>{status}</option>)}</select></label>
        <label>Capacity *<input required type="number" min="1" value={form.capacity} onChange={(event) => updateField('capacity', event.target.value)} /></label>
        <label>Available seats *<input required type="number" min="0" value={form.availableSeats} onChange={(event) => updateField('availableSeats', event.target.value)} /></label>
        <label className="field-span-2">Short summary *<input required maxLength="140" value={form.summary} onChange={(event) => updateField('summary', event.target.value)} /></label>
        <label className="field-span-2">Description *<textarea required rows="4" value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label>
        <label className="field-span-2">Image URL (optional)<input type="url" value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} placeholder="https://..." /></label>
        {formError && <p className="form-error field-span-2" role="alert">{formError}</p>}
        <div className="form-actions field-span-2"><Link className="button button-secondary" to="/organizer/events">Cancel</Link><button className="button button-primary" type="submit">{event ? 'Save changes' : form.status === 'Published' ? 'Publish event' : form.status === 'Completed' ? 'Save completed event' : 'Save event draft'} <ArrowRight aria-hidden="true" size={16} /></button></div>
      </form>
    </section>
  </>
}

export function OrganizerRegistrationsPage() {
  const events = useAssignedEvents()
  const [searchParams] = useSearchParams()
  const requestedEvent = searchParams.get('eventId')
  const eventIds = new Set(events.map((event) => event.id))
  const attendees = mockAttendees.filter((attendee) => eventIds.has(attendee.eventId) && (!requestedEvent || attendee.eventId === requestedEvent))
  return <><PageHeader eyebrow="ATTENDEE REGISTRATIONS" title="Registrations" description="Review attendees registered for your club events." /><section className="dashboard-panel table-panel">
    {attendees.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Student</th><th>Roll number</th><th>Event</th><th>Status</th><th /></tr></thead><tbody>{attendees.map((attendee) => <tr key={attendee.id}><td><strong>{attendee.name}</strong></td><td>{attendee.rollNumber}</td><td>{events.find((event) => event.id === attendee.eventId)?.title}</td><td><StatusBadge>{attendee.status === 'Registered' ? 'Confirmed' : attendee.status}</StatusBadge></td><td><Link className="table-action" to={`/organizer/attendance?eventId=${attendee.eventId}`}><Eye aria-hidden="true" size={15} /> Attendance</Link></td></tr>)}</tbody></table></div> : <EmptyState icon={ClipboardList} title="No registrations to show" description="New event registrations will appear here." action="View my events" to="/organizer/events" />}
  </section></>
}

export function OrganizerAttendancePage() {
  const events = useAssignedEvents()
  const { attendance, markAttendance } = useApp()
  const eventIds = new Set(events.map((event) => event.id))
  const attendees = mockAttendees.filter((attendee) => eventIds.has(attendee.eventId))
  return <><PageHeader eyebrow="EVENT CHECK-IN" title="Attendance" description="Review attendance for your club events and mark attendee check-ins." /><section className="dashboard-panel table-panel">
    {attendees.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Student</th><th>Roll number</th><th>Event</th><th>Attendance</th><th /></tr></thead><tbody>{attendees.map((attendee) => { const present = attendance[attendee.id] ?? false; return <tr key={attendee.id}><td><strong>{attendee.name}</strong></td><td>{attendee.rollNumber}</td><td>{events.find((event) => event.id === attendee.eventId)?.title}</td><td><StatusBadge tone={present ? 'success' : 'neutral'}>{present ? 'Present' : 'Not checked in'}</StatusBadge></td><td><button className="button button-small button-secondary" type="button" onClick={() => markAttendance(attendee.id, !present)}>{present ? 'Undo' : 'Mark present'}</button></td></tr> })}</tbody></table></div> : <EmptyState icon={Users} title="No attendees yet" description="Registrations will appear here as they come in." />}
  </section></>
}

export function OrganizerProfilePage() {
  const { user } = useApp()
  const organization = organizations.find((item) => item.id === user.organizationId)
  return <><PageHeader eyebrow="ORGANIZER PROFILE" title="Club profile" description="Your organizer access is scoped to one assigned organization." /><section className="dashboard-panel profile-panel"><div className="profile-summary"><span className="profile-avatar"><Users aria-hidden="true" size={27} /></span><div><h2>{user.name}</h2><p>Club organizer · {organization?.name}</p></div><StatusBadge>Active</StatusBadge></div><dl className="profile-details"><div><dt>Assigned organization</dt><dd>{organization?.name}</dd></div><div><dt>Organizer email</dt><dd>{user.email}</dd></div><div><dt>Access scope</dt><dd>Events owned by {organization?.acronym}</dd></div></dl><p className="prototype-note">The organization selector is intentionally unavailable for this organizer role.</p></section></>
}
