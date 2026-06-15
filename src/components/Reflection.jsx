import { useState } from 'react'
import { RESULT } from '../data/content.js'
import ShareCard from './ShareCard.jsx'

// The gift, complete and on screen. Delivered in full before any ask.
// Signature is the hero; one inferred insight + its implication carry the rest.
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

      {/* One inferred insight + one practical implication. Concise on purpose. */}
      {r.insight && (
        <div className="reflection-block block-insight">
          <h3 className="reflection-heading">{r.insightTitle || 'What you might not be seeing'}</h3>
          <Lines text={r.insight} />
          {r.implication && <p className="implication">{r.implication}</p>}
        </div>
      )}

      {r.nextDecision && (
        <div className="reflection-block block-decision">
          <h3 className="reflection-heading">One next move ~ yours to finish</h3>
          <p className="next-decision">{r.nextDecision}</p>
        </div>
      )}

      {/* The next step ~ prominent, clearly the natural move. Still skippable. */}
      <a className="cta-card" href={RESULT.bridgeLink.href}>
        <span className="cta-kicker">{RESULT.bridgeKicker}</span>
        <span className="cta-body">{RESULT.bridge}</span>
        <span className="cta-action">{RESULT.bridgeLink.label}</span>
      </a>

      <div className="reflection-actions">
        <button className="btn btn-primary" onClick={() => setShowCard(true)}>
          {RESULT.shareButton}
        </button>
        <button className="btn btn-ghost" onClick={onContinue}>
          {RESULT.continueButton}
        </button>
        <button className="btn-text" onClick={onRestart}>
          {RESULT.startOverButton}
        </button>
      </div>

      {/* Disclaimers kept, but quiet ~ they must not compete with the result. */}
      <div className="disclaimers">
        <p>{boundary}</p>
        <p>{moreThanThis}</p>
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
