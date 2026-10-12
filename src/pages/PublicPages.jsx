import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Cpu, Fingerprint, MapPin, QrCode, Search, ShieldCheck, Trophy } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CollegeLockup from '../components/CollegeLockup'
import ClubCard from '../components/ClubCard'
import EventPass from '../components/EventPass'
import EventCard from '../components/EventCard'
import PassportCard from '../components/PassportCard'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/useApp'
import { demoStudent, mockEvents, organizations } from '../data/mockData'
import { formatDate } from '../utils/format'

const categories = ['Workshop', 'Hackathon', 'Seminar', 'Competition']

const eventTypes = [
  { category: 'Workshop', title: 'Workshops', description: 'Build practical skills in guided sessions.', code: 'WS' },
  { category: 'Hackathon', title: 'Hackathons', description: 'Team up to solve problems and build ideas.', code: 'HK' },
  { category: 'Seminar', title: 'Seminars', description: 'Learn from speakers and campus experts.', code: 'SM' },
  { category: 'Competition', title: 'Competitions', description: 'Put your skills and ideas to the test.', code: 'CP' },
]

const homeFaqCategories = [
  {
    id: 'eligibility',
    label: 'Eligibility',
    icon: Fingerprint,
    items: [
      { question: 'Who can apply for a student passport?', answer: 'Students of Sir C. R. Reddy College of Engineering can apply with their college details and roll number. Individual events may have additional eligibility rules, so check each event listing before registering.' },
      { question: 'Is a college email required to apply?', answer: 'The application asks for your name, roll number, branch, and graduation year. College email is optional.' },
    ],
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: ShieldCheck,
    items: [
      { question: 'How does student verification work?', answer: 'After you submit your application, a college administrator reviews your roll number. Your passport stays pending until it is approved.' },
      { question: 'Can I register while my passport is pending?', answer: 'Your passport must be approved before student access is enabled. Once verified, sign in and register for eligible campus events.' },
    ],
  },
  {
    id: 'registration',
    label: 'Registration',
    icon: CalendarDays,
    items: [
      { question: 'How do I register for an event?', answer: 'Browse upcoming events, review the event details and eligibility, then register while signed in with a student account. A confirmed registration gets its own event pass.' },
      { question: 'Can I see all my event registrations together?', answer: 'Open My Registrations from your student dashboard to review event registrations and open a pass for a confirmed event.' },
    ],
  },
  {
    id: 'passes',
    label: 'QR passes',
    icon: QrCode,
    items: [
      { question: 'Where can I find my event QR pass?', answer: 'Open My Registrations from your student dashboard and choose View Pass next to a confirmed event. Each event has a separate pass linked to that registration.' },
      { question: 'How do I use my QR pass?', answer: 'Present the pass for your confirmed event to the event team at check-in.' },
    ],
  },
]

const campusStories = [
  { title: 'One campus identity', detail: 'STUDENT PASSPORT', description: 'Keep your student identity and event registrations together in one place.', initials: 'ID' },
  { title: 'Clear event management', detail: 'ORGANIZER WORKSPACE', description: 'Publish campus events and keep attendee registrations organized.', initials: 'EV' },
  { title: 'Ready for check-in', detail: 'EVENT QR PASSES', description: 'Give each confirmed event registration its own pass for check-in.', initials: 'QR' },
]

const innovationShowcases = [
  {
    id: 'smart-campus-navigator',
    category: 'STUDENT PROJECT',
    title: 'Smart Campus Navigator',
    description: 'A wayfinding concept to help students discover classrooms, labs, clubs, and event spaces.',
    team: 'Campus Wayfinders',
    focus: 'CAMPUS LIFE',
    icon: MapPin,
    theme: 'violet',
  },
  {
    id: 'greenpulse',
    category: 'HACKATHON PROTOTYPE',
    title: 'GreenPulse',
    description: 'A prototype exploring how campus teams can share and track practical sustainability ideas.',
    team: 'Team GreenPulse',
    focus: 'SUSTAINABILITY',
    icon: Cpu,
    theme: 'teal',
  },
  {
    id: 'accessable-campus',
    category: 'WINNING TEAM',
    title: 'AccessAble Campus',
    description: 'A challenge-winning concept for making event spaces easier to navigate for everyone.',
    team: 'Team Spark',
    focus: 'CHALLENGE WINNER',
    icon: Trophy,
    theme: 'gold',
  },
]

