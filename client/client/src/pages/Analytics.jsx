import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BarChart2, TrendingUp, CheckCircle2, Users, Zap, Clock } from 'lucide-react'
import { mockAnalytics } from '../data/mockData'

function AnimatedBar({ value, max, color, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const pct = Math.round((value / max) * 100)

  return (
    <div ref={ref} className="h-2 bg-base-300 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : {}}
        transition={{ duration: 1, ease: 'easeOut', delay }}
      />
    </div>
  )
}

export default function Analytics() {
  const data = mockAnalytics
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const topStats = [
    { label: 'Total Issues', value: data.totalIssues, icon: BarChart2, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    { label: 'Resolved', value: data.resolvedIssues, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
    { label: 'Active Volunteers', value: data.activeVolunteers, icon: Users, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
    { label: 'Avg. Resolution', value: `${data.avgResolutionDays}d`, icon: Clock, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
    { label: 'Civic Credits', value: `${(data.totalCredits / 1000).toFixed(0)}K+`, icon: Zap, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
    { label: 'Resolution Rate', value: `${data.resolutionRate}%`, icon: TrendingUp, color: 'text-info', bg: 'bg-info/10', border: 'border-info/20' },
  ]

  const maxCount = Math.max(...data.categoryBreakdown.map((c) => c.count))
  const maxMonth = Math.max(...data.monthlyTrend.map((m) => m.issues))

  const categoryColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-info', 'bg-warning', 'bg-success']

  return (
    <motion.main
      ref={ref}
      className="container mx-auto px-4 py-8 space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div>
        <span className="text-meta text-primary">PLATFORM ANALYTICS</span>
        <h1 className="text-heading text-base-content mt-1 flex items-center gap-2">
          <BarChart2 size={22} className="text-primary" /> Civic Intelligence Dashboard
        </h1>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {topStats.map((s, i) => (
          <motion.div
            key={s.label}
            className={`glass border ${s.border} rounded-2xl p-4 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08 }}
          >
            <div className={`w-9 h-9 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center mx-auto mb-3`}>
              <s.icon size={16} className={s.color} />
            </div>
            <div className={`text-data font-black text-xl ${s.color}`}>{s.value}</div>
            <div className="text-meta text-base-content/40 text-[0.6rem] mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Two-column: category + monthly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <motion.div
          className="glass-strong rounded-2xl p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <span className="text-meta text-primary block mb-5">ISSUES BY CATEGORY</span>
          <div className="space-y-4">
            {data.categoryBreakdown.map((cat, i) => (
              <div key={cat.category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-base-content/70">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-data text-xs text-success">{cat.resolved} resolved</span>
                    <span className="text-data text-xs text-base-content/40">/ {cat.count}</span>
                  </div>
                </div>
                <div className="h-2 bg-base-300 rounded-full overflow-hidden relative">
                  <AnimatedBar value={cat.count} max={maxCount} color={`${categoryColors[i % categoryColors.length]}`} delay={0.4 + i * 0.08} />
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full bg-success/40"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${(cat.resolved / maxCount) * 100}%` } : {}}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 + i * 0.08 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly trend */}
        <motion.div
          className="glass-strong rounded-2xl p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <span className="text-meta text-primary block mb-5">MONTHLY TREND</span>
          <div className="flex items-end justify-between gap-2 h-40">
            {data.monthlyTrend.map((m, i) => {
              const issuePct = (m.issues / maxMonth) * 100
              const resolvedPct = (m.resolved / maxMonth) * 100
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5 justify-center" style={{ height: '120px' }}>
                    {/* Issues bar */}
                    <motion.div
                      className="flex-1 bg-primary/40 rounded-t-sm"
                      initial={{ height: 0 }}
                      animate={inView ? { height: `${issuePct}%` } : {}}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 + i * 0.1 }}
                    />
                    {/* Resolved bar */}
                    <motion.div
                      className="flex-1 bg-success rounded-t-sm"
                      initial={{ height: 0 }}
                      animate={inView ? { height: `${resolvedPct}%` } : {}}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 + i * 0.1 }}
                    />
                  </div>
                  <span className="text-meta text-base-content/40 text-[0.6rem]">{m.month}</span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <span className="text-xs text-base-content/50">Reported</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-success" />
              <span className="text-xs text-base-content/50">Resolved</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* This month highlight */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
      >
        <span className="text-meta text-primary block mb-4">THIS MONTH AT A GLANCE</span>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-data text-3xl font-black text-primary">{data.thisMonth.issues}</div>
            <div className="text-meta text-base-content/40">Issues Reported</div>
          </div>
          <div>
            <div className="text-data text-3xl font-black text-success">{data.thisMonth.resolved}</div>
            <div className="text-meta text-base-content/40">Issues Resolved</div>
          </div>
          <div>
            <div className="text-data text-3xl font-black text-secondary">{data.thisMonth.volunteers}</div>
            <div className="text-meta text-base-content/40">Active Volunteers</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-meta text-base-content/40">Monthly Resolution Rate</span>
            <span className="text-meta text-success">{Math.round((data.thisMonth.resolved / data.thisMonth.issues) * 100)}%</span>
          </div>
          <AnimatedBar
            value={data.thisMonth.resolved}
            max={data.thisMonth.issues}
            color="bg-gradient-to-r from-primary to-success"
            delay={0.8}
          />
        </div>
      </motion.div>
    </motion.main>
  )
}
