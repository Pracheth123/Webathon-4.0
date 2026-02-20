import { motion } from 'framer-motion'

export default function BeforeAfterPreview({ beforeUrl, afterUrl, showAfter = false }) {
  if (!showAfter || !afterUrl) {
    return (
      <motion.div
        className="glass rounded-2xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative">
          <img
            src={beforeUrl}
            alt="Before"
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
            <span className="badge badge-error">BEFORE — Current State</span>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center h-20 text-base-content/40 text-sm">
          After photo will appear once you complete the task
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <figure className="diff w-full" style={{ aspectRatio: '16/7' }}>
        <div className="diff-item-1">
          <div className="relative w-full h-full">
            <img src={beforeUrl} alt="Before" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2">
              <span className="badge badge-error badge-sm">BEFORE</span>
            </div>
          </div>
        </div>
        <div className="diff-item-2">
          <div className="relative w-full h-full">
            <img src={afterUrl} alt="After" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 right-2">
              <span className="badge badge-success badge-sm">AFTER</span>
            </div>
          </div>
        </div>
        <div className="diff-resizer" />
      </figure>
      <p className="text-center text-xs text-base-content/40 mt-2 pb-2">
        ← Drag the slider to compare before &amp; after →
      </p>
    </motion.div>
  )
}
