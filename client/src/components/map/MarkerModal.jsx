import { motion } from 'framer-motion'
import { MapPin, Clock, ThumbsUp, CheckSquare, Zap, ArrowUpCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SeverityBadge from '../common/SeverityBadge'
import AnimatedButton from '../common/AnimatedButton'
import { api } from '../../services/api'
import { useState } from 'react'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const d = Math.floor(diff / 86400000)
  if (d > 0) return `${d}d ago`
  const h = Math.floor(diff / 3600000)
  if (h > 0) return `${h}h ago`
  return 'Just now'
}

export default function MarkerModal({ issue, onClose }) {
  const navigate = useNavigate()
  const [escalating, setEscalating] = useState(false)
  const [escalated, setEscalated] = useState(false)

  if (!issue) return null

  const progress = issue.taskCount > 0
    ? Math.round((issue.completedTasks / issue.taskCount) * 100)
    : 0

  const handleEscalate = async () => {
    setEscalating(true)
    await api.issues.escalate(issue.id)
    setEscalating(false)
    setEscalated(true)
  }

  return (
    <motion.div
      className="absolute bottom-4 left-4 z-20 w-80 glass-strong rounded-2xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          className="absolute top-2 right-2 btn btn-ghost btn-xs btn-square glass"
          onClick={onClose}
        >
          <X size={14} />
        </button>
        <div className="absolute bottom-2 left-3">
          <SeverityBadge severity={issue.severity} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-base-content text-sm leading-snug">{issue.title}</h3>

        <div className="flex items-center gap-1 text-base-content/50">
          <MapPin size={11} />
          <span className="text-meta text-[0.62rem]">{issue.location}</span>
        </div>

        <p className="text-xs text-base-content/60 line-clamp-2">{issue.description}</p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-base-content/40">
          <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(issue.reportedAt)}</span>
          <span className="flex items-center gap-1"><ThumbsUp size={11} />{issue.upvotes}</span>
          <span className="flex items-center gap-1"><CheckSquare size={11} />{issue.completedTasks}/{issue.taskCount} tasks</span>
        </div>

        {/* Progress */}
        {issue.taskCount > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-meta text-base-content/40">Resolution Progress</span>
              <span className="text-meta text-primary">{progress}%</span>
            </div>
            <progress className="progress progress-primary h-1.5 w-full" value={progress} max="100" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <AnimatedButton
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/volunteer/task_00${issue.id}`)}
          >
            <Zap size={13} /> Volunteer
          </AnimatedButton>
          <AnimatedButton
            variant={escalated ? 'success' : 'error'}
            size="sm"
            className="flex-1"
            disabled={escalating || escalated}
            onClick={handleEscalate}
          >
            {escalating ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <>
                <ArrowUpCircle size={13} />
                {escalated ? 'Escalated' : 'Escalate'}
              </>
            )}
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  )
}
