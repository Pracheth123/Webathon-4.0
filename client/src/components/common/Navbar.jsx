import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Map, LayoutDashboard, BarChart2, Users, LogOut, Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, role, setRole, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { to: '/', label: 'Home', icon: Shield, end: true },
    { to: '/map', label: 'Live Map', icon: Map },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(role === 'local_head'
      ? [
          { to: '/head', label: 'Issue Queue', icon: Users },
          { to: '/analytics', label: 'Analytics', icon: BarChart2 },
        ]
      : role === 'municipal'
        ? [
            { to: '/municipal', label: 'Municipal Desk', icon: Users },
            { to: '/analytics', label: 'Analytics', icon: BarChart2 },
          ]
        : []),
  ]

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-primary/15 text-primary'
        : 'text-base-content/60 hover:text-base-content hover:bg-white/5'
    }`

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-white/5 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Shield size={15} className="text-primary" />
          </div>
          <span className="font-bold text-base-content text-sm hidden sm:block tracking-tight">
            CivicPulse
          </span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              <link.icon size={14} />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Role switcher */}
          <select
            className="select select-xs glass border-white/10 text-xs hidden sm:flex"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="citizen">👤 Citizen</option>
            <option value="local_head">🛡️ Local Head</option>
            <option value="municipal">🏛️ Municipal</option>
          </select>

          {/* Score chip */}
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 glass rounded-xl px-3 py-1.5">
              <Zap size={12} className="text-primary pulse-glow" />
              <span className="text-data text-primary text-xs font-bold">
                {user.civicScore.toLocaleString()}
              </span>
              <span className="text-meta text-base-content/40 text-[0.6rem]">pts</span>
            </div>
          )}

          {/* Avatar dropdown */}
          {user && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="avatar cursor-pointer">
                <div className="w-8 rounded-full ring-2 ring-primary/30 ring-offset-1 ring-offset-base-100">
                  <img src={user.avatar} alt={user.name} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu glass-strong rounded-xl mt-2 w-52 p-2 shadow-2xl"
              >
                <li className="px-2 pt-1 pb-2">
                  <span className="text-sm font-semibold text-base-content block">{user.name}</span>
                  <span className="text-meta text-base-content/40">Rank #{user.rank}</span>
                </li>
                <div className="divider my-0" />
                <li>
                  <button onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard size={14} /> My Dashboard
                  </button>
                </li>
                <li>
                  <button className="text-error" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden btn btn-ghost btn-sm btn-square"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden glass-strong border-t border-white/5 px-4 py-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1 mb-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMobileOpen(false)}
                  className={linkClass}
                >
                  <link.icon size={14} />
                  {link.label}
                </NavLink>
              ))}
            </div>
            <select
              className="select select-xs glass border-white/10 text-xs w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="citizen">👤 Citizen View</option>
              <option value="local_head">🛡️ Local Head View</option>
              <option value="municipal">🏛️ Municipal View</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
