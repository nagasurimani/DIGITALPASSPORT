import { useEffect } from 'react'
import { Check, CircleAlert, X } from 'lucide-react'
import { useApp } from '../context/useApp'

export default function Toast() {
  const { toast, setToast } = useApp()

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(timer)
  }, [toast, setToast])

  if (!toast) return null

  const Icon = toast.tone === 'error' ? CircleAlert : Check

  return (
    <div className={`toast toast-${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'} aria-live="polite">
      <Icon aria-hidden="true" size={18} />
      <span>{toast.message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)}>
        <X aria-hidden="true" size={16} />
      </button>
    </div>
  )
}
