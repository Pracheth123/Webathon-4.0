import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ThumbsUp, ChevronRight, ArrowUpCircle } from 'lucide-react'
import { useState } from 'react'
import SeverityBadge from '../common/SeverityBadge'
import PriorityScore from '../common/PriorityScore'
import DeadlineCountdown from './DeadlineCountdown'
import { api } from '../../services/api'

export default function IssueList({ issues, onSelect, selectedId, showEscalationMeta = false }) {
  const [escalating, setEscalating] = useState(null)
  const [escalated, setEscalated] = useState(new Set())

  const handleEscalate = async (e, issueId) => {
    e.stopPropagation()
    setEscalating(issueId)
    await api.issues.escalate(issueId)
    setEscalating(null)
    setEscalated((prev) => new Set([...prev, issueId]))
  }

  return (
    <div className="space-y-2 overflow-y-auto scrollbar-hidden" style={{ maxHeight: 'calc(100vh - 260px)' }}>
      <AnimatePresence>
        {issues.map((issue, i) => (
          <motion.div
            key={issue.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: i * 0.06 }}
            className={`glass border rounded-xl p-4 cursor-pointer transition-all ${
              selectedId === issue.id
                ? 'border-primary/40 bg-primary/5'
                : 'border-white/8 hover:border-white/20'
            }`}
            onClick={() => onSelect(issue)}
          >
            <div className="flex items-start gap-3">
              {/* Priority score */}
              <PriorityScore score={issue.priority} size="sm" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-base-content line-clamp-1">{issue.title}</p>
                  <SeverityBadge severity={issue.severity} size="xs" />
                </div>

                <div className="flex items-center gap-1 text-base-content/50 mb-2">
                  <MapPin size={10} />
                  <span className="text-meta text-[0.6rem]">{issue.location}</span>
                </div>

                {showEscalationMeta && issue.escalatedFrom && (
                  <div className="flex items-center gap-2 text-base-content/50 mb-2">
                    <span className="text-meta text-[0.6rem]">Escalated from</span>
                    <span className="text-xs text-base-content">{issue.escalatedFrom}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <DeadlineCountdown deadline={issue.deadline} />

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-xs text-base-content/40">
                      <ThumbsUp size={10} />{issue.upvotes}
                    </span>

                    {/* Escalate */}
                    <motion.button
                      className={`btn btn-xs gap-1 ${
                        escalated.has(issue.id) ? 'btn-success' : 'btn-error btn-outline'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      disabled={escalating === issue.id || escalated.has(issue.id)}
                      onClick={(e) => handleEscalate(e, issue.id)}
                    >
                      {escalating === issue.id ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <>
                          <ArrowUpCircle size={11} />
                          {escalated.has(issue.id) ? 'Escalated' : 'Escalate'}
                        </>
                      )}
                    </motion.button>

                    <ChevronRight size={14} className={`transition-transform ${selectedId === issue.id ? 'text-primary rotate-90' : 'text-base-content/30'}`} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
