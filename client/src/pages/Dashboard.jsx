import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useUserStore } from '../store/useUserStore'
import { useAuth } from '../context/AuthContext'
import { mockTasks } from '../data/mockData'
import CivicScoreCard from '../components/dashboard/CivicScoreCard'
import ReliabilityMeter from '../components/dashboard/ReliabilityMeter'
import ContributionTimeline from '../components/dashboard/ContributionTimeline'
import BadgeCollection from '../components/dashboard/BadgeCollection'
import Leaderboard from '../components/dashboard/Leaderboard'
import IssueCard from '../components/common/IssueCard'
import { useIssueStore } from '../store/useIssueStore'

export default function Dashboard() {
  const { user, leaderboard, timeline, badges } = useUserStore()
  const { issues } = useIssueStore()
  const { user: authUser } = useAuth()
  const navigate = useNavigate()

  const myIssues = issues.slice(0, 3)

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
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={() => navigate('/volunteer/task_001')}
        >
          <Zap size={14} /> Pick a Task
        </button>
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

      {/* Open tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-meta text-primary">AVAILABLE TASKS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {mockTasks.map((task) => (
            <motion.div
              key={task.id}
              className="glass rounded-2xl p-4 border border-white/8 cursor-pointer hover:border-primary/30 transition-colors"
              whileHover={{ y: -3 }}
              onClick={() => navigate(`/volunteer/${task.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-base-content">{task.title}</span>
                <span className="badge badge-primary badge-xs">+{task.credits} pts</span>
              </div>
              <p className="text-xs text-base-content/50 line-clamp-2 mb-3">{task.description}</p>
              <div className="flex items-center justify-between text-meta text-base-content/40">
                <span>⏱ {task.estimatedTime}</span>
                <span className="badge badge-ghost badge-xs">{task.difficulty}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.main>
  )
}
