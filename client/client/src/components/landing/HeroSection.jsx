import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Map, ArrowRight, Zap } from 'lucide-react'
import AnimatedButton from '../common/AnimatedButton'
import { useAuth } from '../../context/AuthContext'

const words = [
  { text: 'Execute.', className: 'text-base-content' },
  { text: 'Govern.', className: 'text-gradient-primary' },
  { text: 'Transform.', className: 'text-gradient-accent' },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleProtectedNav = (path) => {
    if (!user) {
      navigate('/login', { state: { redirectTo: path } })
      return
    }
    navigate(path)
  }

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-100 via-base-200/50 to-base-100 grid-overlay" />

      {/* Floating orbs */}
      <div className="absolute top-16 right-[10%] w-80 h-80 rounded-full bg-primary/8 blur-3xl floating pointer-events-none" />
      <div className="absolute bottom-24 left-[8%] w-96 h-96 rounded-full bg-secondary/8 blur-3xl floating-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent/4 blur-3xl pointer-events-none" />

      {/* Spinning ring decoration */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full border border-primary/10 spin-slow pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border border-secondary/10 spin-slow pointer-events-none" style={{ animationDirection: 'reverse' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="badge badge-outline badge-primary gap-2 px-4 py-3 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-glow inline-block" />
            Real-Time Civic Micro-Execution Governance
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="mb-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
        >
          <h1 className="text-display text-center leading-[1.08]">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className={`inline-block mr-[0.3em] last:mr-0 ${w.className}`}
                variants={{
                  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: 'easeOut' } },
                }}
              >
                {w.text}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="text-base-content/55 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          A hyper-responsive platform where every civic issue is tracked,
          AI-prioritized, and resolved through community micro-execution — in real time.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <AnimatedButton variant="primary" size="lg" glow onClick={() => handleProtectedNav('/report')}>
            <Zap size={18} /> Get Started
          </AnimatedButton>
          <AnimatedButton
            variant="ghost"
            size="lg"
            className="border border-white/10"
            onClick={() => handleProtectedNav('/map')}
          >
            <Map size={18} /> Explore Live Map <ArrowRight size={16} />
          </AnimatedButton>
        </motion.div>

      </div>
    </section>
  )
}
