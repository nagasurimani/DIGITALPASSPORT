export function formatDate(dateValue, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-IN', options).format(new Date(dateValue))
}

export function formatDateTime(dateValue) {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateValue))
}

export function organizationName(organizations, organizationId) {
  return organizations.find((organization) => organization.id === organizationId)?.name ?? 'Campus event'
}
