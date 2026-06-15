import { useRef, useState, useMemo } from 'react'
import { toPng } from 'html-to-image'
import { CARD } from '../data/content.js'

// ⚑ REVIEW ITEM 4 ~ the shareable keepsake.
// A small luminous card in the violet palette. The signature line is the hero,
// never the gap. Rendered as styled HTML, downloaded as a PNG ~ no paid service.
export default function ShareCard({ signatureLine, lens, onClose }) {
  const cardRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const sparkle = useMemo(
    () => CARD.sparkles[Math.floor(Math.random() * CARD.sparkles.length)],
    []
  )

  const download = async () => {
    if (!cardRef.current) return
    setBusy(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        // render at 2x for a crisp, feed-worthy image
        pixelRatio: 2,
        cacheBust: true
      })
      const link = document.createElement('a')
      link.download = 'my-mirror-keepsake.png'
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('card render failed', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="card-modal" onClick={(e) => e.stopPropagation()}>
        <button className="card-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* The exact node that becomes the image. */}
        <div className="keepsake" ref={cardRef}>
          <div className="keepsake-glow" aria-hidden="true" />
          <div className="keepsake-inner">
            <p className="keepsake-top">{CARD.watermarkTop}</p>
            <p className="keepsake-prelude">{CARD.prelude}</p>

            <p className="keepsake-hero">
              {signatureLine ? `“${signatureLine}”` : '“The part of this that’s mine.”'}
            </p>

            <p className="keepsake-sparkle">{sparkle}</p>

            <div className="keepsake-footer">
              <span className="keepsake-brand">{CARD.footerBrand}</span>
              <span className="keepsake-ethos">{CARD.footerEthos}</span>
              <span className="keepsake-url">{CARD.footerUrl}</span>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={download} disabled={busy}>
          {busy ? 'painting your keepsake…' : CARD.downloadButton}
        </button>
      </div>
    </div>
  )
}
