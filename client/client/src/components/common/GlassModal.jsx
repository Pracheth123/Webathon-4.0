import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * GlassModal — animated glassmorphic dialog
 */
export default function GlassModal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal modal-open" style={{ zIndex: 1000 }}>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Box */}
          <motion.div
            className={`modal-box glass-strong rounded-2xl ${maxWidth} relative z-10`}
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              {title && <h3 className="text-heading text-base-content pr-4">{title}</h3>}
              <button
                className="btn btn-ghost btn-xs btn-square shrink-0 ml-auto"
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
