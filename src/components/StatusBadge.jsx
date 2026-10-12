const statusTone = {
  Confirmed: 'success',
  Verified: 'success',
  Published: 'success',
  Open: 'success',
  Active: 'success',
  Present: 'success',
  Approved: 'success',
  Pending: 'warning',
  Draft: 'neutral',
  Invited: 'warning',
  Rejected: 'danger',
  Completed: 'info',
}

export default function StatusBadge({ children, tone }) {
  const color = tone ?? statusTone[children] ?? 'neutral'
  return <span className={`status-badge status-${color}`}>{children}</span>
}
