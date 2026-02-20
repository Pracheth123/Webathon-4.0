import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Zap, Award, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import AnimatedButton from '../common/AnimatedButton'

export default function SubmissionCelebration({ credits = 150, xp = 200 }) {
  const navigate = useNavigate()

  useEffect(() => {
    // Burst 1
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#22d3ee', '#818cf8', '#fbbf24', '#34d399', '#f87171'],
    })
    // Burst 2 — left
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 65,
        origin: { x: 0, y: 0.6 },
        colors: ['#22d3ee', '#34d399'],
      })
    }, 350)
    // Burst 3 — right
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 65,
        origin: { x: 1, y: 0.6 },
        colors: ['#fbbf24', '#818cf8'],
      })
    }, 600)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="glass-strong rounded-3xl p-10 text-center max-w-sm w-full mx-4"
        initial={{ scale: 0.5, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
      >
        {/* Emoji burst */}
        <motion.div
          className="text-7xl mb-6 select-none"
          animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.3, 1.1, 1.2, 1] }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          🎉
        </motion.div>

        <motion.h2
          className="text-heading text-base-content mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Task Completed!
        </motion.h2>

        <motion.p
          className="text-base-content/60 text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          You've made a real difference in your community.
        </motion.p>

        {/* Rewards */}
        <motion.div
          className="flex gap-3 justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75, type: 'spring' }}
        >
          <div className="glass border border-primary/30 rounded-2xl px-5 py-3">
            <div className="text-data font-black text-xl text-primary">+{credits}</div>
            <div className="text-meta text-base-content/50 text-[0.6rem]">CIVIC CREDITS</div>
          </div>
          <div className="glass border border-accent/30 rounded-2xl px-5 py-3">
            <div className="text-data font-black text-xl text-accent">+{xp}</div>
            <div className="text-meta text-base-content/50 text-[0.6rem]">XP POINTS</div>
          </div>
        </motion.div>

        {/* Bonus badge hint */}
        <motion.div
          className="alert alert-success alert-soft rounded-xl mb-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Award size={15} />
          <span>Keep going — 2 more tasks for a new badge!</span>
        </motion.div>

        <div className="flex gap-3">
          <AnimatedButton
            variant="ghost"
            className="flex-1 border border-white/10"
            onClick={() => navigate('/map')}
          >
            View Map
          </AnimatedButton>
          <AnimatedButton
            variant="primary"
            glow
            className="flex-1"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard <ArrowRight size={15} />
          </AnimatedButton>
        </div>
      </motion.div>
    </motion.div>
  )
}
