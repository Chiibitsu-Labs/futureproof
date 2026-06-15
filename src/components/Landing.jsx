import { LANDING, BRAND } from '../data/content.js'

export default function Landing({ onStart }) {
  return (
    <section className="screen screen-landing fade-in">
      <p className="eyebrow">{LANDING.eyebrow}</p>

      <div className="mirror-emblem" aria-hidden="true">
        <div className="mirror-emblem-glass" />
        <div className="mirror-emblem-ring" />
      </div>

      <h1 className="display-title">{LANDING.title}</h1>

      <div className="lede">
        {LANDING.lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <p className="subtle">{LANDING.subtle}</p>

      <button className="btn btn-primary" onClick={onStart}>
        {LANDING.startButton}
      </button>

      <p className="reassure">{LANDING.reassure}</p>

      <footer className="brand-footer">
        <span>{BRAND.lab}</span>
        <span className="dot">·</span>
        <span className="ethos">{BRAND.ethos}</span>
      </footer>
    </section>
  )
}
