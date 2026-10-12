import { useEffect, useState } from 'react'
import { Link2, QrCode, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function ShowQr({ value, buttonLabel = 'Show QR Code', onCopy }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) return undefined
    const timeout = window.setTimeout(() => setIsCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [isCopied])

  async function copyLink() {
    if (!navigator.clipboard?.writeText) return
    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      onCopy?.()
    } catch {
      setIsCopied(false)
    }
  }

  return (
    <div className={`show-qr${isExpanded ? ' is-expanded' : ''}`}>
      {!isExpanded ? (
        <button className="show-qr-trigger" type="button" onClick={() => setIsExpanded(true)} aria-expanded="false">
          <QrCode aria-hidden="true" size={22} />
          <span>{buttonLabel}</span>
        </button>
      ) : (
        <div className="show-qr-expanded">
          <div className="show-qr-canvas" role="img" aria-label="Scannable event pass QR code">
            <QRCodeSVG value={value} size={190} level="H" includeMargin fgColor="#24132f" bgColor="#ffffff" />
          </div>
          <div className="show-qr-controls">
            <button className="show-qr-copy" type="button" onClick={copyLink}>
              <Link2 aria-hidden="true" size={17} />
              <span>{isCopied ? 'Copied link' : 'Copy link'}</span>
            </button>
            <button className="show-qr-close" type="button" aria-label="Close QR code" onClick={() => { setIsExpanded(false); setIsCopied(false) }}>
              <X aria-hidden="true" size={19} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
