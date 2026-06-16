import { useRef, useState, useMemo } from 'react'
import { toPng } from 'html-to-image'
import { CARD } from '../data/content.js'

// ⚑ REVIEW ITEM 4 ~ the shareable keepsake.
// A small luminous card in the violet palette. The signature line is the hero,
// never the gap. Rendered as styled HTML to a PNG ~ no paid service.
// Primary action posts the image to the device's native share sheet (Instagram,
// X, Messages, …); download is the fallback where sharing files isn't supported.
export default function ShareCard({ signatureLine, lens, onClose }) {
  const cardRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')

  const sparkle = useMemo(
    () => CARD.sparkles[Math.floor(Math.random() * CARD.sparkles.length)],
    []
  )

  const render = async () => {
    // render at 2x for a crisp, feed-worthy image
    return toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
  }

  const triggerDownload = (dataUrl) => {
    const link = document.createElement('a')
    link.download = 'my-mirror-keepsake.png'
    link.href = dataUrl
    link.click()
  }

  const share = async () => {
    if (!cardRef.current) return
    setBusy(true)
    setNote('')
    try {
      const dataUrl = await render()
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'my-mirror-keepsake.png', { type: 'image/png' })

      // Native share sheet, if this device can share an image file.
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: CARD.shareText })
      } else {
        // No file sharing here (most desktops) ~ download instead.
        triggerDownload(dataUrl)
        setNote('Saved to your device ~ ready to post.')
      }
    } catch (err) {
      // A user cancelling the share sheet throws AbortError ~ that's not an error.
      if (err && err.name !== 'AbortError') {
        console.error('share failed', err)
        setNote('Couldn’t open sharing ~ try Download instead.')
      }
    } finally {
      setBusy(false)
    }
  }

  const download = async () => {
    if (!cardRef.current) return
    setBusy(true)
    setNote('')
    try {
      triggerDownload(await render())
    } catch (err) {
      console.error('card render failed', err)
      setNote('Something slipped ~ please try again.')
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

        <div className="card-actions">
          <button className="btn btn-primary" onClick={share} disabled={busy}>
            {busy ? 'preparing…' : CARD.shareButton}
          </button>
          <button className="btn-text" onClick={download} disabled={busy}>
            {CARD.downloadButton}
          </button>
          {note && <p className="card-note">{note}</p>}
        </div>
      </div>
    </div>
  )
}
