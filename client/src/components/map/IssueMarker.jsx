import { motion } from 'framer-motion'

const SEVERITY_COLORS = {
  critical: '#f87171',
  high: '#fb923c',
  medium: '#fbbf24',
  low: '#60a5fa',
  completed: '#34d399',
}

const PULSE_SEVERITIES = ['critical', 'high']

export default function IssueMarker({ issue, onClick, isSelected }) {
  const color = SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.low
  const hasPulse = PULSE_SEVERITIES.includes(issue.severity)

  return (
    <div
      className="relative cursor-pointer"
      onClick={(e) => {
        e.stopPropagation()
        onClick(issue)
      }}
      style={{ width: 24, height: 24 }}
    >
      {/* Pulsing ring for high/critical */}
      {hasPulse && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: color,
            animation: 'markerPulse 1.8s ease-out infinite',
            opacity: 0.5,
          }}
        />
      )}

      {/* Marker dot */}
      <motion.div
        className="relative w-full h-full rounded-full border-2 border-white/80 shadow-lg"
        style={{
          backgroundColor: color,
          boxShadow: isSelected ? `0 0 0 3px ${color}60, 0 4px 12px ${color}80` : `0 2px 8px ${color}60`,
        }}
        animate={isSelected ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.3 }}
      />

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
          style={{ backgroundColor: color }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        />
      )}
    </div>
  )
}
