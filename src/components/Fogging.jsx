import { useEffect, useState } from 'react'
import { FOGGING } from '../data/content.js'

// The unveiling beat ~ the mirror fogs, then clears. Cycles the reassuring lines
// while the reflection generates.
export default function Fogging() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setI((n) => (n + 1) % FOGGING.lines.length)
    }, 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="screen screen-fogging">
      <div className="fog-mirror" aria-hidden="true">
        <div className="fog-veil" />
        <div className="fog-shimmer" />
      </div>
      <p className="fog-line" key={i}>
        {FOGGING.lines[i]}
      </p>
      <p className="visually-hidden" role="status">
        Your reflection is being prepared.
      </p>
    </section>
  )
}
