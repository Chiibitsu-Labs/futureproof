import { useMemo } from 'react'

// The persistent dreamscape behind every screen ~ deep violet, drifting light,
// a warm glow so it shimmers instead of going cold. Pure CSS motion, no deps.
export default function Atmosphere({ step, children }) {
  // a scatter of slow-drifting light motes, generated once
  const motes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 16,
        drift: (Math.random() * 40 - 20).toFixed(1)
      })),
    []
  )

  return (
    <div className="atmosphere" data-step={step}>
      <div className="aurora aurora-a" aria-hidden="true" />
      <div className="aurora aurora-b" aria-hidden="true" />
      <div className="aurora aurora-warm" aria-hidden="true" />

      <div className="motes" aria-hidden="true">
        {motes.map((m) => (
          <span
            key={m.id}
            className="mote"
            style={{
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: `${m.size}px`,
              height: `${m.size}px`,
              '--delay': `${m.delay}s`,
              '--duration': `${m.duration}s`,
              '--drift': `${m.drift}px`
            }}
          />
        ))}
      </div>

      <main className="stage">{children}</main>
    </div>
  )
}
