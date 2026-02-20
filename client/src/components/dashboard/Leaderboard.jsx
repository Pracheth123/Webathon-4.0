import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react'

function ChangeIcon({ change }) {
  if (change > 0) return <TrendingUp size={11} className="text-success" />
  if (change < 0) return <TrendingDown size={11} className="text-error" />
  return <Minus size={11} className="text-base-content/30" />
}

const RANK_COLORS = ['text-accent', 'text-base-content/60', 'text-warning/70']

export default function Leaderboard({ leaderboard, currentUserId }) {
  return (
    <motion.div
      className="glass rounded-2xl p-5 h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={16} className="text-accent" />
        <span className="text-meta text-primary">CITY LEADERBOARD</span>
      </div>

      <ul className="space-y-2">
        {leaderboard.map((entry, i) => {
          const isCurrent = entry.id === currentUserId
          return (
            <motion.li
              key={entry.rank}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                isCurrent
                  ? 'glass-strong border border-primary/30'
                  : 'hover:bg-white/4'
              }`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              {/* Rank */}
              <span className={`text-data font-black text-sm w-6 shrink-0 text-center ${RANK_COLORS[i] || 'text-base-content/40'}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${entry.rank}`}
              </span>

              {/* Avatar */}
              <div className="avatar shrink-0">
                <div className={`w-8 h-8 rounded-full ${isCurrent ? 'ring-2 ring-primary ring-offset-1 ring-offset-base-100' : ''}`}>
                  <img src={entry.avatar} alt={entry.name} />
                </div>
              </div>

              {/* Name + score */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-primary' : 'text-base-content'}`}>
                  {entry.name} {isCurrent && <span className="text-meta text-primary ml-1">YOU</span>}
                </p>
                <p className="text-data text-xs text-base-content/50">{entry.civicScore.toLocaleString()} pts</p>
              </div>

              {/* Change */}
              <div className="flex items-center gap-0.5 shrink-0">
                <ChangeIcon change={entry.change} />
                {entry.change !== 0 && (
                  <span className={`text-[0.6rem] font-bold ${entry.change > 0 ? 'text-success' : 'text-error'}`}>
                    {Math.abs(entry.change)}
                  </span>
                )}
              </div>
            </motion.li>
          )
        })}
      </ul>
    </motion.div>
  )
}
