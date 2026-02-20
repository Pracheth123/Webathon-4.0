import { motion } from 'framer-motion'
import { UserPlus, Wrench, CheckCircle2 } from 'lucide-react'

export default function WorkerAssignmentPanel({ issue, assignedTeam, verified, onAssign, onVerify }) {
  if (!issue) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-base-content/40">
        Select an issue to assign workers
      </div>
    )
  }

  return (
    <motion.div
      key={issue.id}
      className="glass rounded-2xl p-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <span className="text-meta text-primary block mb-2">WORKER ASSIGNMENT</span>
      <h3 className="text-sm font-bold text-base-content mb-3 line-clamp-2">{issue.title}</h3>

      <div className="glass rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between text-xs text-base-content/60">
          <span>Assigned Team</span>
          <span className="text-base-content">{assignedTeam || issue.assignedTo || 'Not assigned'}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn btn-primary btn-sm flex-1 gap-1" onClick={() => onAssign(issue.id)}>
          <UserPlus size={12} /> Assign Team
        </button>
        <button
          className={`btn btn-sm flex-1 gap-1 ${verified ? 'btn-success' : 'btn-outline'}`}
          onClick={() => onVerify(issue.id)}
        >
          <CheckCircle2 size={12} /> {verified ? 'Verified' : 'Verify Work'}
        </button>
      </div>

      <div className="mt-3 text-xs text-base-content/40">
        <Wrench size={12} className="inline mr-1" /> Assigning a team will notify workers and lock the task.
      </div>
    </motion.div>
  )
}
