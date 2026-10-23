import { useEffect, useState } from 'react'
import { countdown } from '../event'

export default function Countdown({ target }: { target: number | null }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined
    const tick = () => {
      const current = Date.now()
      setNow(current)
      if (target !== null && target <= current && timer) clearInterval(timer)
    }
    tick()
    if (target !== null && target > Date.now()) timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [target])
  if (target === null) return <div className="sh-countdown-note"><span className="sh-small-label">A moment worth waiting for</span><p>The countdown begins when our date and ceremony time are confirmed.</p></div>
  if (now === null) return <div className="sh-countdown" aria-label="Preparing countdown">{['Days', 'Hours', 'Minutes', 'Seconds'].map(label => <div key={label}><strong>--</strong><span>{label}</span></div>)}</div>
  const remaining = countdown(target, now)
  if (remaining.state === 'complete') return <div className="sh-countdown-note"><span className="sh-small-label">Our new chapter has begun</span><p>Thank you for sharing in our celebration.</p></div>
  return <div className="sh-countdown" role="timer" aria-label="Time until the wedding">{['Days', 'Hours', 'Minutes', 'Seconds'].map((label, index) => <div key={label}><strong>{String(remaining.values[index]).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
}