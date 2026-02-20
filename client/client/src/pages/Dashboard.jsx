import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Activity, Shield, ClipboardList, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useUserStore } from '../store/useUserStore'
import { useAuth } from '../context/AuthContext'
import CivicScoreCard from '../components/dashboard/CivicScoreCard'
import ReliabilityMeter from '../components/dashboard/ReliabilityMeter'
import ContributionTimeline from '../components/dashboard/ContributionTimeline'
import BadgeCollection from '../components/dashboard/BadgeCollection'
import Leaderboard from '../components/dashboard/Leaderboard'
import IssueCard from '../components/common/IssueCard'
import { useIssueStore } from '../store/useIssueStore'
import VolunteerRequests from '../components/head-dashboard/VolunteerRequests'
import { mockVolunteerRequests } from '../data/mockRequests'

export default function Dashboard() {
  const { user, leaderboard, timeline, badges } = useUserStore()
  const { issues, getPrioritySorted } = useIssueStore()
  const { role } = useAuth()
  const navigate = useNavigate()

  const myIssues = issues.slice(0, 3)
  const monitoring = issues.slice(0, 4)
  const topPriority = getPrioritySorted().slice(0, 4)

  const [requests, setRequests] = useState(mockVolunteerRequests)

  const handleApprove = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  if (role === 'local_head') {
    const openIssues = issues.filter((i) => i.status !== 'completed')
    const criticalIssues = issues.filter((i) => i.severity === 'critical')
    const inProgress = issues.filter((i) => i.status === 'in_progress')

    return (
      <motion.main
        className="container mx-auto px-4 py-8 space-y-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-meta text-primary">LOCAL HEAD</span>
            <h1 className="text-heading text-base-content mt-1">
              Command Dashboard
            </h1>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/head')}>
            Open Issue Queue
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Pending Requests', value: requests.length, icon: ClipboardList, color: 'text-warning' },
            { label: 'Open Issues', value: openIssues.length, icon: Shield, color: 'text-primary' },
            { label: 'Critical', value: criticalIssues.length, icon: AlertTriangle, color: 'text-error' },
            { label: 'In Progress', value: inProgress.length, icon: CheckCircle2, color: 'text-success' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-meta text-base-content/40">{s.label}</div>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <s.icon size={18} className={s.color} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-meta text-primary">VOLUNTEER APPROVALS</span>
            <span className="badge badge-ghost badge-sm">{requests.length} pending</span>
          </div>
          <VolunteerRequests requests={requests} onApprove={handleApprove} onReject={handleReject} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-meta text-primary">PRIORITY ISSUES</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topPriority.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onClick={() => navigate('/head')} compact />
            ))}
          </div>
        </div>
      </motion.main>
    )
  }

  return (
    <motion.main
      className="container mx-auto px-4 py-8 space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-meta text-primary">YOUR PROFILE</span>
          <h1 className="text-heading text-base-content mt-1">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
        </div>
        <div className="badge badge-ghost badge-sm gap-2">
          <Activity size={12} /> Monitoring Mode
        </div>
      </div>

      {/* Top row: Score + Reliability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <CivicScoreCard user={user} />
        </div>
        <div className="md:col-span-2">
          <ReliabilityMeter score={user.reliabilityScore} />
        </div>
      </div>

      {/* Middle row: Timeline + Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContributionTimeline timeline={timeline} />
        <Leaderboard leaderboard={leaderboard} currentUserId={user.id} />
      </div>

      {/* Badges */}
      <BadgeCollection badges={badges} earnedIds={user.badges} />

      {/* Recent Issues */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-meta text-primary">NEARBY ISSUES</span>
          <button className="btn btn-ghost btn-xs" onClick={() => navigate('/map')}>
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {myIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={() => navigate('/map')} />
          ))}
        </div>
      </div>

      {/* Monitoring */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-meta text-primary">ACTIVE WORK MONITORING</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {monitoring.map((issue) => (
            <motion.div
              key={issue.id}
              className="glass rounded-2xl p-4 border border-white/8"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-base-content line-clamp-1">
                    {issue.title}
                  </p>
                  <p className="text-xs text-base-content/50 line-clamp-1">{issue.location}</p>
                </div>
                <span className={`badge badge-sm ${issue.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                  {issue.status === 'completed' ? 'Resolved' : 'In Progress'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-base-content/50">
                <span>Assigned: {issue.assignedTo || 'Pending'}</span>
                <button className="btn btn-ghost btn-xs" onClick={() => navigate('/map')}>
                  Track →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.main>
  )
}
