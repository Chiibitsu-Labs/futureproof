import { LENS_INTRO, LENSES } from '../data/content.js'

export default function LensPicker({ selected, onPick, onBack }) {
  return (
    <section className="screen screen-lens fade-in">
      <button className="btn-back" onClick={onBack}>
        ← back
      </button>

      <h2 className="step-title">{LENS_INTRO.title}</h2>
      <p className="step-subtitle">
        {LENS_INTRO.subtitle.split('\n').map((l, i) => (
          <span key={i} className="soft-line">
            {l}
          </span>
        ))}
      </p>

      <div className="lens-grid">
        {LENSES.map((lens, i) => (
          <button
            key={lens.id}
            className={`lens-card ${selected === lens.id ? 'is-selected' : ''}`}
            style={{ '--i': i }}
            onClick={() => onPick(lens.id)}
          >
            <span className="lens-glyph" aria-hidden="true">
              {lens.glyph}
            </span>
            <span className="lens-label">{lens.label}</span>
            <span className="lens-hint">{lens.hint}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
