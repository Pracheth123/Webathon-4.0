import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const RARITY_STYLES = {
  legendary: 'border-accent/50 bg-accent/10 shadow-[0_0_12px_rgba(251,191,36,0.2)]',
  epic:       'border-secondary/50 bg-secondary/10 shadow-[0_0_10px_rgba(129,140,248,0.15)]',
  rare:       'border-primary/50 bg-primary/10',
  uncommon:   'border-info/30 bg-info/8',
  common:     'border-white/10 bg-white/4',
}

export default function BadgeCollection({ badges, earnedIds = [] }) {
  return (
    <motion.div
      className="glass rounded-2xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-meta text-primary">BADGE COLLECTION</span>
        <span className="badge badge-ghost badge-sm">{earnedIds.length}/{badges.length}</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {badges.map((badge, i) => {
          const earned = earnedIds.includes(badge.id)
          const rarityClass = RARITY_STYLES[badge.rarity] || RARITY_STYLES.common

          return (
            <motion.div
              key={badge.id}
              className={`relative glass border rounded-xl p-2 text-center cursor-pointer group ${rarityClass} ${!earned ? 'opacity-35 grayscale' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: earned ? 1 : 0.35, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: earned ? 1.1 : 1.05, opacity: 1 }}
              title={`${badge.name} — ${badge.description}`}
            >
              <div className="text-2xl leading-none">{badge.icon}</div>

              {!earned && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                  <Lock size={10} className="text-base-content/30" />
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass-strong rounded-lg px-2 py-1 text-[0.6rem] text-base-content whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {badge.name}
                <br />
                <span className="text-base-content/50">{badge.rarity}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
