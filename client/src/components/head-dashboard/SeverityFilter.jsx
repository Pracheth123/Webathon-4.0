import { motion } from 'framer-motion'

const FILTERS = [
  { value: 'all', label: 'All', activeClass: 'btn-neutral' },
  { value: 'critical', label: '🔴 Critical', activeClass: 'btn-error' },
  { value: 'high', label: '🟠 High', activeClass: 'btn-warning' },
  { value: 'medium', label: '🟡 Medium', activeClass: 'btn-accent' },
  { value: 'low', label: '🔵 Low', activeClass: 'btn-info' },
]

export default function SeverityFilter({ value, onChange }) {
  return (
    <form className="filter flex flex-wrap gap-2 items-center">
      {FILTERS.map((f) => (
        <motion.button
          key={f.value}
          type="button"
          className={`btn btn-sm ${value === f.value ? f.activeClass : 'btn-ghost border border-white/10 text-base-content/60'}`}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </motion.button>
      ))}
    </form>
  )
}
