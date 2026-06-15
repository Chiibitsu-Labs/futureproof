import { SIGNATURE_PROMPTS, lensPhrase } from '../data/content.js'

export default function SignatureStep({ lens, signature, error, onChange, onSubmit, onBack }) {
  const set = (key) => (e) => onChange({ ...signature, [key]: e.target.value })

  const residuePrompt = SIGNATURE_PROMPTS.residue.prompt.replace('{lens}', lensPhrase(lens))

  // gentle gate ~ at least one signature answer so the mirror has something to hold
  const hasSomething =
    (signature.social || '').trim() ||
    (signature.labelWord || '').trim() ||
    (signature.residue || '').trim()

  return (
    <section className="screen screen-signature fade-in">
      <button className="btn-back" onClick={onBack}>
        ← back
      </button>

      <p className="part-tag">now ~ the part that’s yours</p>
      <h2 className="step-title">{SIGNATURE_PROMPTS.title}</h2>
      <p className="step-subtitle">{SIGNATURE_PROMPTS.subtitle}</p>

      <div className="field">
        <label className="field-label" htmlFor="sig-social">
          {SIGNATURE_PROMPTS.social.label}
        </label>
        <p className="field-prompt">{SIGNATURE_PROMPTS.social.prompt}</p>
        <textarea
          id="sig-social"
          className="field-input"
          rows={2}
          placeholder={SIGNATURE_PROMPTS.social.placeholder}
          value={signature.social}
          onChange={set('social')}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="sig-word">
            {SIGNATURE_PROMPTS.labelWord.label}
          </label>
          <p className="field-prompt">{SIGNATURE_PROMPTS.labelWord.prompt}</p>
          <input
            id="sig-word"
            className="field-input"
            type="text"
            placeholder={SIGNATURE_PROMPTS.labelWord.placeholder}
            value={signature.labelWord}
            onChange={set('labelWord')}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="sig-leaves">
            {SIGNATURE_PROMPTS.labelLeavesOut.label}
          </label>
          <p className="field-prompt">{SIGNATURE_PROMPTS.labelLeavesOut.prompt}</p>
          <input
            id="sig-leaves"
            className="field-input"
            type="text"
            placeholder={SIGNATURE_PROMPTS.labelLeavesOut.placeholder}
            value={signature.labelLeavesOut}
            onChange={set('labelLeavesOut')}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="sig-residue">
          {SIGNATURE_PROMPTS.residue.label}
        </label>
        <p className="field-prompt">{residuePrompt}</p>
        <textarea
          id="sig-residue"
          className="field-input"
          rows={2}
          placeholder={SIGNATURE_PROMPTS.residue.placeholder}
          value={signature.residue}
          onChange={set('residue')}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="btn btn-primary" onClick={onSubmit} disabled={!hasSomething}>
        clear the glass ✨
      </button>
      {!hasSomething && (
        <p className="reassure">A line in any one field is enough for the mirror to begin.</p>
      )}
    </section>
  )
}
