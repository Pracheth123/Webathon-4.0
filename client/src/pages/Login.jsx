import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AnimatedButton from '../components/common/AnimatedButton'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    login(email, password, role)
    if (role === 'local_head') navigate('/head')
    else if (role === 'municipal') navigate('/municipal')
    else navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-base-100 grid-overlay flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-primary/8 blur-3xl floating pointer-events-none" />
      <div className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-secondary/8 blur-3xl floating-slow pointer-events-none" />

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4 glow-primary"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Shield size={28} className="text-primary" />
          </motion.div>
          <h1 className="text-heading text-base-content">CivicPulse</h1>
          <p className="text-meta text-base-content/40 mt-1">Micro-Execution Governance Platform</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8">
          <h2 className="text-lg font-bold text-base-content mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/60">Email</legend>
              <label className="input glass border-white/10 flex items-center gap-2 w-full">
                <Mail size={15} className="text-base-content/40" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="grow bg-transparent"
                />
              </label>
            </fieldset>

            {/* Password */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/60">Password</legend>
              <label className="input glass border-white/10 flex items-center gap-2 w-full">
                <Lock size={15} className="text-base-content/40" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="grow bg-transparent"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="text-base-content/40 hover:text-base-content">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </label>
            </fieldset>

            {/* Role selector */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/60">Sign in as</legend>
              <div className="flex gap-3">
                {['citizen', 'local_head', 'municipal'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`flex-1 glass border rounded-xl py-2.5 px-3 text-sm font-medium transition-all ${
                      role === r
                        ? 'border-primary/60 bg-primary/15 text-primary'
                        : 'border-white/10 text-base-content/60 hover:border-white/20'
                    }`}
                    onClick={() => setRole(r)}
                  >
                    {r === 'citizen'
                      ? '👤 Citizen'
                      : r === 'local_head'
                        ? '🛡️ Local Head'
                        : '🏛️ Municipal'}
                  </button>
                ))}
              </div>
            </fieldset>

            <AnimatedButton
              type="submit"
              variant="primary"
              size="lg"
              glow
              block
              disabled={loading}
              className="mt-6"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <Zap size={16} /> Sign In
                </>
              )}
            </AnimatedButton>
          </form>

          <p className="text-center text-meta text-base-content/30 mt-6">
            Demo — any credentials work
          </p>
        </div>
      </motion.div>
    </div>
  )
}
