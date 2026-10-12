import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Toast from './components/Toast'
import RoleLayout from './components/RoleLayout'
import PublicLayout from './components/PublicLayout'
import { AppProvider } from './context/AppContext'
import { useApp } from './context/useApp'
import { AdminClubsPage, AdminDashboard, AdminEventsPage, AdminStudentsPage } from './pages/AdminPages'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { EventDetailsPage, EventsPage, HomePage } from './pages/PublicPages'
import { OrganizerAttendancePage, OrganizerDashboard, OrganizerEventFormPage, OrganizerEventsPage, OrganizerProfilePage, OrganizerRegistrationsPage } from './pages/OrganizerPages'
import { StudentAttendancePage, StudentDashboard, StudentPassPage, StudentPassportPage, StudentProfilePage, StudentRegistrationsPage } from './pages/StudentPages'
import { Link } from 'react-router-dom'
import './App.css'

function RoleGate({ role }) {
  const { user } = useApp()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />
  return <Outlet />
}

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash.slice(1)) : null
      if (target) {
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        const top = window.scrollY + target.getBoundingClientRect().top
        window.scrollTo({ top, behavior })
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hash, pathname])

  return null
}

function NotFoundPage() {
  return <main className="not-found-page"><span className="eyebrow"><span className="eyebrow-dot" /> PAGE NOT FOUND</span><h1>That route isn’t on the map.</h1><p>The page may have moved or no longer exists.</p><Link className="button button-primary" to="/">Back to home</Link></main>
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<RoleGate role="student" />}>
          <Route path="/student" element={<RoleLayout role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="passport" element={<StudentPassportPage />} />
            <Route path="registrations" element={<StudentRegistrationsPage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="pass/:eventId" element={<StudentPassPage />} />
          </Route>
        </Route>

        <Route element={<RoleGate role="organizer" />}>
          <Route path="/organizer" element={<RoleLayout role="organizer" />}>
            <Route index element={<OrganizerDashboard />} />
            <Route path="events" element={<OrganizerEventsPage />} />
            <Route path="events/new" element={<OrganizerEventFormPage />} />
            <Route path="events/:eventId/edit" element={<OrganizerEventFormPage />} />
            <Route path="registrations" element={<OrganizerRegistrationsPage />} />
            <Route path="attendance" element={<OrganizerAttendancePage />} />
            <Route path="profile" element={<OrganizerProfilePage />} />
          </Route>
        </Route>

        <Route element={<RoleGate role="admin" />}>
          <Route path="/admin" element={<RoleLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="clubs" element={<AdminClubsPage />} />
            <Route path="events" element={<AdminEventsPage />} />
          </Route>
        </Route>
      </Routes>
      <Toast />
    </>
  )
}

export default function App() {
  return <BrowserRouter><AppProvider><ScrollManager /><AppRoutes /></AppProvider></BrowserRouter>
}
