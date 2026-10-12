import { BadgeCheck, Fingerprint, QrCode } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function PassportCard({ student, compact = false }) {
  return (
    <article className={`passport-visual${compact ? ' passport-compact' : ''}`} aria-label="Student digital passport">
      <div className="passport-visual-header">
        <span className="passport-visual-brand"><Fingerprint aria-hidden="true" size={20} /> DIGITAL TECH PASSPORT</span>
        <StatusBadge>{student.verificationStatus ?? 'Pending'}</StatusBadge>
      </div>
      <div className="passport-visual-main">
        <div className="student-avatar" aria-hidden="true">{student.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
        <div className="passport-student-info">
          <span>STUDENT PASSPORT</span>
          <h2>{student.name}</h2>
          <p>{student.branch} · Class of {student.graduationYear}</p>
        </div>
        {!compact && <div className="passport-qr-placeholder"><QrCode aria-hidden="true" size={76} strokeWidth={1.5} /></div>}
      </div>
      <div className="passport-visual-footer">
        <div><span>PASSPORT ID</span><strong>{student.passportId}</strong></div>
        <div><span>COLLEGE ROLL NUMBER</span><strong>{student.rollNumber}</strong></div>
        {compact && <BadgeCheck className="passport-verified-icon" aria-label="Verification status" size={22} />}
      </div>
    </article>
  )
}
