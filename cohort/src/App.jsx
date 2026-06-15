import { useEffect } from 'react'
import {
  hero,
  problem,
  reframe,
  whatItIs,
  forWhom,
  proof,
  founder,
  pilot,
  finalCta,
  footer,
  apply,
} from './content'

// CTA buttons scroll to the embedded Tally form in the apply section.
function scrollToApply(e) {
  e.preventDefault()
  document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
}

function CTAButton({ children, className = '' }) {
  return (
    <a href="#apply" onClick={scrollToApply} className={`btn ${className}`}>
      {children}
    </a>
  )
}

// Decorative hand-drawn stars / sparkles, scattered. Purely visual.
function Sparkle({ className = '' }) {
  return (
    <svg className={`sparkle ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c.7 6.3 4.9 10.5 11.3 12C16.9 13.5 12.7 17.7 12 24c-.7-6.3-4.9-10.5-11.3-12C7.1 10.5 11.3 6.3 12 0Z" />
    </svg>
  )
}

function Hero() {
  return (
    <header className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <Sparkle className="s1" />
      <Sparkle className="s2" />
      <Sparkle className="s3" />
      <div className="container hero-inner">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 className="hero-title">
          {hero.titleLines.map((l) => (
            <span key={l} className="hero-title-line">
              {l}
            </span>
          ))}
          <span className="hero-title-accent">{hero.titleAccent}</span>
        </h1>
        <div className="hero-sub">
          {hero.sub.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <div className="hero-actions">
          <CTAButton className="btn-primary btn-lg">{hero.ctaLabel}</CTAButton>
          <p className="arrival-note">{hero.arrivalNote}</p>
        </div>
      </div>
      <div className="wave-divider" aria-hidden="true" />
    </header>
  )
}

function Section({ id, kicker, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">
        {kicker && <p className="kicker">{kicker}</p>}
        {children}
      </div>
    </section>
  )
}

function Problem() {
  return (
    <Section id="problem" kicker={problem.kicker} className="section-problem">
      <h2 className="section-title">{problem.title}</h2>
      <div className="stack-lines">
        {problem.lines.map((l) => (
          <p key={l} className="stack-line">
            {l}
          </p>
        ))}
      </div>
    </Section>
  )
}

function Reframe() {
  return (
    <Section id="reframe" kicker={reframe.kicker} className="section-reframe">
      <h2 className="section-title">{reframe.title}</h2>

      <div className="ai-frame">
        <p className="ai-can">{reframe.aiFrame.can}</p>
        <p className="ai-cant">{reframe.aiFrame.cant}</p>
        <p className="ai-label">{reframe.aiFrame.label}</p>
      </div>

      <div className="stack-lines stack-center">
        {reframe.lines.map((l) => (
          <p key={l} className="stack-line">
            {l}
          </p>
        ))}
      </div>
    </Section>
  )
}

function WhatItIs() {
  return (
    <Section id="what" kicker={whatItIs.kicker} className="section-what">
      <h2 className="section-title">{whatItIs.title}</h2>

      <div className="meta-row">
        {whatItIs.meta.map((m) => (
          <span key={m} className="chip">
            {m}
          </span>
        ))}
      </div>

      <ol className="steps">
        {whatItIs.steps.map((s, i) => (
          <li key={s} className="step">
            <span className="step-num">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <div className="arc">
        {whatItIs.arc.map((phase) => (
          <div key={phase.title} className="arc-card">
            <span className="arc-tag">{phase.tag}</span>
            <h3 className="arc-title">{phase.title}</h3>
            <p className="arc-body">{phase.body}</p>
          </div>
        ))}
      </div>

      <p className="footnote">{whatItIs.footnote}</p>
    </Section>
  )
}

function ForWhom() {
  return (
    <Section id="for-whom" kicker={forWhom.kicker} className="section-forwhom">
      <div className="forwhom-grid">
        <div className="forwhom-card forwhom-yes">
          <h3 className="forwhom-title">💜 {forWhom.forTitle}</h3>
          <ul>
            {forWhom.forList.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="forwhom-card forwhom-no">
          <h3 className="forwhom-title">🚪 {forWhom.notTitle}</h3>
          <ul>
            {forWhom.notList.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

function Proof() {
  // Only render filled slots. Until you add real testimonials, this shows
  // clearly-marked placeholder cards (never fake quotes).
  const filled = proof.slots.filter((s) => s.quote && s.quote.trim())
  const showPlaceholders = filled.length === 0
  const slots = showPlaceholders ? proof.slots.slice(0, 3) : filled

  return (
    <Section id="proof" kicker={proof.kicker} className="section-proof">
      <h2 className="section-title">{proof.title}</h2>
      <p className="section-lede">{proof.note}</p>

      {showPlaceholders && (
        <p className="placeholder-banner">
          🚩 Testimonial slots ~ replace with real client quotes before launch.
        </p>
      )}

      <div className="proof-grid">
        {slots.map((s) => (
          <figure
            key={s.id}
            className={`proof-card ${showPlaceholders ? 'is-placeholder' : ''}`}
          >
            {showPlaceholders ? (
              <blockquote className="proof-quote placeholder-text">{s.placeholder}</blockquote>
            ) : (
              <>
                <blockquote className="proof-quote">“{s.quote}”</blockquote>
                <figcaption className="proof-cite">
                  <span className="proof-name">{s.name}</span>
                  {s.context && <span className="proof-context"> ~ {s.context}</span>}
                </figcaption>
              </>
            )}
          </figure>
        ))}
      </div>
    </Section>
  )
}

function Founder() {
  return (
    <Section id="founder" kicker={founder.kicker} className="section-founder">
      <div className="founder-card">
        {/* 🚩 Optional: drop a founder photo in /public and reference it here. */}
        <h2 className="section-title founder-title">{founder.title}</h2>
        <div className="founder-body">
          {founder.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="founder-signoff">{founder.signoff}</p>
        <p className="review-flag">{founder.reviewFlag}</p>
      </div>
    </Section>
  )
}

function Pilot() {
  return (
    <Section id="pilot" kicker={pilot.kicker} className="section-pilot">
      <h2 className="section-title">{pilot.title}</h2>

      <div className="facts-grid">
        {pilot.facts.map((f) => (
          <div key={f.label} className="fact">
            <span className="fact-icon">{f.icon}</span>
            <span className="fact-label">{f.label}</span>
            <span className="fact-value">{f.value}</span>
          </div>
        ))}
      </div>

      <div className="price-card">
        <span className="price-eyebrow">Founding price</span>
        <span className="price-value">{pilot.price.placeholder}</span>
        <span className="price-note">{pilot.price.note}</span>
      </div>

      <p className="footnote">{pilot.seatsNote}</p>
    </Section>
  )
}

function TallyEmbed() {
  // Load Tally's embed script once; it turns the iframe below into a
  // responsive, auto-resizing embed. Falls back to a plain link if it
  // can't load (e.g. offline preview).
  useEffect(() => {
    const SRC = 'https://tally.so/widgets/embed.js'
    const load = () => window.Tally?.loadEmbeds()

    if (window.Tally) {
      load()
      return
    }
    if (document.querySelector(`script[src="${SRC}"]`)) return

    const script = document.createElement('script')
    script.src = SRC
    script.onload = load
    document.body.appendChild(script)
  }, [])

  const src =
    `https://tally.so/embed/${apply.formId}` +
    '?alignLeft=1&hideTitle=1&dynamicHeight=1'

  return (
    <div className="tally-wrap">
      <iframe
        data-tally-src={src}
        loading="lazy"
        width="100%"
        height="420"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title={finalCta.buttonLabel}
      />
      <p className="tally-fallback">
        Form not loading?{' '}
        <a href={apply.publicUrl} target="_blank" rel="noreferrer">
          Open the application in a new tab
        </a>
        .
      </p>
    </div>
  )
}

function FinalCTA() {
  return (
    <section id="apply" className="section section-final">
      <div className="final-glow" aria-hidden="true" />
      <Sparkle className="s4" />
      <Sparkle className="s5" />
      <div className="container final-inner">
        <h2 className="final-title">{finalCta.title}</h2>
        <div className="final-lines">
          {finalCta.lines.map((l) => (
            <span key={l} className="final-line">
              {l}
            </span>
          ))}
        </div>

        <TallyEmbed />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-brand">{footer.brand}</span>
        <span className="footer-tagline">{footer.tagline}</span>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Problem />
        <Reframe />
        <WhatItIs />
        <ForWhom />
        <Proof />
        <Founder />
        <Pilot />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
