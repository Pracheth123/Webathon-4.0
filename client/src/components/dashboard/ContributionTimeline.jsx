import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Award, ArrowUpCircle, Flag } from 'lucide-react'

const TYPE_CONFIG = {
  report:     { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  task:       { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
  badge:      { icon: Award, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
  escalation: { icon: ArrowUpCircle, color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' },
  default:    { icon: Flag, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function ContributionTimeline({ timeline }) {
  return (
    <motion.div
      className="glass rounded-2xl p-5 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <span className="text-meta text-primary block mb-5">CONTRIBUTION TIMELINE</span>

      <div className="overflow-y-auto scrollbar-hidden" style={{ maxHeight: '320px' }}>
        <ul className="timeline timeline-vertical timeline-compact">
          {timeline.map((item, i) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.default
            const Icon = config.icon
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {i > 0 && <hr className="bg-base-300" />}

                <div className="timeline-start text-meta text-base-content/40 text-[0.6rem] pr-2 min-w-[3rem]">
                  {formatDate(item.date)}
                </div>

                <div className="timeline-middle">
                  <div className={`w-7 h-7 rounded-full ${config.bg} border ${config.border} flex items-center justify-center`}>
                    <Icon size={13} className={config.color} />
                  </div>
                </div>

                <div className="timeline-end timeline-box glass rounded-xl ml-2 mb-2">
                  <p className="text-xs text-base-content leading-snug">{item.title}</p>
                  <span className="text-meta text-success text-[0.6rem]">+{item.credits} credits</span>
                </div>

                {i < timeline.length - 1 && <hr className="bg-base-300" />}
              </motion.li>
            )
          })}
        </ul>
      </div>
    </motion.div>
  )
}
