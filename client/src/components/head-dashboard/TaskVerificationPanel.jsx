import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Camera, User, Clock, Zap } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { mockTasks } from '../../data/mockData'

export default function TaskVerificationPanel({ issue }) {
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(null)
  const [verified, setVerified] = useState(new Set())
  const [rejected, setRejected] = useState(new Set())

  if (!issue) {
    return (
      <div className="glass rounded-2xl p-8 text-center h-full flex items-center justify-center">
        <div>
          <div className="text-4xl mb-3">👈</div>
          <p className="text-base-content/40 text-sm">Select an issue to view micro-tasks</p>
        </div>
      </div>
    )
  }

  const tasks = mockTasks.filter((t) => t.issueId === issue.id)

  const handleVerify = async (taskId) => {
    setVerifying(taskId)
    await api.tasks.submit(taskId, {})
    setVerified((p) => new Set([...p, taskId]))
    setVerifying(null)
  }

  const handleReject = (taskId) => {
    setRejected((p) => new Set([...p, taskId]))
  }

  return (
    <motion.div
      key={issue.id}
      className="glass rounded-2xl p-5 h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <span className="text-meta text-primary block mb-1">MICRO-TASK VERIFICATION</span>
      <h3 className="text-sm font-bold text-base-content mb-4 line-clamp-2">{issue.title}</h3>

      {/* Issue image */}
      {issue.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-4 h-28">
          <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-meta text-base-content/40">Task Completion</span>
          <span className="text-data text-xs text-primary">{issue.completedTasks}/{issue.taskCount}</span>
        </div>
        <progress
          className="progress progress-primary h-1.5 w-full"
          value={issue.completedTasks}
          max={issue.taskCount}
        />
      </div>

      {/* Tasks */}
      {tasks.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-base-content/40 text-sm">No micro-tasks yet</p>
          <button
            className="btn btn-primary btn-sm mt-3"
            onClick={() => navigate(`/volunteer/task_001`)}
          >
            <Zap size={13} /> Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="glass border border-white/8 rounded-xl p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-semibold text-base-content">{task.title}</p>
                <span className="badge badge-primary badge-xs shrink-0">+{task.credits}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-base-content/40 mb-3">
                <span className="flex items-center gap-1"><Clock size={10} /> {task.estimatedTime}</span>
                <span className="flex items-center gap-1"><User size={10} /> Volunteer</span>
                <span className="flex items-center gap-1"><Camera size={10} /> Photos req.</span>
              </div>

              {/* Verify/Reject */}
              {verified.has(task.id) ? (
                <span className="badge badge-success gap-1 w-full justify-center">
                  <CheckCircle2 size={11} /> Verified
                </span>
              ) : rejected.has(task.id) ? (
                <span className="badge badge-error gap-1 w-full justify-center">
                  <XCircle size={11} /> Rejected
                </span>
              ) : (
                <div className="flex gap-2">
                  <button
                    className="btn btn-success btn-xs flex-1 gap-1"
                    disabled={verifying === task.id}
                    onClick={() => handleVerify(task.id)}
                  >
                    {verifying === task.id
                      ? <span className="loading loading-spinner loading-xs" />
                      : <><CheckCircle2 size={11} /> Verify</>
                    }
                  </button>
                  <button
                    className="btn btn-error btn-outline btn-xs flex-1 gap-1"
                    onClick={() => handleReject(task.id)}
                  >
                    <XCircle size={11} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Volunteer CTA */}
      <button
        className="btn btn-primary btn-sm w-full mt-4 gap-2"
        onClick={() => navigate('/volunteer/task_001')}
      >
        <Zap size={13} /> Volunteer for This Issue
      </button>
    </motion.div>
  )
}
