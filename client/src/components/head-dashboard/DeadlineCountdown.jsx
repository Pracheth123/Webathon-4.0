import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

function calcTimeLeft(deadline) {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true, urgent: true }
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { hours: Math.min(h, 99), minutes: m, seconds: s, expired: false, urgent: h < 24 }
}

export default function DeadlineCountdown({ deadline }) {
  const [time, setTime] = useState(calcTimeLeft(deadline))

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(deadline)), 1000)
    return () => clearInterval(id)
  }, [deadline])

  if (time.expired) {
    return <span className="badge badge-error badge-sm gap-1"><Clock size={10} /> Overdue</span>
  }

  return (
    <div className={`flex items-center gap-1 ${time.urgent ? 'text-error' : 'text-base-content/60'}`}>
      <Clock size={11} className={time.urgent ? 'text-error pulse-glow' : ''} />
      <span className="countdown font-mono text-xs">
        <span style={{ '--value': time.hours }}>{time.hours}</span>h&nbsp;
        <span style={{ '--value': time.minutes }}>{time.minutes}</span>m&nbsp;
        <span style={{ '--value': time.seconds }}>{time.seconds}</span>s
      </span>
    </div>
  )
}
