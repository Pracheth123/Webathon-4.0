import { motion } from 'framer-motion'
import { TrendingUp, Star } from 'lucide-react'

export default function CivicScoreCard({ user }) {
  const scorePercent = Math.min(Math.round((user.civicScore / 10000) * 100), 100)

  return (
    <motion.div
      className="glass-strong rounded-2xl p-6 flex flex-col items-center text-center h-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-meta text-primary mb-4">CIVIC SCORE</span>

      {/* Radial ring */}
      <motion.div
        className="radial-progress text-primary glow-primary"
        style={{
          '--value': scorePercent,
          '--size': '9.5rem',
          '--thickness': '8px',
        }}
        role="progressbar"
        aria-valuenow={scorePercent}
        initial={{ '--value': 0 }}
        animate={{ '--value': scorePercent }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-data text-2xl font-black text-base-content">
            {user.civicScore.toLocaleString()}
          </span>
          <span className="text-meta text-base-content/40">points</span>
        </div>
      </motion.div>

      {/* Rank badge */}
      <div className="badge badge-primary badge-outline mt-5 gap-1">
        <Star size={12} /> Rank #{user.rank} in City
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2 w-full mt-5">
        {[
          { label: 'Reports', value: user.totalReports },
          { label: 'Resolved', value: user.resolvedIssues },
          { label: 'Tasks', value: user.volunteeredTasks },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-2 text-center">
            <div className="text-data font-bold text-base-content text-sm">{s.value}</div>
            <div className="text-meta text-base-content/40 text-[0.6rem]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 mt-4 text-success text-xs">
        <TrendingUp size={13} />
        <span>+342 pts this week</span>
      </div>
    </motion.div>
  )
}
