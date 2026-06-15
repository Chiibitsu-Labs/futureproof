import { useState } from 'react'
import { OPTIN } from '../data/content.js'
import { capture } from '../lib/api.js'

// One optional ask, after the gift is whole. Skippable. Never required.
export default function OptIn({ answers, reflection, onDone }) {
  const [email, setEmail] = useState('')
  const [interests, setInterests] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const toggleInterest = (id) => {
    setInterests((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
  }

  const send = async () => {
    setSending(true)
    await capture({
      lens: answers.lens,
      email,
      interests,
      cues: answers.cues,
      freshness: answers.freshness,
      signature: answers.signature,
      signatureLine: reflection?.signatureLine || ''
    })
    setSending(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="screen screen-optin fade-in">
        <p className="optin-thanks">{email.trim() ? OPTIN.thanks : OPTIN.thanksNoEmail}</p>
        <button className="btn btn-primary" onClick={onDone}>
          continue
        </button>
      </section>
    )
  }

  return (
    <section className="screen screen-optin fade-in">
      <h2 className="step-title">{OPTIN.title}</h2>
      <p className="step-subtitle">
        {OPTIN.subtitle.split('\n').map((l, i) => (
          <span key={i} className="soft-line">
            {l}
          </span>
        ))}
      </p>

      <div className="field">
        <label className="field-label" htmlFor="email">
          {OPTIN.emailLabel}
        </label>
        <input
          id="email"
          className="field-input"
          type="email"
          placeholder={OPTIN.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="interests">
        {OPTIN.interests.map((it) => {
          const on = interests.includes(it.id)
          return (
            <button
              key={it.id}
              type="button"
              className={`interest ${on ? 'is-on' : ''}`}
              aria-pressed={on}
              onClick={() => toggleInterest(it.id)}
            >
              <span className="interest-mark" aria-hidden="true" />
              {it.label}
            </button>
          )
        })}
      </div>

      <div className="optin-actions">
        <button
          className="btn btn-primary"
          onClick={send}
          disabled={sending || (!email.trim() && interests.length === 0)}
        >
          {sending ? 'sending…' : OPTIN.submitButton}
        </button>
        <button className="btn-text" onClick={onDone}>
          {OPTIN.skipButton}
        </button>
      </div>
    </section>
  )
}
