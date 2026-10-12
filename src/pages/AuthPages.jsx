import { useState } from 'react'
import { ArrowRight, CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import CollegeLockup from '../components/CollegeLockup'
import SocialAuthButtons from '../components/SocialAuthButtons'
import { useApp } from '../context/useApp'

export function LoginPage() {
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(() => searchParams.get('role') === 'organizer' ? 'organizer' : 'student')
  const [error, setError] = useState('')
  const { loginAs, notify } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (!form.get('identity') || !form.get('password')) {
      setError('Enter your email or college roll number and password to continue.')
      return
    }
    loginAs(role)
    notify(`Signed in to the ${role} workspace.`)
    navigate(redirectTo || `/${role === 'student' ? 'student' : role}`, { replace: true })
  }

  return (
    <main className="auth-page page-width">
      <section className="auth-story"><CollegeLockup className="college-lockup-auth">SIR C. R. REDDY COLLEGE OF ENGINEERING</CollegeLockup><h1>Good ideas<br />start by showing up.</h1><p>One student passport for every technical opportunity on campus.</p><span className="auth-story-mark"><ShieldCheck aria-hidden="true" size={26} /> STUDENT PASSPORT ACCESS</span></section>
      <section className="auth-panel auth-card-shell"><div className="auth-card-content">
        <Link to="/" className="back-link back-link-icon" aria-label="Back to home" title="Back to home"><ChevronLeft aria-hidden="true" size={19} /></Link>
        <span className="eyebrow"><span className="eyebrow-dot" /> WELCOME BACK</span>
        <h2>Sign in to your workspace</h2>
        <p className="auth-description">Sign in to your student, club, or administrator workspace.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>Workspace role<select value={role} onChange={(event) => setRole(event.target.value)}><option value="student">Student</option><option value="organizer">Club organizer · IEEE</option><option value="admin">College administrator</option></select></label>
          <label>Email or college roll number<input name="identity" type="text" autoComplete="username" placeholder="e.g. 22CSE042" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary button-wide" type="submit">Sign in <ArrowRight aria-hidden="true" size={17} /></button>
        </form>
        <SocialAuthButtons onSelect={(provider) => notify(`${provider} sign-in is unavailable right now.`, 'info')} />
        <p className="auth-switch">New to the passport? <Link to="/register">Create an account</Link></p>
      </div></section>
    </main>
  )
}

const branches = ['Computer Science & Engineering', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering', 'Other']

export function RegisterPage() {
  const [error, setError] = useState('')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const { pendingApplication, setPendingApplication, notify } = useApp()
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = form.get('password')
    const confirmPassword = form.get('confirmPassword')
    if (password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }
    const { confirmPassword: ignoredConfirmation, password: ignoredPassword, ...application } = Object.fromEntries(form.entries())
    void ignoredConfirmation
    void ignoredPassword
    setError('')
    setSubmitStatus('loading')
    window.setTimeout(() => setSubmitStatus('success'), 500)
    window.setTimeout(() => {
      setSubmitStatus('saved')
      setPendingApplication({ ...application, status: 'Pending verification' })
      notify('Application submitted for review.', 'info')
    }, 1000)
  }

  if (pendingApplication?.status === 'Pending verification') {
    return (
      <main className="auth-page verification-page page-width">
        <section className="verification-panel">
          <span className="verification-icon"><CheckCircle2 aria-hidden="true" size={32} /></span>
          <span className="eyebrow"><span className="eyebrow-dot" /> APPLICATION RECEIVED</span>
          <h1>Verification is still pending.</h1>
          <p>Your roll number must be reviewed by a college administrator before your passport is activated. You are not verified or signed in yet.</p>
          <div className="verification-summary"><span>Applicant</span><strong>{pendingApplication.fullName}</strong><span>Roll number</span><strong>{pendingApplication.rollNumber}</strong><span>Status</span><strong>Pending college review</strong></div>
          <button className="button button-primary" type="button" onClick={() => navigate('/login')}>Return to sign in <ArrowRight aria-hidden="true" size={16} /></button>
        </section>
      </main>
    )
  }

  return (
    <main className="register-page page-width">
      <section className="form-panel auth-card-shell"><div className="auth-card-content"><Link to="/" className="back-link back-link-icon" aria-label="Back to home" title="Back to home"><ChevronLeft aria-hidden="true" size={19} /></Link><span className="eyebrow"><span className="eyebrow-dot" /> CREATE YOUR ACCOUNT</span><h2>Create your student passport</h2><p className="auth-description">Fields marked with * are required.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field-span-2">Full name *<input name="fullName" autoComplete="name" required /></label>
          <label>College roll number *<input name="rollNumber" autoComplete="off" placeholder="e.g. 24CSE018" required /></label>
          <label>Branch *<select name="branch" required defaultValue=""><option value="" disabled>Select branch</option>{branches.map((branch) => <option key={branch}>{branch}</option>)}</select></label>
          <label>Graduation year *<select name="graduationYear" required defaultValue=""><option value="" disabled>Select year</option>{[2026, 2027, 2028, 2029, 2030].map((year) => <option key={year}>{year}</option>)}</select></label>
          <label>College email (optional)<input name="email" type="email" autoComplete="email" placeholder="name@college.edu" /></label>
          <label>Password *<input name="password" type="password" autoComplete="new-password" minLength="8" required /></label>
          <label>Confirm password *<input name="confirmPassword" type="password" autoComplete="new-password" minLength="8" required /></label>
          {error && <p className="form-error field-span-2" role="alert">{error}</p>}
          <button className={`account-submit-button field-span-2${submitStatus === 'loading' || submitStatus === 'success' ? ' is-working' : ''}${submitStatus === 'saved' ? ' is-saved' : ''}`} type="submit" disabled={submitStatus !== 'idle'}>
            {submitStatus === 'idle' && <><span>Submit for verification</span><ArrowRight aria-hidden="true" size={17} /></>}
            {submitStatus === 'loading' && <span className="account-submit-spinner" aria-hidden="true" />}
            {submitStatus === 'success' && <CheckCircle2 aria-hidden="true" size={23} />}
            {submitStatus === 'saved' && <><CheckCircle2 aria-hidden="true" size={17} /><span>Submitted</span></>}
            <span className="sr-only" role="status">{submitStatus === 'loading' ? 'Submitting application' : submitStatus === 'success' ? 'Application submitted' : submitStatus === 'saved' ? 'Application received' : ''}</span>
          </button>
        </form>
        <SocialAuthButtons onSelect={(provider) => notify(`${provider} sign-in is unavailable right now.`, 'info')} />
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div></section>
    </main>
  )
}
