import { useState, useCallback } from 'react'
import Atmosphere from './components/Atmosphere.jsx'
import Landing from './components/Landing.jsx'
import LensPicker from './components/LensPicker.jsx'
import GapStep from './components/GapStep.jsx'
import SignatureStep from './components/SignatureStep.jsx'
import Fogging from './components/Fogging.jsx'
import Reflection from './components/Reflection.jsx'
import OptIn from './components/OptIn.jsx'
import Close from './components/Close.jsx'
import { diagnose } from './lib/api.js'
import { lensPhrase } from './data/content.js'

// The flow, in order. One screen at a time ~ the gift unveils, it doesn't sprawl.
const STEPS = ['landing', 'lens', 'gap', 'signature', 'fogging', 'reflection', 'optin', 'close']

const emptyAnswers = {
  lens: null,
  cues: [], // array of {id, tag, text}
  freshness: '',
  signature: { social: '', labelWord: '', labelLeavesOut: '', residue: '' }
}

export default function App() {
  const [step, setStep] = useState('landing')
  const [answers, setAnswers] = useState(emptyAnswers)
  const [reflection, setReflection] = useState(null)
  const [error, setError] = useState(null)

  const go = useCallback((next) => {
    setError(null)
    setStep(next)
    // ease the eye back to the top of the new screen
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const runDiagnosis = useCallback(async (finalAnswers) => {
    go('fogging')
    try {
      const result = await diagnose({
        lens: finalAnswers.lens,
        lensPhrase: lensPhrase(finalAnswers.lens),
        cues: finalAnswers.cues,
        freshness: finalAnswers.freshness,
        signature: finalAnswers.signature
      })
      setReflection(result)
      go('reflection')
    } catch (err) {
      setError(err.message)
      go('signature')
    }
  }, [go])

  const restart = useCallback(() => {
    setAnswers(emptyAnswers)
    setReflection(null)
    setError(null)
    go('lens')
  }, [go])

  return (
    <Atmosphere step={step}>
      {step === 'landing' && <Landing onStart={() => go('lens')} />}

      {step === 'lens' && (
        <LensPicker
          selected={answers.lens}
          onPick={(lens) => {
            setAnswers((a) => ({ ...a, lens }))
            go('gap')
          }}
          onBack={() => go('landing')}
        />
      )}

      {step === 'gap' && (
        <GapStep
          lens={answers.lens}
          cues={answers.cues}
          freshness={answers.freshness}
          onChange={(patch) => setAnswers((a) => ({ ...a, ...patch }))}
          onNext={() => go('signature')}
          onBack={() => go('lens')}
        />
      )}

      {step === 'signature' && (
        <SignatureStep
          lens={answers.lens}
          signature={answers.signature}
          error={error}
          onChange={(signature) => setAnswers((a) => ({ ...a, signature }))}
          onSubmit={() => runDiagnosis(answers)}
          onBack={() => go('gap')}
        />
      )}

      {step === 'fogging' && <Fogging />}

      {step === 'reflection' && reflection && (
        <Reflection
          lens={answers.lens}
          reflection={reflection}
          onContinue={() => go('optin')}
          onRestart={restart}
        />
      )}

      {step === 'optin' && (
        <OptIn
          answers={answers}
          reflection={reflection}
          onDone={() => go('close')}
        />
      )}

      {step === 'close' && <Close onRestart={restart} />}
    </Atmosphere>
  )
}
