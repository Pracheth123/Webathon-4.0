import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, Users, MapPin, Star } from 'lucide-react'

const STATS = [
  { label: 'Issues Resolved', value: 12847, suffix: '+', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
  { label: 'Active Volunteers', value: 3429, suffix: '', icon: Users, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  { label: 'Cities Covered', value: 47, suffix: '', icon: MapPin, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
  { label: 'Civic Credits Awarded', value: 892340, suffix: '+', icon: Star, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
]

function CountUp({ target, duration = 1800, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])

  return (
    <span ref={ref} className="text-data">
      {count >= 1000 ? count.toLocaleString() : count}{suffix}
    </span>
  )
}

export default function LiveStats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="container mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-meta text-primary">IMPACT IN NUMBERS</span>
          <h2 className="text-heading text-base-content mt-2">Civic Action at Scale</h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`glass rounded-2xl p-6 border ${stat.border} text-center`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center mx-auto mb-4`}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <div className={`text-3xl font-black mb-1 ${stat.color}`}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-meta text-base-content/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Live indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <span className="w-2 h-2 rounded-full bg-success pulse-glow" />
          <span className="text-meta text-base-content/40">Updated in real-time</span>
        </motion.div>
      </div>
    </section>
  )
}
