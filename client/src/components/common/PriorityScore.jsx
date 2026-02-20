import { motion } from 'framer-motion'

const scoreColor = (score) => {
  if (score >= 85) return 'text-error'
  if (score >= 70) return 'text-warning'
  if (score >= 50) return 'text-accent'
  return 'text-info'
}

/**
 * PriorityScore — compact priority indicator using a small ring + number
 */
export default function PriorityScore({ score, showLabel = false, size = 'sm' }) {
  const color = scoreColor(score)
  const dim = size === 'lg' ? '5rem' : size === 'md' ? '3.5rem' : '2.5rem'
  const textSize = size === 'lg' ? 'text-xl' : size === 'md' ? 'text-sm' : 'text-xs'

  return (
    <motion.div
      className={`radial-progress ${color} shrink-0`}
      style={{ '--value': score, '--size': dim, '--thickness': '3px' }}
      role="progressbar"
      aria-valuenow={score}
      initial={{ '--value': 0 }}
      animate={{ '--value': score }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <span className={`${textSize} font-bold text-data`}>{score}</span>
      {showLabel && <span className="text-meta text-base-content/40 text-[0.5rem]">priority</span>}
    </motion.div>
  )
}
