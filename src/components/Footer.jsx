import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import CollegeLockup from './CollegeLockup'

export default function Footer() {
  return (
    <footer className="public-footer footer20" id="about">
      <div className="footer20-shell">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Link className="brand" to="/">
              <span className="brand-symbol"><ShieldCheck aria-hidden="true" size={20} /></span>
              <span className="brand-label">Digital <strong>Passport</strong></span>
            </Link>
            <p>One student identity. More ways to take part in campus life.</p>
            <Link className="footer-start-link" to="/register">Get your passport <ArrowUpRight aria-hidden="true" size={17} /></Link>
          </div>
          <nav className="footer-col" aria-label="Explore">
            <span>Explore</span>
            <Link to="/events">Upcoming events</Link>
            <Link to="/#organizations">Student organizations</Link>
            <Link to="/#event-types">Event types</Link>
          </nav>
          <nav className="footer-col" aria-label="Your passport">
            <span>Your passport</span>
            <Link to="/register">Create an account</Link>
            <Link to="/login">Sign in</Link>
            <Link to="/#faq">Frequently asked questions</Link>
          </nav>
          <div className="footer-col footer-col-note">
            <span>Built for campus</span>
            <CollegeLockup className="college-lockup-footer">Sir C. R. Reddy College of Engineering</CollegeLockup>
          </div>
        </div>
        <div className="footer20-wordmark" aria-hidden="true">Digital Passport</div>
        <div className="footer-bottom">
          <span>© 2026 Digital Tech Passport</span>
        </div>
      </div>
    </footer>
  )
}
