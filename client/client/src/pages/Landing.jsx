import { motion } from 'framer-motion'
import HeroSection from '../components/landing/HeroSection'
import LiveStats from '../components/landing/LiveStats'
import FeatureShowcase from '../components/landing/FeatureShowcase'

export default function Landing() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <HeroSection />
      <LiveStats />
      <FeatureShowcase />

      {/* Footer */}
      <footer className="footer footer-center p-8 glass-strong border-t border-white/5">
        <div>
          <p className="text-meta text-base-content/30">
            © 2026 CivicPulse — Micro-Execution Governance Platform
          </p>
        </div>
      </footer>
    </motion.main>
  )
}
