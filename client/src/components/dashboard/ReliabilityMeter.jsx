import { motion } from 'framer-motion'
import { ShieldCheck, AlertCircle } from 'lucide-react'

const LEVELS = [
  { min: 90, label: 'Excellent', color: 'text-success', badge: 'badge-success' },
  { min: 75, label: 'Good', color: 'text-primary', badge: 'badge-primary' },
  { min: 60, label: 'Moderate', color: 'text-accent', badge: 'badge-accent' },
  { min: 0, label: 'Needs Work', color: 'text-error', badge: 'badge-error' },
]

export default function ReliabilityMeter({ score }) {
  const level = LEVELS.find((l) => score >= l.min) || LEVELS[LEVELS.length - 1]

  const segments = [
    { label: 'Accurate Reports', value: Math.round(score * 0.35), max: 35, color: 'progress-success' },
    { label: 'Task Completion', value: Math.round(score * 0.40), max: 40, color: 'progress-primary' },
    { label: 'Response Time', value: Math.round(score * 0.25), max: 25, color: 'progress-accent' },
  ]

  return (
    <motion.div
      className="glass rounded-2xl p-5 h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-meta text-primary">RELIABILITY METER</span>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck size={18} className={level.color} />
            <span className={`text-heading ${level.color}`}>{score}%</span>
          </div>
        </div>
        <span className={`badge ${level.badge} badge-lg`}>{level.label}</span>
      </div>

      {/* Main bar */}
      <div className="mb-5">
        <motion.div
          className="h-3 rounded-full bg-base-300 overflow-hidden"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-success"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </motion.div>
      </div>

      {/* Segments */}
      <div className="space-y-3">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <div className="flex justify-between mb-1">
              <span className="text-xs text-base-content/60">{seg.label}</span>
              <span className="text-data text-xs text-base-content/60">{seg.value}/{seg.max}</span>
            </div>
            <progress className={`progress ${seg.color} h-1.5 w-full`} value={seg.value} max={seg.max} />
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-4 text-xs text-base-content/40">
        <AlertCircle size={11} />
        <span>Based on last 90 days of activity</span>
      </div>
    </motion.div>
  )
}
