const providers = [
  { id: 'google', label: 'Google' },
  { id: 'x', label: 'X' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'github', label: 'GitHub' },
]

function ProviderIcon({ provider }) {
  if (provider === 'google') {
    return (
      <svg className="social-auth-icon social-auth-icon-google" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.7-.4-4H24v7.6h11c-.5 2.5-1.9 4.6-4 6l6.5 5c3.8-3.5 6.1-8.6 6.1-14.6Z" />
        <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9L31 34.1c-1.8 1.2-4.1 1.9-7 1.9-5.3 0-9.8-3.6-11.4-8.4l-6.7 5.2C9.3 39.5 16 44 24 44Z" />
        <path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2l-6.7-5.2a20 20 0 0 0 0 17.6l6.7-5.2Z" />
        <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.8 29.5 4 24 4 16 4 9.3 8.5 5.9 15.2l6.7 5.2c1.6-4.9 6.1-8.5 11.4-8.5Z" />
      </svg>
    )
  }

  if (provider === 'x') {
    return (
      <svg className="social-auth-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M18.9 1.2h3.7l-8.1 9.2L24 22.8h-7.4l-5.8-7.6-6.7 7.6H.4l8.7-9.9L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.5h2L6.5 3.2H4.4l13.2 17.5Z" />
      </svg>
    )
  }

  if (provider === 'facebook') {
    return (
      <svg className="social-auth-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.3c0-3 1.8-4.7 4.5-4.7 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12H17l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12Z" />
      </svg>
    )
  }

  return (
    <svg className="social-auth-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.4-5.5-6.1 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.5 1.3a12 12 0 0 1 6.4 0c2.4-1.6 3.5-1.3 3.5-1.3.7 1.7.3 3 .1 3.3.8.9 1.2 2 1.2 3.4 0 4.7-2.9 5.8-5.6 6.1.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  )
}

export default function SocialAuthButtons({ onSelect }) {
  return (
    <section className="auth-social-options" aria-label="Social sign-in options">
      <div className="auth-social-divider"><span>or continue with</span></div>
      <div className="auth-social-buttons">
        {providers.map((provider) => (
          <button
            className={`social-auth-button social-auth-button-${provider.id}`}
            type="button"
            aria-label={`Continue with ${provider.label}`}
            title={`Continue with ${provider.label}`}
            key={provider.id}
            onClick={() => onSelect?.(provider.label)}
          >
            <ProviderIcon provider={provider.id} />
          </button>
        ))}
      </div>
    </section>
  )
}
