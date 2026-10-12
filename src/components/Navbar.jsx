import { useState } from 'react'
import { ArrowRight, Menu, ShieldCheck, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'

const dashboards = {
  student: '/student',
  organizer: '/organizer',
  admin: '/admin',
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className="public-header">
        <Link className="brand" to="/" aria-label="Digital Tech Passport home" onClick={() => setOpen(false)}>
          <span className="brand-symbol"><ShieldCheck aria-hidden="true" size={20} /></span>
          <span className="brand-label">Digital Tech <strong>Passport</strong></span>
        </Link>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav className={`public-nav${open ? ' is-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/events" onClick={() => setOpen(false)}>Events</NavLink>
          <Link to="/#organizations" onClick={() => setOpen(false)}>Clubs</Link>
          <Link to="/#about" onClick={() => setOpen(false)}>About</Link>
          {user ? (
            <>
              <Link className="nav-login" to={dashboards[user.role]} onClick={() => setOpen(false)}>Dashboard</Link>
              <button className="nav-logout" type="button" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink className="nav-login" to="/login" onClick={() => setOpen(false)}>Login</NavLink>
              <Link className="button button-small" to="/register" onClick={() => setOpen(false)}>
                Get Started <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  )
}
