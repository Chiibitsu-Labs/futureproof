import { GAP_CUES, FRESHNESS, lensPhrase } from '../data/content.js'

export default function GapStep({ lens, cues, freshness, onChange, onNext, onBack }) {
  const checkedIds = new Set(cues.map((c) => c.id))

  const toggle = (cue) => {
    const next = checkedIds.has(cue.id)
      ? cues.filter((c) => c.id !== cue.id)
      : [...cues, { id: cue.id, tag: cue.tag, text: cue.text }]
    onChange({ cues: next })
  }

  const freshnessPrompt = FRESHNESS.prompt.replace('{lens}', lensPhrase(lens))

  return (
    <section className="screen screen-gap fade-in">
      <button className="btn-back" onClick={onBack}>
        ← back
      </button>

      <p className="part-tag">first ~ where the ground is moving</p>
      <h2 className="step-title">{GAP_CUES.title}</h2>
      <p className="step-subtitle">{GAP_CUES.subtitle}</p>

      <ul className="cue-list">
        {GAP_CUES.cues.map((cue, i) => {
          const on = checkedIds.has(cue.id)
          return (
            <li key={cue.id} style={{ '--i': i }}>
              <button
                type="button"
                className={`cue ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => toggle(cue)}
              >
                <span className="cue-mark" aria-hidden="true" />
                <span className="cue-text">{cue.text}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="field">
        <label className="field-label" htmlFor="freshness">
          {FRESHNESS.label}
        </label>
        <p className="field-prompt">{freshnessPrompt}</p>
        <textarea
          id="freshness"
          className="field-input"
          rows={2}
          placeholder={FRESHNESS.placeholder}
          value={freshness}
          onChange={(e) => onChange({ freshness: e.target.value })}
        />
      </div>

      <button className="btn btn-primary" onClick={onNext}>
        next ~ the part that’s yours
      </button>
    </section>
  )
}
