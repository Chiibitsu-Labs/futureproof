import { CLOSE } from '../data/content.js'

export default function Close({ onRestart }) {
  return (
    <section className="screen screen-close fade-in">
      <div className="mirror-emblem mirror-emblem-soft" aria-hidden="true">
        <div className="mirror-emblem-glass" />
        <div className="mirror-emblem-ring" />
      </div>

      <div className="close-lines">
        {CLOSE.lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <p className="close-signoff">{CLOSE.signoff}</p>
      <p className="ethos close-ethos">{CLOSE.ethos}</p>

      <button className="btn btn-ghost" onClick={onRestart}>
        hold up the mirror again
      </button>
    </section>
  )
}
