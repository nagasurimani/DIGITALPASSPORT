import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="dashboard-page-heading">
      <div><span className="eyebrow"><span className="eyebrow-dot" /> {eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {action}
    </div>
  )
}

export function MetricCard({ label, value, detail, icon: Icon, tone = 'blue' }) {
  return (
    <article className="metric-card">
      <span className={`metric-icon metric-${tone}`}><Icon aria-hidden="true" size={19} /></span>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      <span className="metric-detail">{detail}</span>
    </article>
  )
}

export function EmptyState({ icon: Icon, title, description, action, to }) {
  return (
    <div className="empty-state">
      {Icon && <span className="empty-icon"><Icon aria-hidden="true" size={22} /></span>}
      <h2>{title}</h2>
      <p>{description}</p>
      {action && (to ? <Link className="button button-secondary" to={to}>{action}<ArrowRight aria-hidden="true" size={15} /></Link> : action)}
    </div>
  )
}
