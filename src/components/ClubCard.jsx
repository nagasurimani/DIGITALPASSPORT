import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ieeeLogo from '../assets/ieee-logo.svg'
import ieteLogo from '../assets/iete-logo.jpg'

const logos = { ieee: ieeeLogo, iete: ieteLogo }

export default function ClubCard({ organization }) {
  const logo = logos[organization.id]

  return (
    <article className={`club-card club-${organization.color}`}>
      <div className="club-card-head">
        <span className={`club-icon${logo ? ' club-icon-logo' : ' club-icon-wordmark'}`} role="img" aria-label={`${organization.name} mark`}>
          {logo ? <img src={logo} alt="" /> : <span>{organization.acronym}</span>}
        </span>
        <span className="club-event-count">{organization.eventCount} events</span>
      </div>
      <p className="club-acronym">{organization.acronym}</p>
      <h3>{organization.motto}</h3>
      <p className="club-description">{organization.description}</p>
      <Link to={`/events?organization=${organization.id}`} className="club-link">
        View events <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </article>
  )
}
