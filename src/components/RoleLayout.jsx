import { useState } from 'react'
import { ArrowLeft, BadgeCheck, CalendarDays, ChevronRight, ClipboardList, LayoutDashboard, LogOut, Menu, Plus, ShieldCheck, UserRound, Users, X } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { organizations } from '../data/mockData'
import { useApp } from '../context/useApp'

const navigation = {
  student: [
    { label: 'Dashboard', to: '/student', end: true, icon: LayoutDashboard },
    { label: 'My Passport', to: '/student/passport', icon: ShieldCheck },
    { label: 'Events', to: '/events', icon: CalendarDays },
    { label: 'My Registrations', to: '/student/registrations', icon: ClipboardList },
    { label: 'Attendance', to: '/student/attendance', icon: BadgeCheck },
    { label: 'Profile', to: '/student/profile', icon: UserRound },
  ],
  organizer: [
    { label: 'Dashboard', to: '/organizer', end: true, icon: LayoutDashboard },
    { label: 'My Events', to: '/organizer/events', icon: CalendarDays },
    { label: 'Create Event', to: '/organizer/events/new', icon: Plus },
    { label: 'Registrations', to: '/organizer/registrations', icon: ClipboardList },
    { label: 'Attendance', to: '/organizer/attendance', icon: BadgeCheck },
    { label: 'Profile', to: '/organizer/profile', icon: UserRound },
  ],
  admin: [
    { label: 'Overview', to: '/admin', end: true, icon: LayoutDashboard },
    { label: 'Student approvals', to: '/admin/students', icon: BadgeCheck },
    { label: 'Club leaders', to: '/admin/clubs', icon: Users },
    { label: 'All events', to: '/admin/events', icon: CalendarDays },
  ],
}

const roleTitles = { student: 'Student workspace', organizer: 'Club organizer', admin: 'College admin' }

export default function RoleLayout({ role }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const organization = user.organizationId && organizations.find((item) => item.id === user.organizationId)

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar${mobileOpen ? ' sidebar-open' : ''}`}>
        <Link className="dashboard-brand" to="/">
          <span className="brand-symbol"><ShieldCheck aria-hidden="true" size={19} /></span>
          <span>Digital Tech<br /><strong>Passport</strong></span>
        </Link>
        <div className="sidebar-user">
          <span className="sidebar-avatar">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
          <span><strong>{user.name}</strong><small>{roleTitles[role]}</small></span>
        </div>
        {organization && <div className="assigned-club"><small>ASSIGNED ORGANIZATION</small><strong>{organization.name}</strong></div>}
        <nav className="dashboard-nav" aria-label={`${roleTitles[role]} navigation`}>
          {navigation[role].map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)}>
              <item.icon className="nav-glyph" aria-hidden="true" size={18} />{item.label}
              <ChevronRight className="nav-chevron" aria-hidden="true" size={15} />
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button type="button" className="sidebar-logout" onClick={handleLogout}><LogOut aria-hidden="true" size={16} /> Log out</button>
          <Link to="/" className="back-home"><ArrowLeft aria-hidden="true" size={15} /> Back to home</Link>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="dashboard-menu-toggle" type="button" aria-label={mobileOpen ? 'Close dashboard menu' : 'Open dashboard menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}>
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <span className="dashboard-breadcrumb">{roleTitles[role]}</span>
          {organization && <span className="assigned-chip"><span />{organization.acronym} workspace</span>}
        </header>
        <main className="dashboard-content"><Outlet /></main>
      </div>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Close dashboard menu" onClick={() => setMobileOpen(false)} />}
    </div>
  )
}
