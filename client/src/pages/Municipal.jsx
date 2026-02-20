import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, ShieldAlert, CheckCircle2, Wrench } from 'lucide-react'
import { useIssueStore } from '../store/useIssueStore'
import IssueList from '../components/head-dashboard/IssueList'
import SeverityFilter from '../components/head-dashboard/SeverityFilter'
import SeverityBadge from '../components/common/SeverityBadge'
import PriorityScore from '../components/common/PriorityScore'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Municipal() {
  const { filter, setFilter, getEscalatedIssues } = useIssueStore()
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [acknowledged, setAcknowledged] = useState(new Set())
  const [assigned, setAssigned] = useState(new Set())
  const [resolved, setResolved] = useState(new Set())

  const escalated = useMemo(() => getEscalatedIssues(), [getEscalatedIssues])

  const filtered = useMemo(() => {
    const bySeverity = filter === 'all'
      ? escalated
      : escalated.filter((i) => i.severity === filter)
    return bySeverity
  }, [escalated, filter])

  const criticalCount = escalated.filter((i) => i.severity === 'critical').length

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
          <span className="text-meta text-primary">MUNICIPAL COMMAND</span>
          <h1 className="text-heading text-base-content mt-1 flex items-center gap-2">
            <Building2 size={22} className="text-primary" />
            Escalation Control Center
          </h1>
        </div>

        {criticalCount > 0 && (
          <motion.div
            className="alert alert-error alert-soft rounded-xl"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ShieldAlert size={16} />
            <span className="text-sm font-semibold">
              {criticalCount} critical issue{criticalCount > 1 ? 's' : ''} require municipal action
            </span>
          </motion.div>
        )}
      </div>

      {/* Stats row */}
      <div className="stats stats-horizontal glass w-full mb-6 shadow-none">
        {[
          { title: 'Escalated', value: escalated.length, desc: 'From local heads', color: 'text-base-content' },
          { title: 'Critical', value: escalated.filter((i) => i.severity === 'critical').length, desc: 'Immediate action', color: 'text-error' },
          { title: 'High', value: escalated.filter((i) => i.severity === 'high').length, desc: 'Resource needed', color: 'text-warning' },
          { title: 'Resolved', value: resolved.size, desc: 'Acknowledged', color: 'text-success' },
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
            {filtered.length} escalations — sorted by priority score
          </p>
          <IssueList
            issues={[...filtered].sort((a, b) => b.priority - a.priority)}
            onSelect={setSelectedIssue}
            selectedId={selectedIssue?.id}
            showEscalationMeta
          />
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {!selectedIssue ? (
            <div className="glass rounded-2xl p-8 text-center h-full flex items-center justify-center">
              <div>
                <div className="text-4xl mb-3">🏛️</div>
                <p className="text-base-content/40 text-sm">Select an escalated issue to review</p>
              </div>
            </div>
          ) : (
            <motion.div
              key={selectedIssue.id}
              className="glass rounded-2xl p-5 h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="text-meta text-primary block mb-1">ESCALATION DETAILS</span>
              <h3 className="text-sm font-bold text-base-content mb-4 line-clamp-2">{selectedIssue.title}</h3>

              {selectedIssue.imageUrl && (
                <div className="rounded-xl overflow-hidden mb-4 h-28">
                  <img src={selectedIssue.imageUrl} alt={selectedIssue.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <SeverityBadge severity={selectedIssue.severity} size="sm" />
                <PriorityScore score={selectedIssue.priority} size="sm" />
              </div>

              <div className="space-y-2 text-xs text-base-content/60 mb-4">
                <div className="flex items-center justify-between">
                  <span>Escalated from</span>
                  <span className="text-base-content">{selectedIssue.escalatedFrom || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Escalated at</span>
                  <span className="text-base-content">{formatDate(selectedIssue.escalatedAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="text-base-content">{selectedIssue.location}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className={`btn btn-sm flex-1 gap-1 ${acknowledged.has(selectedIssue.id) ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => setAcknowledged(new Set([...acknowledged, selectedIssue.id]))}
                >
                  <CheckCircle2 size={13} />
                  {acknowledged.has(selectedIssue.id) ? 'Acknowledged' : 'Acknowledge'}
                </button>
                <button
                  className={`btn btn-sm flex-1 gap-1 ${assigned.has(selectedIssue.id) ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setAssigned(new Set([...assigned, selectedIssue.id]))}
                >
                  <Wrench size={13} />
                  {assigned.has(selectedIssue.id) ? 'Team Assigned' : 'Assign Team'}
                </button>
              </div>

              <button
                className={`btn btn-sm w-full mt-3 gap-2 ${resolved.has(selectedIssue.id) ? 'btn-success' : 'btn-error'}`}
                onClick={() => setResolved(new Set([...resolved, selectedIssue.id]))}
              >
                <CheckCircle2 size={13} />
                {resolved.has(selectedIssue.id) ? 'Marked Resolved' : 'Mark Resolved'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.main>
  )
}