export function HomePage() {
  const { events, registrations } = useApp()
  const [activeFaqCategory, setActiveFaqCategory] = useState(homeFaqCategories[0].id)
  const [openFaq, setOpenFaq] = useState('')
  const [activeEventStep, setActiveEventStep] = useState(0)
  const [eventCarouselMaxStartIndex, setEventCarouselMaxStartIndex] = useState(0)
  const eventCarouselRef = useRef(null)
  const upcomingEvents = [...events].sort((first, second) => new Date(first.startsAt) - new Date(second.startsAt))
  const getEventCarouselMetrics = () => {
    const track = eventCarouselRef.current
    const cards = track ? [...track.querySelectorAll('.event-carousel-card')] : []
    if (!track || !cards.length) return { track, cards, maxStartIndex: 0 }
    const trackStyle = window.getComputedStyle(track)
    const gap = Number.parseFloat(trackStyle.columnGap || trackStyle.gap) || 0
    const cardWidth = cards[0].getBoundingClientRect().width
    const visibleCards = Math.max(1, Math.floor((track.clientWidth + gap) / (cardWidth + gap)))
    return { track, cards, maxStartIndex: Math.max(0, cards.length - visibleCards) }
  }
  const activeEventStepIndex = Math.min(activeEventStep, eventCarouselMaxStartIndex)
  const activeEvent = upcomingEvents[activeEventStepIndex]
  const previewEvent = events.find((event) => event.id === 'arduino-embedded') ?? events[0] ?? mockEvents[0]
  const previewRegistration = registrations.find((registration) => registration.eventId === previewEvent.id)
    ?? { status: 'Confirmed', passCode: 'PASS-7K2M' }
  const previewOrganization = organizations.find((organization) => organization.id === previewEvent.organizationId)

  const changeEventStep = (index) => {
    const { track, cards, maxStartIndex } = getEventCarouselMetrics()
    if (!cards.length) return
    const nextIndex = Math.max(0, Math.min(index, maxStartIndex))
    setActiveEventStep(nextIndex)
    const card = cards[nextIndex]
    if (!track || !card) return
    const left = card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft
    track.scrollTo({ left, behavior: 'smooth' })
  }

  const updateActiveEventStep = () => {
    const { track, cards, maxStartIndex } = getEventCarouselMetrics()
    if (!track || !cards.length) return
    const trackLeft = track.getBoundingClientRect().left
    const nearestIndex = cards.reduce((nearest, card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - trackLeft)
      return distance < nearest.distance ? { index, distance } : nearest
    }, { index: 0, distance: Infinity }).index
    const visibleStartIndex = Math.min(nearestIndex, maxStartIndex)
    setActiveEventStep((current) => current === visibleStartIndex ? current : visibleStartIndex)
  }

  useEffect(() => {
    const updateCarouselPosition = () => {
      const { maxStartIndex } = getEventCarouselMetrics()
      setEventCarouselMaxStartIndex(maxStartIndex)
      setActiveEventStep((current) => Math.min(current, maxStartIndex))
    }
    updateCarouselPosition()
    window.addEventListener('resize', updateCarouselPosition)
    return () => window.removeEventListener('resize', updateCarouselPosition)
  }, [upcomingEvents.length])

  return (
    <main>
      <section className="home-hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <CollegeLockup className="college-lockup-hero">SIR C. R. REDDY COLLEGE OF ENGINEERING</CollegeLockup>
            <h1>ONE TECH PASSPORT<br /><span>FOR EVERY OPPORTUNITY.</span></h1>
            <p>Workshops, hackathons and technical events — all in one place. Find your next idea with IEEE, IETE and R&amp;D.</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/events">Explore Events <ArrowRight aria-hidden="true" size={17} /></Link>
              <Link className="button button-hero-secondary" to="/register">Create Account</Link>
            </div>
            <div className="hero-proof"><Check aria-hidden="true" size={15} /> One student ID. A campus full of possibilities.</div>
          </div>
          <div className="hero-passport-wrap">
            <div className="hero-passport-showcase">
              <div className="hero-passport-book" aria-label="Open student digital passport">
                <article className="hero-passport-page hero-passport-bio-page">
                  <div className="hero-passport-page-brand">
                    <Fingerprint aria-hidden="true" size={23} />
                    <span><strong>STUDENT DIGITAL PASSPORT</strong><small>SIR C. R. REDDY COLLEGE OF ENGINEERING</small></span>
                  </div>
                  <div className="hero-passport-identity">
                    <div className="hero-passport-photo" role="img" aria-label={`Student portrait for ${demoStudent.name}`}><span>STUDENT</span></div>
                    <div className="hero-passport-fields">
                      <span>NAME / NOM</span><strong>{demoStudent.name}</strong>
                      <span>PASSPORT NUMBER</span><strong>{demoStudent.passportId}</strong>
                      <span>COLLEGE ROLL NUMBER</span><strong>{demoStudent.rollNumber}</strong>
                    </div>
                  </div>
                  <div className="hero-passport-mrz" aria-label="Passport code">
                    <span>DTP&lt;{demoStudent.passportId.replaceAll('-', '')}&lt;SRCE&lt;&lt;&lt;</span>
                    <span>{demoStudent.rollNumber}&lt;&lt;{demoStudent.graduationYear}&lt;&lt;&lt;&lt;</span>
                  </div>
                </article>
                <article className="hero-passport-page hero-passport-record-page">
                  <div className="hero-passport-record-heading"><span>STUDENT RECORD</span><Fingerprint aria-hidden="true" size={18} /></div>
                  <h2>Campus identity</h2>
                  <div className="hero-passport-record-grid">
                    <div><span>INSTITUTION</span><strong>Sir C. R. Reddy College</strong></div>
                    <div><span>BRANCH</span><strong>{demoStudent.branch}</strong></div>
                    <div><span>CLASS OF</span><strong>{demoStudent.graduationYear}</strong></div>
                    <div><span>VERIFICATION</span><strong className="hero-passport-verified"><Check aria-hidden="true" size={13} />{demoStudent.verificationStatus}</strong></div>
                  </div>
                  <div className="hero-passport-seal"><Fingerprint aria-hidden="true" size={27} /><span>COLLEGE IDENTITY</span></div>
                  <small className="hero-passport-page-note">STUDENT PASSPORT · PAGE 02</small>
                </article>
              </div>
              <div className="hero-event-ticket">
                <div className="hero-event-ticket-info">
                  <span className="hero-event-ticket-label">EVENT ACCESS TICKET <i /> {previewRegistration.status}</span>
                  <strong>{previewEvent.title}</strong>
                  <span><CalendarDays aria-hidden="true" size={13} />{formatDate(previewEvent.startsAt, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span><MapPin aria-hidden="true" size={13} />{previewEvent.venue}</span>
                </div>
                <div className="hero-event-ticket-stub">
                  <QrCode aria-hidden="true" size={54} strokeWidth={1.5} />
                  <strong>{previewRegistration.passCode}</strong>
                  <small>PREVIEW CODE</small>
                </div>
              </div>
              <div className="hero-passport-extra">
                <span><small>STUDENT</small><strong>{demoStudent.name}</strong></span>
                <span><small>ID STATUS</small><strong>{demoStudent.verificationStatus}</strong></span>
                <span><small>CLASS OF</small><strong>{demoStudent.graduationYear}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="content-section featured-inner">
          <div className="featured-heading-row">
            <div><h2>MAKE YOUR NEXT MOVE.</h2><p>Find the next workshop, build session, or campus challenge worth joining.</p></div>
            <Link className="text-action" to="/events">See all events <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
          {upcomingEvents.length ? (
            <div className="event-carousel-shell">
              <div className="event-carousel-track" ref={eventCarouselRef} onScroll={updateActiveEventStep} role="region" aria-label="Campus events" aria-roledescription="carousel">
                {upcomingEvents.map((event) => {
                  const organization = organizations.find((item) => item.id === event.organizationId)
                  const registered = registrations.some((registration) => registration.eventId === event.id)
                  const isOpen = event.registrationStatus === 'Open'
                  return (
                    <article className="event-carousel-card" key={event.id}>
                      <Link className="event-carousel-image" to={`/events/${event.id}`} aria-label={`View ${event.title}`}>
                        <img src={event.imageUrl} alt="" loading="lazy" onError={(image) => { image.currentTarget.style.display = 'none' }} />
                      </Link>
                      <h3><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
                      <p className="event-carousel-category">{event.category} <span aria-hidden="true">|</span> {organization?.acronym ?? 'Campus'}</p>
                      <p className="event-carousel-date-label">Event starts on</p>
                      <p className="event-carousel-date">{formatDate(event.startsAt, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      {isOpen ? (
                        <Link className="event-carousel-button" to={`/events/${event.id}`}>
                          {registered ? 'View Event' : 'Register Now'}
                        </Link>
                      ) : (
                        <span className="event-carousel-button is-closed">{event.registrationStatus || 'Registration closed'}</span>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="featured-empty">
              <span className="eyebrow"><span className="eyebrow-dot" /> MORE CAMPUS MOMENTS AHEAD</span>
              <h3>New events are on the way.</h3>
              <p>Check back soon or browse the full event list.</p>
              <Link className="text-action" to="/events">Browse all events <ArrowRight aria-hidden="true" size={15} /></Link>
            </div>
          )}
          <div className="campus-step-pager" aria-label="Navigate campus event carousel">
            <div className="campus-stepper-label" aria-live="polite">{activeEvent?.title ?? 'Upcoming Events'}</div>
            <div className="campus-stepper-controls">
              <button className="campus-stepper-arrow" type="button" aria-label="Previous events" disabled={activeEventStepIndex === 0} onClick={() => changeEventStep(activeEventStepIndex - 1)}>
                <ChevronLeft aria-hidden="true" size={18} />
              </button>
              <div className="campus-stepper-track" role="group" aria-label="Choose an event">
                {upcomingEvents.slice(0, eventCarouselMaxStartIndex + 1).map((event, index) => {
                  const StepIcon = event.category === 'Workshop' ? CalendarDays : event.category === 'Hackathon' ? Fingerprint : event.category === 'Seminar' ? ShieldCheck : QrCode
                  const isActive = index === activeEventStepIndex
                  return (
                    <button
                      className={`campus-stepper-item${isActive ? ' is-active' : ''}`}
                      type="button"
                      key={event.id}
                      aria-label={`Show events starting with ${event.title}`}
                      aria-pressed={isActive}
                      onClick={() => changeEventStep(index)}
                    >
                      {isActive ? <StepIcon aria-hidden="true" size={20} /> : <span className="campus-stepper-dot" aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
              <button className="campus-stepper-arrow" type="button" aria-label="Next events" disabled={activeEventStepIndex >= eventCarouselMaxStartIndex} onClick={() => changeEventStep(activeEventStepIndex + 1)}>
                <ChevronRight aria-hidden="true" size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section organizations-section" id="organizations">
        <div className="section-heading-row">
          <div><h2>OUR TOP ORGANIZATIONS</h2></div>
          <Link className="text-action" to="/events">Browse every event <ArrowRight aria-hidden="true" size={16} /></Link>
        </div>
        <div className="club-grid">{organizations.map((organization) => <ClubCard key={organization.id} organization={organization} />)}</div>
      </section>

      <section className="event-types-section content-section" id="event-types">
        <div className="section-heading-row">
          <div><h2>EXPLORE EVENT TYPES</h2></div>
          <Link className="text-action" to="/events">Browse all events <ArrowRight aria-hidden="true" size={16} /></Link>
        </div>
        <div className="event-types-grid">
          {eventTypes.map((eventType) => (
            <Link className="event-type-card" key={eventType.category} to={`/events?category=${encodeURIComponent(eventType.category)}`}>
              <span className="event-type-code" aria-hidden="true">{eventType.code}</span>
              <span className="event-type-copy"><strong>{eventType.title}</strong><small>{eventType.description}</small></span>
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className="innovation-section" id="innovation-showcase">
        <div className="content-section">
          <div className="innovation-heading">
            <span className="eyebrow"><span className="eyebrow-dot" /> BUILT ON CAMPUS</span>
            <h2>INNOVATION SHOWCASE</h2>
            <p>Student-built projects, hackathon prototypes, and the teams bringing new ideas to life.</p>
          </div>
          <div className="innovation-grid">
            {innovationShowcases.map((project) => {
              const ProjectIcon = project.icon
              return (
                <article className="innovation-card" key={project.id}>
                  <div className={`innovation-art innovation-art-${project.theme}`} aria-hidden="true">
                    <span className="innovation-art-orbit" />
                    <span className="innovation-art-code">{project.focus}</span>
                    <span className="innovation-art-icon"><ProjectIcon size={32} strokeWidth={1.7} /></span>
                    <span className="innovation-art-spark">✦</span>
                  </div>
                  <div className="innovation-card-copy">
                    <span className="innovation-category">{project.category}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="innovation-team">
                      <span className="innovation-team-avatar" aria-hidden="true">{project.team.slice(0, 1)}</span>
                      <span><small>BUILT BY</small><strong>{project.team}</strong></span>
                      <span className="innovation-sample-tag">FEATURED</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="innovation-footer">
            <Link className="text-action" to="/events?category=Hackathon">Find your next build event <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="organizer-spotlight">
        <div className="content-section organizer-spotlight-inner">
          <div className="organizer-spotlight-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> FOR EVENT ORGANIZERS</span>
            <h2>Bring your next campus event to the spotlight.</h2>
            <p>Create an event listing, reach students across campus, and manage registrations and check-ins from one organizer workspace.</p>
            <Link className="button organizer-cta" to="/login?role=organizer">Open organizer workspace <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
          <div className="organizer-benefit-list" aria-label="Organizer workspace features">
            <div><span>01</span><strong>Publish workshops, hackathons, and campus events</strong></div>
            <div><span>02</span><strong>Keep registrations and attendee details together</strong></div>
            <div><span>03</span><strong>Track event check-ins in your workspace</strong></div>
          </div>
        </div>
      </section>

      <section className="home-process content-section">
        <div className="process-intro">
          <span className="eyebrow"><span className="eyebrow-dot" /> SIMPLE FROM SIGN-UP TO CHECK-IN</span>
          <h2>Your passport moves with your ideas.</h2>
          <p>Register once, discover what’s happening, then use an event-specific pass at the venue.</p>
          <Link className="button button-primary" to="/register">Get your passport <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
        <div className="process-steps">
          <div><span>01</span><strong>Create your passport</strong><p>Connect your college roll number.</p></div>
          <div><span>02</span><strong>Choose an event</strong><p>Find workshops and competitions.</p></div>
          <div><span>03</span><strong>Show your event pass</strong><p>Check in with the organizer.</p></div>
        </div>
      </section>

      <section className="passport-preview-section">
        <div className="content-section">
          <div className="passport-preview-heading">
            <div>
              <span className="eyebrow"><span className="eyebrow-dot" /> YOUR DIGITAL PASSPORT</span>
              <h2>One student ID. A pass for every event.</h2>
              <p>Your campus identity stays with you, while every event registration gets its own check-in pass.</p>
            </div>
            <span className="prototype-pill">DIGITAL ID</span>
          </div>
          <div className="passport-preview-grid">
            <div className="passport-preview-sample">
              <div className="passport-preview-label"><span><Fingerprint aria-hidden="true" size={18} /></span><div><strong>Student passport</strong><small>Your reusable campus ID</small></div></div>
              <PassportCard student={demoStudent} />
            </div>
            <div className="passport-preview-sample">
              <div className="passport-preview-label"><span><QrCode aria-hidden="true" size={18} /></span><div><strong>Event QR pass</strong><small>Issued for a confirmed registration</small></div></div>
              <EventPass
                event={{ ...previewEvent, organizationName: previewOrganization?.name ?? 'Campus Event' }}
                student={demoStudent}
                registration={previewRegistration}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="content-section" id="faq">
          <div className="faq-heading">
            <span className="eyebrow"><span className="eyebrow-dot" /> PASSPORT HELP DESK</span>
            <h2>Frequently asked questions</h2>
            <p>How student eligibility, verification, event registration, and passes work.</p>
          </div>
          <div className="faq-tabs" aria-label="Frequently asked question topics">
            {homeFaqCategories.map((category) => {
              const CategoryIcon = category.icon
              const isActive = activeFaqCategory === category.id
              return (
                <button
                  className={`faq-tab${isActive ? ' is-active' : ''}`}
                  id={`faq-tab-${category.id}`}
                  type="button"
                  aria-pressed={isActive}
                  key={category.id}
                  onClick={() => { setActiveFaqCategory(category.id); setOpenFaq('') }}
                >
                  <CategoryIcon aria-hidden="true" size={15} />{category.label}
                </button>
              )
            })}
          </div>
          <div className="faq-accordion" aria-label={`${homeFaqCategories.find((category) => category.id === activeFaqCategory)?.label} questions`}>
            {homeFaqCategories.find((category) => category.id === activeFaqCategory)?.items.map((item) => {
              const isOpen = openFaq === item.question
              return (
                <article className={`faq-item${isOpen ? ' is-open' : ''}`} key={item.question}>
                  <button className="faq-question" type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? '' : item.question)}>
                    <span>{item.question}</span><span className="faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <p>{item.answer}</p>}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="content-section testimonials-inner">
          <div className="testimonials-intro">
            <span className="eyebrow"><span className="eyebrow-dot" /> A CONNECTED CAMPUS</span>
            <h2>Made for the moments that move you forward.</h2>
            <p>Discover opportunities, manage registrations, and get ready to show up.</p>
          </div>
          <div className="testimonials-rail" aria-label="Digital passport features">
            {campusStories.map((story) => (
              <article className="testimonial-card" key={story.initials}>
                <div className="testimonial-person">
                  <span className="testimonial-avatar" aria-hidden="true">{story.initials}</span>
                  <span><strong>{story.title}</strong><small>{story.detail}</small></span>
                </div>
                <p>{story.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stat-section" aria-label="Campus platform metrics">
        <div className="stat-heading"><span>THE CAMPUS, CONNECTED</span></div>
        <div className="stat-grid">
          <article className="stat-card stat-card-violet"><span className="stat-card-icon"><CalendarDays aria-hidden="true" size={17} /></span><span className="stat-card-label">EVENT LISTINGS</span><strong>{String(events.length).padStart(2, '0')}</strong><span className="stat-card-caption">Ready to explore</span><p>Find workshops, hackathons, and other campus opportunities.</p></article>
          <article className="stat-card stat-card-pink"><span className="stat-card-icon"><Fingerprint aria-hidden="true" size={17} /></span><span className="stat-card-label">ORGANIZATIONS</span><strong>{String(organizations.length).padStart(2, '0')}</strong><span className="stat-card-caption">Communities to discover</span><p>Meet the student groups behind the campus events.</p></article>
          <article className="stat-card stat-card-blue"><span className="stat-card-icon"><QrCode aria-hidden="true" size={17} /></span><span className="stat-card-label">A PASS FOR EACH EVENT</span><strong>1:1</strong><span className="stat-card-caption">Passport to event pass</span><p>Use one student identity to keep individual registrations together.</p></article>
        </div>
      </section>
    </main>
  )
}

export function EventsPage() {
  const { events, registrations } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [organization, setOrganization] = useState(searchParams.get('organization') ?? 'all')
  const [category, setCategory] = useState(searchParams.get('category') ?? 'all')
  const [sort, setSort] = useState('soonest')

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return events
      .filter((event) => event.registrationStatus === 'Open')
      .filter((event) => {
        const org = organizations.find((item) => item.id === event.organizationId)
        const matchesQuery = !normalizedQuery || `${event.title} ${event.summary} ${org?.name}`.toLowerCase().includes(normalizedQuery)
        return matchesQuery
          && (organization === 'all' || event.organizationId === organization)
          && (category === 'all' || event.category === category)
      })
      .sort((first, second) => sort === 'latest'
        ? new Date(second.startsAt) - new Date(first.startsAt)
        : new Date(first.startsAt) - new Date(second.startsAt))
  }, [category, events, organization, query, sort])

  function updateFilter(setter, value, key) {
    setter(value)
    const next = new URLSearchParams(searchParams)
    if (value === 'all' || value === '') next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  function clearFilters() {
    setQuery('')
    setOrganization('all')
    setCategory('all')
    setSort('soonest')
    setSearchParams({}, { replace: true })
  }

  return (
    <main className="events-page page-width">
      <div className="page-title-row">
        <div><CollegeLockup className="college-lockup-page">SIR C. R. REDDY COLLEGE OF ENGINEERING</CollegeLockup><h1>Upcoming Events</h1><p>Find your next workshop, hackathon, seminar, or competition.</p></div>
        <span className="prototype-pill">CAMPUS EVENTS</span>
      </div>
      <div className="event-filters" role="search">
        <label className="search-field"><Search aria-hidden="true" size={18} /><span className="sr-only">Search events</span><input type="search" value={query} onChange={(event) => updateFilter(setQuery, event.target.value, 'q')} placeholder="Search events, topics, clubs..." /></label>
        <label><span className="sr-only">Organization</span><select value={organization} onChange={(event) => updateFilter(setOrganization, event.target.value, 'organization')}><option value="all">All organizations</option>{organizations.map((item) => <option key={item.id} value={item.id}>{item.acronym}</option>)}</select></label>
        <label><span className="sr-only">Category</span><select value={category} onChange={(event) => updateFilter(setCategory, event.target.value, 'category')}><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span className="sr-only">Sort events</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="soonest">Soonest first</option><option value="latest">Latest first</option></select></label>
      </div>
      <div className="results-line"><span>{filteredEvents.length} events</span></div>
      {filteredEvents.length ? (
        <div className="event-grid">{filteredEvents.map((event) => <EventCard key={event.id} event={event} registrations={registrations} />)}</div>
      ) : (
        <div className="empty-state"><Search aria-hidden="true" size={25} /><h2>No events match those filters</h2><p>Try another search or reset your organization and category.</p><button className="button button-secondary" type="button" onClick={clearFilters}>Clear filters</button></div>
      )}
    </main>
  )
}

export function EventDetailsPage() {
  const { eventId } = useParams()
  const { events, registrations, user, registerForEvent, notify } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [registeredNow, setRegisteredNow] = useState(false)
  const event = events.find((item) => item.id === eventId)
  const organization = event && organizations.find((item) => item.id === event.organizationId)
  const registration = registrations.find((item) => item.eventId === eventId)

  if (!event) {
    return <main className="page-width not-found"><h1>Event not found</h1><p>Check the address or browse upcoming campus events.</p><Link className="button button-primary" to="/events">Browse events</Link></main>
  }

  function handleRegister() {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    if (user.role !== 'student') {
      notify('Sign in as a student to register for an event.', 'error')
      return
    }
    if (!registration) {
      registerForEvent(event.id)
      setRegisteredNow(true)
      notify('Registration confirmed.')
    }
  }

  return (
    <main className="event-detail-page">
      <section className="event-detail-hero">
        <div className="event-detail-hero-inner page-width">
          <div className="event-detail-copy">
            <Link className="back-link" to="/events"><ArrowLeft aria-hidden="true" size={16} /> Back to events</Link>
            <div className="event-title-meta"><StatusBadge tone="info">{event.category}</StatusBadge><span>{organization?.name}</span></div>
            <h1>{event.title}</h1>
            <p className="event-detail-summary">{event.summary}</p>

            <div className="event-quick-facts">
              <div><CalendarDays aria-hidden="true" /><span><small>EVENT DATE</small><strong>{formatDate(event.startsAt, { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span></div>
              <div><Clock3 aria-hidden="true" /><span><small>START TIME</small><strong>{new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(event.startsAt))}</strong></span></div>
              <div><MapPin aria-hidden="true" /><span><small>VENUE</small><strong>{event.venue}</strong></span></div>
            </div>

            <section className="event-domains" aria-labelledby="event-domains-title">
              <div className="event-domains-heading"><h2 id="event-domains-title">WHAT YOU'LL EXPLORE</h2><span>{event.takeaways.length} Tracks</span></div>
              <ul>{event.takeaways.map((item) => <li key={item}><span aria-hidden="true" />{item}</li>)}</ul>
            </section>

            <div className="event-detail-actions">
              {registration ? (
                <Link className="button button-primary" to={`/student/pass/${event.id}`}>View event pass <ArrowRight aria-hidden="true" size={16} /></Link>
              ) : (
                <button className="button button-primary" type="button" onClick={handleRegister} disabled={event.registrationStatus !== 'Open'}>
                  {event.registrationStatus === 'Open' ? 'Register for Event' : 'Registration closed'} <ArrowRight aria-hidden="true" size={16} />
                </button>
              )}
              <a className="event-art-link" href={event.imageUrl} target="_blank" rel="noreferrer">View event artwork</a>
            </div>
            {registeredNow && <p className="inline-success"><Check aria-hidden="true" size={15} />You’re registered. Your event pass is ready.</p>}
          </div>

          <figure className="event-poster-card">
            <img src={event.imageUrl} alt={`${event.title} event artwork`} onError={(image) => { image.currentTarget.style.display = 'none' }} />
            <figcaption><span>EVENT PREVIEW</span><strong>{event.title}</strong></figcaption>
          </figure>
        </div>
      </section>

      <div className="event-detail-sections page-width">
        <div className="event-detail-columns">
          <div className="event-detail-main-column">
            <section className="event-about-section">
              <span className="eyebrow"><span className="eyebrow-dot" /> ABOUT THIS EVENT</span>
              <h2>Bring your curiosity. Leave with something new.</h2>
              <p>{event.description}</p>
            </section>
            <section className="event-info-card">
              <span className="eyebrow"><span className="eyebrow-dot" /> BEFORE YOU JOIN</span>
              <h2>Eligibility & participation</h2>
              <p>{event.eligibility}</p>
            </section>
          </div>
          <section className="event-entry-card">
            <span className="eyebrow"><span className="eyebrow-dot" /> ENTRY DETAILS</span>
            <h2>Save your spot</h2>
            <div className="event-entry-stats">
              <div><strong>{event.availableSeats}</strong><span>SEATS LEFT</span></div>
              <div><strong>{event.capacity}</strong><span>TOTAL CAPACITY</span></div>
              <div><strong>{event.category}</strong><span>EVENT TYPE</span></div>
            </div>
            <p>Organized by {organization?.name}</p>
            <CollegeLockup className="college-lockup-detail">Sir C. R. Reddy College of Engineering</CollegeLockup>
            {registration ? (
              <Link className="button button-primary button-wide" to={`/student/pass/${event.id}`}>View event pass <ArrowRight aria-hidden="true" size={16} /></Link>
            ) : (
              <button className="button button-primary button-wide" type="button" onClick={handleRegister} disabled={event.registrationStatus !== 'Open'}>
                {event.registrationStatus === 'Open' ? 'Register for Event' : 'Registration closed'} <ArrowRight aria-hidden="true" size={16} />
              </button>
            )}
          </section>
        </div>
        <div className="event-coordinator-grid" aria-label="Event coordinator information">
          <article className="event-coordinator-card">
            <span className="event-coordinator-icon"><ShieldCheck aria-hidden="true" size={19} /></span>
            <div>
              <span className="eyebrow"><span className="eyebrow-dot" /> FACULTY COORDINATOR</span>
              <h2>Faculty coordinator details</h2>
              <p>Academic guidance and event oversight from the {organization?.name ?? 'organizing team'}.</p>
              <small>Coordinator contact details will be shared soon.</small>
            </div>
          </article>
          <article className="event-coordinator-card">
            <span className="event-coordinator-icon"><Fingerprint aria-hidden="true" size={19} /></span>
            <div>
              <span className="eyebrow"><span className="eyebrow-dot" /> STUDENT COORDINATOR</span>
              <h2>Student coordinator details</h2>
              <p>Registration guidance and event-day help from the {organization?.name ?? 'organizing team'}.</p>
              <small>Coordinator contact details will be shared soon.</small>
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}
