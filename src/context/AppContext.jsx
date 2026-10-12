import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext } from './AppState'
import {
  demoAdmin,
  demoOrganizer,
  demoStudent,
  initialRegistrations,
  mockEvents,
} from '../data/mockData'

function readStored(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function persist(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState(() => readStored('dtp-events', mockEvents))
  const [registrations, setRegistrations] = useState(() => readStored('dtp-registrations', initialRegistrations))
  const [approvalDecisions, setApprovalDecisions] = useState(() => readStored('dtp-approval-decisions', {}))
  const [leaderStatuses, setLeaderStatuses] = useState(() => readStored('dtp-leader-statuses', {}))
  const [attendance, setAttendance] = useState(() => readStored('dtp-attendance', {}))
  const [pendingApplication, setPendingApplication] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => { persist('dtp-events', events) }, [events])
  useEffect(() => { persist('dtp-registrations', registrations) }, [registrations])
  useEffect(() => { persist('dtp-approval-decisions', approvalDecisions) }, [approvalDecisions])
  useEffect(() => { persist('dtp-leader-statuses', leaderStatuses) }, [leaderStatuses])
  useEffect(() => { persist('dtp-attendance', attendance) }, [attendance])

  const notify = useCallback((message, tone = 'success') => {
    setToast({ message, tone, key: Date.now() })
  }, [])

  const loginAs = useCallback((role) => {
    const profiles = { student: demoStudent, organizer: demoOrganizer, admin: demoAdmin }
    setUser({ ...profiles[role], role })
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const registerForEvent = useCallback((eventId) => {
    const existing = registrations.find((registration) => registration.eventId === eventId)
    if (existing) return existing

    const registration = {
      id: `reg-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      eventId,
      status: 'Confirmed',
      attended: false,
      passCode: `PASS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    }
    setRegistrations((current) => [...current, registration])
    return registration
  }, [registrations])

  const addEvent = useCallback((event) => {
    setEvents((current) => [event, ...current])
    notify('Event saved.')
  }, [notify])

  const updateEvent = useCallback((eventId, updates) => {
    setEvents((current) => current.map((event) => event.id === eventId ? { ...event, ...updates } : event))
    notify('Event changes saved.')
  }, [notify])

  const setApproval = useCallback((studentId, status) => {
    setApprovalDecisions((current) => ({ ...current, [studentId]: status }))
    notify(`Application ${status.toLowerCase()}.`)
  }, [notify])

  const toggleLeaderStatus = useCallback((leaderId, currentStatus) => {
    const status = currentStatus === 'Active' ? 'Invited' : 'Active'
    setLeaderStatuses((current) => ({ ...current, [leaderId]: status }))
    notify(`Club leader status changed to ${status.toLowerCase()}.`)
  }, [notify])

  const markAttendance = useCallback((attendeeId, present) => {
    setAttendance((current) => ({ ...current, [attendeeId]: present }))
    notify(present ? 'Attendance marked present.' : 'Attendance mark removed.')
  }, [notify])

  const value = useMemo(() => ({
    user,
    events,
    registrations,
    approvalDecisions,
    leaderStatuses,
    attendance,
    pendingApplication,
    toast,
    setToast,
    setPendingApplication,
    loginAs,
    logout,
    notify,
    registerForEvent,
    addEvent,
    updateEvent,
    setApproval,
    toggleLeaderStatus,
    markAttendance,
  }), [
    user,
    events,
    registrations,
    approvalDecisions,
    leaderStatuses,
    attendance,
    pendingApplication,
    toast,
    loginAs,
    logout,
    notify,
    registerForEvent,
    addEvent,
    updateEvent,
    setApproval,
    toggleLeaderStatus,
    markAttendance,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

