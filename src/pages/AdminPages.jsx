import { useMemo, useState } from 'react'
import { ArrowRight, BadgeCheck, CalendarDays, Search, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, MetricCard, PageHeader } from '../components/DashboardPrimitives'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/useApp'
import { mockClubLeaders, organizations, pendingStudents } from '../data/mockData'
import { formatDate } from '../utils/format'

export function AdminDashboard() {
  const { events, approvalDecisions, leaderStatuses } = useApp()
  const pendingCount = pendingStudents.filter((student) => (approvalDecisions[student.id] ?? student.status) === 'Pending').length
  const activeLeaders = mockClubLeaders.filter((leader) => (leaderStatuses[leader.id] ?? leader.status) === 'Active').length
  return <><PageHeader eyebrow="COLLEGE ADMINISTRATION" title="Overview" description="Review student applications, organization access, and campus activity." />
    <div className="dashboard-metrics"><MetricCard label="Events" value={events.length} detail="Across all organizations" icon={CalendarDays} /><MetricCard label="Pending approvals" value={pendingCount} detail="Require review" icon={BadgeCheck} tone="cyan" /><MetricCard label="Active club leaders" value={activeLeaders} detail="Assigned organization accounts" icon={Users} tone="green" /></div>
    <div className="admin-overview-grid"><section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> STUDENT VERIFICATION</span><h2>Pending applications</h2></div><Link to="/admin/students" className="panel-link">Review all <ArrowRight aria-hidden="true" size={15} /></Link></div><PendingTable limit={3} /></section><section className="admin-side-panel"><span className="admin-shield"><ShieldCheck aria-hidden="true" size={23} /></span><h2>College review stays in control.</h2><p>Student passports remain pending until an administrator reviews the roll number.</p><Link className="text-action" to="/admin/students">Open approval queue <ArrowRight aria-hidden="true" size={15} /></Link></section></div>
    <section className="dashboard-panel table-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> CAMPUS ACTIVITY</span><h2>All events</h2></div><Link to="/admin/events" className="panel-link">Manage events <ArrowRight aria-hidden="true" size={15} /></Link></div><AdminEventTable events={events.slice(0, 5)} /></section>
  </>
}

function PendingTable({ limit }) {
  const { approvalDecisions, setApproval } = useApp()
  const students = pendingStudents.filter((student) => (approvalDecisions[student.id] ?? student.status) === 'Pending').slice(0, limit)
  if (!students.length) return <EmptyState icon={BadgeCheck} title="Queue is clear" description="There are no pending applications." />
  return <div className="approval-list">{students.map((student) => <div className="approval-row" key={student.id}><div><strong>{student.name}</strong><small>{student.rollNumber} · {student.branch}</small></div><div className="approval-actions"><button type="button" className="button button-small button-secondary" onClick={() => setApproval(student.id, 'Rejected')}>Reject</button><button type="button" className="button button-small button-primary" onClick={() => setApproval(student.id, 'Approved')}>Approve</button></div></div>)}</div>
}

