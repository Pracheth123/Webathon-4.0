import { motion } from 'framer-motion'

/**
 * AnimatedButton — daisyUI btn with Framer Motion micro-interactions
 * Props: variant (primary|secondary|accent|ghost|outline|error|success)
 *        size (xs|sm|md|lg), glow, wide, block, disabled
 */
export default function AnimatedButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  glow = false,
  wide = false,
  block = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const sizeClass = size !== 'md' ? `btn-${size}` : ''
  const glowClass = glow ? 'glow-primary' : ''

  return (
    <motion.button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${glowClass} ${wide ? 'btn-wide' : ''} ${block ? 'btn-block' : ''} ${className}`}
      whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
