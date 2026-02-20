import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Map, Shield, Zap, Award, BarChart2, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from '../common/AnimatedButton'

const FEATURES = [
  {
    icon: Map,
    title: 'Public Transparency Map',
    description: 'Live issue tracking with color-coded severity markers. Every civic problem visible, every resolution documented.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    to: '/map',
    size: 'col-span-2 md:col-span-1',
  },
  {
    icon: Shield,
    title: 'AI-Powered Prioritization',
    description: 'Severity detection and priority scoring powered by machine learning ensures critical issues get immediate attention.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
    to: '/head',
    size: '',
  },
  {
    icon: Zap,
    title: 'Micro-Task Execution',
    description: 'Break large civic issues into volunteer micro-tasks. Earn credits, gain badges, build your civic reputation.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    to: '/dashboard',
    size: '',
  },
  {
    icon: Award,
    title: 'Civic Credit System',
    description: 'Gamified participation through a transparent scoring system. Your civic score reflects your real-world impact.',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    to: '/dashboard',
    size: '',
  },
  {
    icon: BarChart2,
    title: 'Analytics & Insights',
    description: 'Deep analytics for local authorities — track resolution rates, volunteer engagement, and resource allocation.',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    to: '/analytics',
    size: '',
  },
  {
    icon: Users,
    title: 'Community Governance',
    description: 'Empowering citizens, volunteers, and local heads in a transparent three-tier governance model.',
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/20',
    to: '/dashboard',
    size: 'col-span-2 md:col-span-1',
  },
]

export default function FeatureShowcase() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const navigate = useNavigate()

  return (
    <section ref={ref} className="py-20 px-4 bg-base-200/30">
      <div className="container mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="text-meta text-primary">CAPABILITIES</span>
          <h2 className="text-heading text-base-content mt-2 mb-3">
            Everything Civic Governance Needs
          </h2>
          <p className="text-base-content/50 max-w-xl mx-auto">
            From issue reporting to resolution — a complete micro-execution stack for modern cities.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className={`glass border ${f.border} rounded-2xl p-6 cursor-pointer group ${f.size}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => navigate(f.to)}
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon size={20} className={f.color} />
              </div>
              <h3 className="font-semibold text-base-content mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-base-content/50 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA section */}
        <motion.div
          className="mt-16 glass-strong rounded-3xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-heading text-base-content mb-3">Ready to make an impact?</h3>
          <p className="text-base-content/50 mb-8">
            Join thousands of citizens already transforming their communities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <AnimatedButton variant="primary" size="lg" glow onClick={() => navigate('/dashboard')}>
              Start Contributing
            </AnimatedButton>
            <AnimatedButton variant="outline" size="lg" onClick={() => navigate('/map')}>
              View Live Issues
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
