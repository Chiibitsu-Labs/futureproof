import { useState } from 'react'
import { OPTIN } from '../data/content.js'
import { capture } from '../lib/api.js'

// One optional ask, after the gift is whole. Skippable. Never required.
// The email is built from whatever they tick, so the copy stays honest.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function OptIn({ answers, reflection, onDone }) {
  const [email, setEmail] = useState('')
  const [interests, setInterests] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [emailed, setEmailed] = useState(false)
  const [sending, setSending] = useState(false)
  const [touched, setTouched] = useState(false)

  const emailValid = EMAIL_RE.test(email.trim())
  const showEmailError = touched && email.trim() !== '' && !emailValid
  const canSend = emailValid && interests.length > 0

  const toggleInterest = (id) => {
    setInterests((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
  }

  const send = async () => {
    if (!canSend) {
      setTouched(true)
      return
    }
    setSending(true)
    const res = await capture({
      lens: answers.lens,
      email: email.trim(),
      interests,
      cues: answers.cues,
      freshness: answers.freshness,
      signature: answers.signature,
      signatureLine: reflection?.signatureLine || '',
      // the full reflection lets the server compose the emailed copy
      reflection: reflection || null
    })
    setEmailed(Boolean(res && res.emailed))
    setSending(false)
    setSubmitted(true)
  }

  if (submitted) {
    const msg = !email.trim() ? OPTIN.thanksNoEmail : emailed ? OPTIN.thanksEmailed : OPTIN.thanks
    return (
      <section className="screen screen-optin fade-in">
        <p className="optin-thanks">{msg}</p>
        <button className="btn btn-primary" onClick={onDone}>
          continue
        </button>
      </section>
    )
  }

  return (
    <section className="screen screen-optin fade-in">
      <h2 className="step-title">{OPTIN.title}</h2>
      <p className="step-subtitle">{OPTIN.subtitle}</p>

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
          onBlur={() => setTouched(true)}
        />
        {showEmailError && <p className="field-mini-error">{OPTIN.invalidEmail}</p>}
      </div>

      <div className="interests">
        <span className="field-label interests-label">{OPTIN.interestsLabel}</span>
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
        <button className="btn btn-primary" onClick={send} disabled={sending || !canSend}>
          {sending ? 'sending…' : OPTIN.submitButton}
        </button>
        {touched && emailValid && interests.length === 0 && (
          <p className="field-mini-error">{OPTIN.needPick}</p>
        )}
        <button className="btn-text" onClick={onDone}>
          {OPTIN.skipButton}
        </button>
      </div>
    </section>
  )
}
