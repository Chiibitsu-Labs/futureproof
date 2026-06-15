import { useState } from 'react'
import { RESULT } from '../data/content.js'
import ShareCard from './ShareCard.jsx'

// The gift, complete and on screen. Delivered in full before any ask.
export default function Reflection({ lens, reflection, onContinue, onRestart }) {
  const [showCard, setShowCard] = useState(false)

  const r = reflection
  const boundary = r.boundary || RESULT.boundaryFallback
  const moreThanThis = r.moreThanThis || RESULT.moreThanThisFallback

  return (
    <section className="screen screen-reflection reveal">
      {r.opening && <p className="reflection-opening">{r.opening}</p>}

      {/* The signature is the hero ~ shown first and brightest. */}
      <div className="reflection-block block-signature">
        <h3 className="reflection-heading">{r.signatureTitle || 'What stays yours'}</h3>
        {r.signatureLine && <p className="signature-hero">“{r.signatureLine}”</p>}
        <Lines text={r.signatureBody} />
      </div>

      <div className="reflection-block block-gap">
        <h3 className="reflection-heading">{r.gapTitle || 'Where the ground is moving'}</h3>
        <Lines text={r.gapBody} />
      </div>

      {r.nextDecision && (
        <div className="reflection-block block-decision">
          <h3 className="reflection-heading">One next decision ~ yours to fill in</h3>
          <p className="next-decision">{r.nextDecision}</p>
        </div>
      )}

      <p className="boundary-line">{boundary}</p>
      <p className="more-than-this">{moreThanThis}</p>

      {/* Soft, skippable bridge to paid ~ never gates the result. */}
      <div className="bridge">
        <p>{RESULT.bridge}</p>
        <a className="bridge-link" href={RESULT.bridgeLink.href}>
          {RESULT.bridgeLink.label} →
        </a>
      </div>

      <div className="reflection-actions">
        <button className="btn btn-primary" onClick={() => setShowCard(true)}>
          {RESULT.shareButton}
        </button>
        <button className="btn btn-ghost" onClick={onContinue}>
          continue
        </button>
        <button className="btn-text" onClick={onRestart}>
          {RESULT.startOverButton}
        </button>
      </div>

      {showCard && (
        <ShareCard
          signatureLine={r.signatureLine}
          lens={lens}
          onClose={() => setShowCard(false)}
        />
      )}
    </section>
  )
}

// Render a multi-line string as one-idea-per-line, splitting on newlines.
function Lines({ text }) {
  if (!text) return null
  const lines = String(text).split(/\n+/).filter(Boolean)
  return (
    <div className="reflection-lines">
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  )
}
