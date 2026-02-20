import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle } from 'lucide-react'
import { useIssueStore } from '../store/useIssueStore'
import IssueList from '../components/head-dashboard/IssueList'
import SeverityFilter from '../components/head-dashboard/SeverityFilter'
import TaskVerificationPanel from '../components/head-dashboard/TaskVerificationPanel'

export default function Escalations() {
  const { issues, filter, setFilter, getPrioritySorted } = useIssueStore()
  const [selectedIssue, setSelectedIssue] = useState(null)

  const sorted = getPrioritySorted()
  const filtered = filter === 'all'
    ? sorted
    : sorted.filter((i) => i.severity === filter)

  const criticalCount = issues.filter((i) => i.severity === 'critical').length

  return (
    <motion.main
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <span className="text-meta text-primary">LOCAL HEAD DASHBOARD</span>
          <h1 className="text-heading text-base-content mt-1 flex items-center gap-2">
            <Shield size={22} className="text-primary" />
            Issue Command Center
          </h1>
        </div>

        {criticalCount > 0 && (
          <motion.div
            className="alert alert-error alert-soft rounded-xl"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle size={16} />
            <span className="text-sm font-semibold">
              {criticalCount} critical issue{criticalCount > 1 ? 's' : ''} require immediate attention
            </span>
          </motion.div>
        )}
      </div>

      {/* Stats row */}
      <div className="stats stats-horizontal glass w-full mb-6 shadow-none">
        {[
          { title: 'Total Open', value: issues.filter((i) => i.status !== 'completed').length, desc: 'Active issues', color: 'text-base-content' },
          { title: 'Critical', value: issues.filter((i) => i.severity === 'critical').length, desc: 'Needs now', color: 'text-error' },
          { title: 'In Progress', value: issues.filter((i) => i.status === 'in_progress').length, desc: 'Being addressed', color: 'text-warning' },
          { title: 'Resolved', value: issues.filter((i) => i.status === 'completed').length, desc: 'This month', color: 'text-success' },
        ].map((s) => (
          <div key={s.title} className="stat py-4 px-5">
            <div className="stat-title text-base-content/50 text-xs">{s.title}</div>
            <div className={`stat-value text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="stat-desc text-base-content/30">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mb-4">
        <SeverityFilter value={filter} onChange={setFilter} />
      </div>

      {/* Main layout: list + panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Issue list */}
        <div className="lg:col-span-3">
          <p className="text-meta text-base-content/40 mb-3">
            {filtered.length} issues — sorted by priority score
          </p>
          <IssueList
            issues={filtered}
            onSelect={setSelectedIssue}
            selectedId={selectedIssue?.id}
          />
        </div>

        {/* Verification panel */}
        <div className="lg:col-span-2">
          <TaskVerificationPanel issue={selectedIssue} />
        </div>
      </div>
    </motion.main>
  )
}
