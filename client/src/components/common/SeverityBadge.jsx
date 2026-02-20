import { motion } from 'framer-motion'

const SEVERITY_CONFIG = {
  critical: { badge: 'badge-error', label: 'Critical', pulse: true },
  high:     { badge: 'badge-warning', label: 'High', pulse: true },
  medium:   { badge: 'badge-accent', label: 'Medium', pulse: false },
  low:      { badge: 'badge-info', label: 'Low', pulse: false },
  completed:{ badge: 'badge-success', label: 'Completed', pulse: false },
}

export default function SeverityBadge({ severity, size = 'sm' }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low
  const sizeClass = size === 'xs' ? 'badge-xs' : size === 'sm' ? 'badge-sm' : 'badge-md'

  return (
    <motion.span
      className={`badge ${config.badge} ${sizeClass} font-semibold`}
      animate={config.pulse ? { opacity: [1, 0.6, 1] } : {}}
      transition={config.pulse ? { duration: 1.8, repeat: Infinity } : {}}
    >
      {config.label}
    </motion.span>
  )
}