export function AdminStudentsPage() {
  const { approvalDecisions, setApproval } = useApp()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const rows = useMemo(() => pendingStudents.filter((student) => {
    const status = approvalDecisions[student.id] ?? student.status
    const matchesQuery = `${student.name} ${student.rollNumber} ${student.branch}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (statusFilter === 'all' || status === statusFilter)
  }), [approvalDecisions, query, statusFilter])
  return <><PageHeader eyebrow="STUDENT VERIFICATION" title="Pending student approvals" description="Review student roll numbers and application information before making a decision." /><div className="admin-toolbar"><label className="admin-search"><Search aria-hidden="true" size={17} /><span className="sr-only">Search applications</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, roll number, or branch" /></label><label><span className="sr-only">Filter approval status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></label></div><section className="dashboard-panel table-panel">
    {rows.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Student</th><th>Roll number</th><th>Branch</th><th>Applied</th><th>Status</th><th>Decision</th></tr></thead><tbody>{rows.map((student) => { const status = approvalDecisions[student.id] ?? student.status; return <tr key={student.id}><td><strong>{student.name}</strong></td><td>{student.rollNumber}</td><td>{student.branch}</td><td>{formatDate(student.appliedAt)}</td><td><StatusBadge>{status}</StatusBadge></td><td>{status === 'Pending' ? <span className="table-actions"><button className="table-text-button danger-text" type="button" onClick={() => setApproval(student.id, 'Rejected')}>Reject</button><button className="table-text-button" type="button" onClick={() => setApproval(student.id, 'Approved')}>Approve</button></span> : 'Reviewed'}</td></tr> })}</tbody></table></div> : <EmptyState icon={Search} title="No matching applications" description="Try searching with another name or roll number." />}
  </section></>
}

export function AdminClubsPage() {
  const { leaderStatuses, toggleLeaderStatus } = useApp()
  return <><PageHeader eyebrow="ORGANIZATION ACCESS" title="Club leaders" description="Manage organizer assignments for the campus organizations." /><div className="leader-grid">{mockClubLeaders.map((leader) => { const organization = organizations.find((item) => item.id === leader.organizationId); const status = leaderStatuses[leader.id] ?? leader.status; return <article className="leader-card" key={leader.id}><div className="leader-card-top"><span className={`club-monogram club-${organization.color}`}>{organization.acronym}</span><StatusBadge>{status}</StatusBadge></div><h2>{leader.name}</h2><p>{leader.email}</p><div className="leader-organization"><span>ASSIGNED ORGANIZATION</span><strong>{organization.name}</strong></div><button className="button button-secondary button-wide" type="button" onClick={() => toggleLeaderStatus(leader.id, status)}>{status === 'Active' ? 'Suspend access' : 'Activate access'}</button></article> })}</div><p className="prototype-note page-note">Organizer accounts are scoped to their assigned organization; this admin view does not transfer club ownership.</p></>
}

function AdminEventTable({ events }) {
  if (!events.length) return <EmptyState icon={CalendarDays} title="No events found" description="Events will appear here when clubs create them." />
  return <div className="table-wrap"><table className="data-table"><thead><tr><th>Event</th><th>Organization</th><th>Category</th><th>Date</th><th>Status</th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td><strong>{event.title}</strong></td><td>{organizations.find((item) => item.id === event.organizationId)?.name}</td><td>{event.category}</td><td>{formatDate(event.startsAt)}</td><td><StatusBadge>{event.registrationStatus === 'Open' ? 'Published' : event.registrationStatus}</StatusBadge></td></tr>)}</tbody></table></div>
}

export function AdminEventsPage() {
  const { events } = useApp()
  const [query, setQuery] = useState('')
  const [organization, setOrganization] = useState('all')
  const [category, setCategory] = useState('all')
  const filteredEvents = events.filter((event) => (
    `${event.title} ${event.category} ${event.organizationId}`.toLowerCase().includes(query.toLowerCase())
    && (organization === 'all' || event.organizationId === organization)
    && (category === 'all' || event.category === category)
  ))
  return <><PageHeader eyebrow="CAMPUS EVENT OVERSIGHT" title="All events" description="Search and filter the event schedule across IEEE, IETE, and R&amp;D." /><div className="admin-toolbar"><label className="admin-search"><Search aria-hidden="true" size={17} /><span className="sr-only">Search all events</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, categories, organizations" /></label><label><span className="sr-only">Filter by organization</span><select value={organization} onChange={(event) => setOrganization(event.target.value)}><option value="all">All organizations</option>{organizations.map((item) => <option value={item.id} key={item.id}>{item.acronym}</option>)}</select></label><label><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{['Workshop', 'Hackathon', 'Seminar', 'Competition'].map((item) => <option key={item}>{item}</option>)}</select></label></div><section className="dashboard-panel table-panel"><AdminEventTable events={filteredEvents} /></section></>
}
