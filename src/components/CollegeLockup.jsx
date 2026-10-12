import collegeCrest from '../assets/college-crest-transparent.png'

export default function CollegeLockup({ className = '', children = 'Sir C. R. Reddy College of Engineering' }) {
  return (
    <span className={`college-lockup ${className}`.trim()}>
      <img src={collegeCrest} alt="" aria-hidden="true" />
      <span>{children}</span>
    </span>
  )
}
